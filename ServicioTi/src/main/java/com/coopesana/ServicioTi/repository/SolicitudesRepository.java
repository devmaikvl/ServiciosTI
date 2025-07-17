package com.coopesana.ServicioTi.repository;

import com.coopesana.ServicioTi.model.Solicitudes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SolicitudesRepository extends JpaRepository<Solicitudes, Long> {
    Optional<Solicitudes> findByTitulo(String titulo);

    List<Solicitudes> findByTituloContainingIgnoreCase(String titulo);

    List<Solicitudes> findBySolicitanteId(Long solicitanteId);
}



