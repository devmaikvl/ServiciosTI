package com.coopesana.ServicioTi.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Table(name = "solicitudes")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
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









}
