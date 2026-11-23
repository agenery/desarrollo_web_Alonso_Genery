package cc5002.tarea4.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

@Entity
@Table
public class Voluntario {

    @Id
    private Integer id;

    @NotNull
    private String nombre;

    @ManyToOne
    private Comuna comuna;

    public Voluntario() {
    }

    public Integer getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public Comuna getComuna() {
        return comuna;
    }
}
