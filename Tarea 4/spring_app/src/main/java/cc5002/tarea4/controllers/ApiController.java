package cc5002.tarea4.controllers;

import org.springframework.web.bind.annotation.RestController;

import cc5002.tarea4.services.ApiService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
public class ApiController {
    private final ApiService apiService;
    public ApiController(ApiService apiService) {
        this.apiService = apiService;
    }

    @GetMapping("/api/buscar")
    public Map<String, List<Map<String, String>>> buscarEndpoint(
        @RequestParam(value = "texto", required = false) String texto) {
        List<Map<String, String>> resultados = apiService.buscarAvistamientos(texto);
        return Map.of("data", resultados);
    }

    @PostMapping("/api/nota")
    public Map<String, Object> agregarNotaEndpoint(
        @RequestParam(value = "avistamiento_id", required = false) String avistamientoIdTexto,
        @RequestParam(value = "nota", required = false) String notaTexto) {

        Integer avistamientoId = apiService.convertirEntero(avistamientoIdTexto);
        Integer nota = apiService.convertirEntero(notaTexto);

        Map<String, Object> respuesta = new HashMap<>();

        List<String> errores = apiService.validarNuevaNota(avistamientoId, nota);
        if (!errores.isEmpty()) {
            respuesta.put("status", "error");
            respuesta.put("errors", errores);
            return respuesta;
        }

        Map<String, String> promedio = apiService.agregarNota(avistamientoId, nota);
        respuesta.put("status", "ok");
        respuesta.put("nota", promedio.get("nota"));
        respuesta.put("cantidad", promedio.get("cantidad"));
        return respuesta;
    }
}
