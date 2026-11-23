package cc5002.tarea4.models;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

@Entity
@Table
public class Avistamiento {

    @Id
    private Integer id;

    @ManyToOne
    private Voluntario voluntario;

    @ManyToOne
    private Ave ave;

    @NotNull
    private LocalDateTime fechaHora;

    @NotNull
    private String lugar;

    public Avistamiento() {
    }

    public Integer getId() {
        return id;
    }

    public Voluntario getVoluntario() {
        return voluntario;
    }

    public Ave getAve() {
        return ave;
    }

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public String getLugar() {
        return lugar;
    }
}
