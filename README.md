# Detalles de Tarea 2 - Alonso Genery

## Index
Esta es la página incial de la página. Se implemento una bienvenida, en la cual se puede navegar, yendo hacia las distintas partes de los registros y el listado de avistamientos, de forma que el usuario pueda decidir si solo ve las aves registradas, o por el contrario, el mismo quiere registrarse y registrar un ave por su cuenta.

Para el CSS lo hice lo más simple posible. Use el visto en auxiliares, y lo modifique según veia necesario para lograr sintonía entre todas las páginas del proyecto, para que se viera más limpio y parezca más una página real. (Se utilizó el mismo que se vio en mi tarea 1)

## Registro
Acá utilice lo visto en clases para generar las válidaciones. Ahora se uso las ventajas de Flask para generar una mejor interacción, y también que esta se acerca más a lo que se espera de una página web real. Aún así, solo pide los elementos más comunes para el registro, y no pide nada muy avanzado para lo visto en clases. Además, se usa la base de datos proporcionada para poder seleccionar la región, y posteriormente la comuna. De esta forma, se genera una interfaz mucho más fiel a las reales, y se puede usar mejor la información, ya que, en la tarea 1 simplemente se escribio como lista las comunas presentes a mano.

## Avistamiento

Siguiendo la lógica anterior, se uso lo visto en clases para regular cada apartado. Ahora para la fecha se utiliza una función que permite ingresar esta de manera mucho más fiel y no tan "artificial", generandole más comodidad al usuario. Además, se permite que se suban 3 archivos, y que se pueda dar una breve descripción de lo subido, de esa manera dandole más opciones al usuario para que registre al ave que quiera. Tambien se uso la base de datos de las aves, para que el usuario pueda ingresar con mayor detalle el ave vista, y de paso, que sea un ave existente.

## Listado

Para este ahora se registra en una carpeta local lo que el usuario registra, y lo muestra en la portada como resumen, así como en el apartado de listado. El usuario puede ingresar a esta parte y verá un resumen de cada registro que exista en la página, quien lo creo, que ave es, etc.

Además, para ver el detalle exacto de cada ave, se observa que se puede hacer click en cada registro, y este abrirá el detalle del mismo, dando a conocer el correo de quien registro para contactar en cualquier caso, además de que se podrán ver los archivos que el usuario subió para conocer mejor la especie de la cual están hablando.

## Estadísticas

Como en esta tarea se indica que aún no implementaremos esta parte, se agrego en la parte principal un link que no lleva a nada como placeholder, que simule el hecho de que la página existe, aunque todavía no la implementemos, para que así se vea todo más completo.
