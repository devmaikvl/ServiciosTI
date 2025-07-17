package com.coopesana.ServicioTi.service;

import com.coopesana.ServicioTi.model.Solicitudes;
import com.coopesana.ServicioTi.model.Usuarios;
import com.coopesana.ServicioTi.repository.SolicitudesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SolicitudesService {
    @Autowired
    SolicitudesRepository solicitudesRepo;
    public Solicitudes crearSolicitudes(Solicitudes solicitudes) {
        return solicitudesRepo.save(solicitudes);
    }

    public void borrarSolicitudes(Long id) {
        solicitudesRepo.deleteById(id);
    }

    public List<Solicitudes> listarSolicitudes() {
        return solicitudesRepo.findAll();
    }

    public Solicitudes buscarSolicitudesPorId(Long id) {
        return solicitudesRepo.findById(id).orElse(null);
    }

    public Solicitudes modificarSolicitudes(Solicitudes solicitudes) {
        Solicitudes solicitudesExistente = solicitudesRepo.findById(solicitudes.getId())
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        solicitudesExistente.setTitulo(solicitudes.getTitulo());
        solicitudesExistente.setDescripcion(solicitudes.getDescripcion());
        solicitudesExistente.setEstado(solicitudes.getEstado());
        solicitudesExistente.setPrioridad(solicitudes.getPrioridad());

        if (solicitudes.getSolicitante() != null) {
            solicitudesExistente.setSolicitante(solicitudes.getSolicitante());
        }

        return solicitudesRepo.save(solicitudesExistente);
    }

    public List<Solicitudes> listarSolicitudesPorUsuario(Long solicitanteId) {
        return solicitudesRepo.findBySolicitanteId(solicitanteId);
    }





}


