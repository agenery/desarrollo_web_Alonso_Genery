import os
import re
import hashlib
from datetime import datetime, timedelta

import filetype
from flask import Flask, request, redirect, render_template, url_for
from werkzeug.utils import secure_filename

from database import db, Voluntario, Region, Comuna, Avistamiento, Ave, Registro

app = Flask(__name__)
app.secret_key = "clave_secreta_tarea2"
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://cc5002:programacionweb@localhost:3306/tarea2'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['UPLOAD_SUBFOLDER'] = 'uploads'
app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'static', app.config['UPLOAD_SUBFOLDER'])

EXTENSIONES_PERMITIDAS = {
    'jpg', 'jpeg', 'png', 'gif', 'webp',
    'mp4', 'webm', 'ogg', 'mov'
}

db.init_app(app)


def validar_email(email):
    if not email:
        return False
    patron = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    return re.match(patron, email) is not None


def validar_telefono(telefono):
    if not telefono:
        return False
    patron = r'^9[0-9]{8}$'
    return re.match(patron, telefono) is not None


def obtener_entero_valido(valor):
    try:
        return int(valor)
    except (TypeError, ValueError):
        return None


def validar_fecha_hora(fecha_hora_str):
    try:
        fecha_dt = datetime.strptime(fecha_hora_str, '%Y-%m-%dT%H:%M')
    except (TypeError, ValueError):
        return None

    ahora = datetime.now()
    hace_un_anio = ahora - timedelta(days=365)

    if fecha_dt > ahora or fecha_dt < hace_un_anio:
        return None

    return fecha_dt


def archivo_es_valido(archivo):
    tipo = filetype.guess(archivo)
    if tipo is None:
        return False
    return tipo.extension in EXTENSIONES_PERMITIDAS


def archivos_validos(archivos):
    archivos_reales = []
    for archivo in archivos:
        if archivo and archivo.filename:
            archivos_reales.append(archivo)

    if len(archivos_reales) == 0 or len(archivos_reales) > 3:
        return False

    for archivo in archivos_reales:
        if not archivo_es_valido(archivo):
            return False

    return True


def generar_nombre_archivo(archivo):
    _filename = hashlib.sha256(
        secure_filename(archivo.filename)
        .encode("utf-8")
    ).hexdigest()
    _extension = filetype.guess(archivo).extension
    return f"{_filename}.{_extension}"


@app.route("/")
def index():
    ultimos_avistamientos = (
        Avistamiento.query.order_by(Avistamiento.fecha_hora.desc()).limit(2).all()
    )
    return render_template("main.html", avistamientos=ultimos_avistamientos)


@app.route("/registrar-voluntario", methods=["GET", "POST"])
def registrar_voluntario():
    error = ""
    mensaje_exito = ""

    if request.method == "POST":
        nombre = (request.form.get("nombre") or "").strip()
        email = (request.form.get("email") or "").strip()
        telefono = (request.form.get("phone") or "").strip()
        comuna_id = obtener_entero_valido(request.form.get("select-comuna"))

        if not nombre or len(nombre) < 3:
            error = "El nombre es obligatorio y debe tener al menos 3 caracteres."
        elif not validar_email(email):
            error = "El correo electrónico no tiene un formato válido."
        elif not validar_telefono(telefono):
            error = "El teléfono debe tener 9 dígitos y comenzar con 9."
        elif comuna_id is None or Comuna.query.get(comuna_id) is None:
            error = "Debe seleccionar una comuna válida."
        else:
            nuevo_voluntario = Voluntario(
                nombre=nombre,
                email=email,
                telefono=telefono,
                comuna_id=comuna_id,
            )
            db.session.add(nuevo_voluntario)
            db.session.commit()

            return render_template(
                "registrar-voluntario.html",
                mensaje_exito=f"¡Gracias {nombre}! Tu registro como voluntario/a fue exitoso.",
                voluntario_id=nuevo_voluntario.id,
                regiones=Region.query.all(),
                comunas=Comuna.query.all(),
            )

    regiones = Region.query.all()
    comunas = Comuna.query.all()
    return render_template(
        "registrar-voluntario.html",
        error_msg=error,
        mensaje_exito=mensaje_exito,
        regiones=regiones,
        comunas=comunas,
    )


@app.route("/registrar-avistamiento", methods=["GET", "POST"])
def registrar_avistamiento():
    error = ""
    mensaje_exito = ""

    if request.method == "POST":
        voluntario_id = obtener_entero_valido(request.form.get("voluntario_id"))
        ave_id = obtener_entero_valido(request.form.get("ave_id"))
        lugar = (request.form.get("lugar") or "").strip()
        fecha_hora_str = request.form.get("fecha_hora")
        descripcion = (request.form.get("descripcion") or "").strip()
        archivos = request.files.getlist("archivos")

        fecha_dt = validar_fecha_hora(fecha_hora_str)

        if voluntario_id is None or Voluntario.query.get(voluntario_id) is None:
            error = "Debe seleccionar un voluntario válido."
        elif ave_id is None or Ave.query.get(ave_id) is None:
            error = "Debe seleccionar una especie de ave válida."
        elif not lugar or len(lugar) < 3:
            error = "El lugar es obligatorio y debe tener al menos 3 caracteres."
        elif fecha_dt is None:
            error = "La fecha debe estar entre hoy y hasta un año atrás, con formato válido."
        elif not archivos_validos(archivos):
            error = "Debe adjuntar entre 1 y 3 archivos válidos (foto o video real, no solo con la extensión correcta)."
        else:
            try:
                nuevo_avistamiento = Avistamiento(
                    voluntario_id=voluntario_id,
                    ave_id=ave_id,
                    lugar=lugar,
                    fecha_hora=fecha_dt,
                    descripcion=descripcion or None,
                )
                db.session.add(nuevo_avistamiento)
                db.session.commit()

                for archivo in archivos:
                    if archivo and archivo.filename:
                        filename = generar_nombre_archivo(archivo)
                        ruta_completa = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                        archivo.save(ruta_completa)

                        nuevo_registro = Registro(
                            ruta_archivo=app.config['UPLOAD_SUBFOLDER'],
                            nombre_archivo=filename,
                            avistamiento_id=nuevo_avistamiento.id,
                        )
                        db.session.add(nuevo_registro)

                db.session.commit()

                return render_template(
                    "registrar-avistamiento.html",
                    mensaje_exito="¡Avistamiento registrado con éxito! Gracias por tu aporte.",
                    voluntarios=Voluntario.query.all(),
                    aves=Ave.query.all(),
                )

            except Exception:
                db.session.rollback()
                error = "Ocurrió un error al procesar el registro. Intenta nuevamente."

    voluntarios = Voluntario.query.all()
    aves = Ave.query.all()
    return render_template(
        "registrar-avistamiento.html",
        error_msg=error,
        mensaje_exito=mensaje_exito,
        voluntarios=voluntarios,
        aves=aves,
    )


@app.route("/listado-avistamientos")
def listado_avistamientos():
    page = request.args.get('page', 1, type=int)
    if page < 1:
        page = 1

    avistamientos_paginados = Avistamiento.query.order_by(
        Avistamiento.fecha_hora.desc()
    ).paginate(page=page, per_page=5, error_out=False)

    return render_template("listado-avistamiento.html", paginacion=avistamientos_paginados)


@app.route("/avistamiento/<int:id>")
def detalle_avistamiento(id):
    avistamiento = Avistamiento.query.get_or_404(id)
    return render_template("detalle-avistamiento.html", avistamiento=avistamiento)


if __name__ == "__main__":
    app.run(debug=True)