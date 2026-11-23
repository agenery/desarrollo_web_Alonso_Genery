package cc5002.tarea4.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

@Entity
@Table
public class Nota {

    public static final int NOTA_MINIMA = 1;
    public static final int NOTA_MAXIMA = 7;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private Integer avistamientoId;

    @NotNull
    private Integer nota;

    public Nota() {
    }

    public Nota(Integer avistamientoId, Integer nota) {
        this.avistamientoId = avistamientoId;
        this.nota = nota;
    }

    public Integer getId() {
        return id;
    }

    public Integer getAvistamientoId() {
        return avistamientoId;
    }

    public Integer getNota() {
        return nota;
    }

    public static Boolean validarNota(Integer nota) {
        return nota != null && nota >= NOTA_MINIMA && nota <= NOTA_MAXIMA;
    }
}
