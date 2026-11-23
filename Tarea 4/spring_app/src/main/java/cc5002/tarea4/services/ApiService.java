package cc5002.tarea4.services;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.stereotype.Service;

import cc5002.tarea4.models.Avistamiento;
import cc5002.tarea4.models.AvistamientoRepository;
import cc5002.tarea4.models.Nota;
import cc5002.tarea4.models.NotaRepository;

@Service
public class ApiService {
    public static final int LARGO_MAXIMO_BUSQUEDA = 100;
    private static final DateTimeFormatter FORMATO_DIA = DateTimeFormatter.ofPattern("dd-MM-yyyy");

    private final AvistamientoRepository avistamientoRepository;
    private final NotaRepository notaRepository;

    public ApiService(AvistamientoRepository avistamientoRepository, NotaRepository notaRepository) {
        this.avistamientoRepository = avistamientoRepository;
        this.notaRepository = notaRepository;
    }

    public List<Map<String, String>> buscarAvistamientos(String texto) {
        List<Map<String, String>> resultados = new ArrayList<>();
        if (texto == null) {
            return resultados;
        }
        String buscado = texto.trim().toLowerCase();
        if (buscado.isEmpty() || buscado.length() > LARGO_MAXIMO_BUSQUEDA) {
            return resultados;
        }

        List<Avistamiento> avistamientos = avistamientoRepository.findAllByOrderByFechaHoraDesc();
        for (Avistamiento av : avistamientos) {
            String nombreAve = av.getAve().getNombre();
            String nombreVoluntario = av.getVoluntario().getNombre();
            String nombreComuna = av.getVoluntario().getComuna().getNombre();

            if (nombreAve.toLowerCase().contains(buscado)
                    || nombreVoluntario.toLowerCase().contains(buscado)
                    || nombreComuna.toLowerCase().contains(buscado)) {
                List<Nota> notas = notaRepository.findByAvistamientoId(av.getId());

                Map<String, String> datos = new HashMap<>();
                datos.put("id", av.getId().toString());
                datos.put("voluntario", nombreVoluntario);
                datos.put("fecha", av.getFechaHora().format(FORMATO_DIA));
                datos.put("ave", nombreAve);
                datos.put("comuna", nombreComuna);
                datos.put("nota", calcularPromedio(notas));
                datos.put("cantidad", String.valueOf(notas.size()));
                resultados.add(datos);
            }
        }
        return resultados;
    }

    public List<String> validarNuevaNota(Integer avistamientoId, Integer nota) {
        List<String> errores = new ArrayList<>();
        if (avistamientoId == null || !avistamientoRepository.existsById(avistamientoId)) {
            errores.add("El avistamiento no existe.");
        }
        if (!Nota.validarNota(nota)) {
            errores.add("La nota debe ser un numero entero entre "
                    + Nota.NOTA_MINIMA + " y " + Nota.NOTA_MAXIMA + ", ambos inclusive.");
        }
        return errores;
    }

    public Map<String, String> agregarNota(Integer avistamientoId, Integer nota) {
        notaRepository.save(new Nota(avistamientoId, nota));

        List<Nota> notas = notaRepository.findByAvistamientoId(avistamientoId);

        Map<String, String> datos = new HashMap<>();
        datos.put("nota", calcularPromedio(notas));
        datos.put("cantidad", String.valueOf(notas.size()));
        return datos;
    }

    public Integer convertirEntero(String texto) {
        if (texto == null) {
            return null;
        }
        String limpio = texto.trim();
        if (!limpio.matches("[0-9]{1,9}")) {
            return null;
        }
        return Integer.parseInt(limpio);
    }

    private String calcularPromedio(List<Nota> notas) {
        if (notas.isEmpty()) {
            return "-";
        }
        int suma = 0;
        for (Nota n : notas) {
            suma += n.getNota();
        }
        double promedio = (double) suma / notas.size();
        return String.format(Locale.US, "%.1f", promedio);
    }
}
