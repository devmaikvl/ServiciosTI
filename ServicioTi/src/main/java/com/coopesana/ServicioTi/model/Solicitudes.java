package com.coopesana.ServicioTi.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Table(name = "solicitudes")
@Entity
public class Solicitudes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false)
    private String descripcion;

    @Enumerated(EnumType.STRING)
    Estado estado;

    @Enumerated(EnumType.STRING)
    Prioridad prioridad;

    @CreationTimestamp
    @Column(name = "creada_en", updatable = false, nullable = false)
    private LocalDateTime creadoEn;

    @Column(name = "finalizada_en")
    private LocalDateTime finalizadoEn;

    @ManyToOne(optional = false)
    @JoinColumn(name = "solicitante_id", referencedColumnName = "id")
    private Usuarios solicitante;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Estado getEstado() {
        return estado;
    }

    public void setEstado(Estado estado) {
        this.estado = estado;
    }

    public Prioridad getPrioridad() {
        return prioridad;
    }

    public void setPrioridad(Prioridad prioridad) {
        this.prioridad = prioridad;
    }

    public LocalDateTime getCreadoEn() {
        return creadoEn;
    }

    public void setCreadoEn(LocalDateTime creadoEn) {
        this.creadoEn = creadoEn;
    }

    public LocalDateTime getFinalizadoEn() {
        return finalizadoEn;
    }

    public void setFinalizadoEn(LocalDateTime finalizadoEn) {
        this.finalizadoEn = finalizadoEn;
    }

    public Usuarios getSolicitante() {
        return solicitante;
    }

    public void setSolicitante(Usuarios solicitante) {
        this.solicitante = solicitante;
    }

    public Solicitudes() {
    }


    public Solicitudes(Long id, String titulo, String descripcion, Estado estado, Prioridad prioridad,
                       LocalDateTime creadoEn, LocalDateTime finalizadoEn, Usuarios solicitante) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.estado = estado;
        this.prioridad = prioridad;
        this.creadoEn = creadoEn;
        this.finalizadoEn = finalizadoEn;
       // this.solicitante = solicitante;
    }

}
