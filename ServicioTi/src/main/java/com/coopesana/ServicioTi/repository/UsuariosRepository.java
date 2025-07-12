package com.coopesana.ServicioTi.repository;

import com.coopesana.ServicioTi.model.Usuarios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface UsuariosRepository extends JpaRepository<Usuarios, Long > {
    Optional<Usuarios> findByUsername(String username);

    List<Usuarios> findByNombreContainingIgnoreCase(String nombre);
}

