package com.coopesana.ServicioTi.controller;

import com.coopesana.ServicioTi.model.*;
import com.coopesana.ServicioTi.repository.SolicitudesRepository;
import com.coopesana.ServicioTi.service.SolicitudesService;
import com.coopesana.ServicioTi.service.UsuariosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@RestController
public class SolicitudesController {

    @Autowired
    private UsuariosService usuariosService;

    @Autowired
    SolicitudesService solicitudesService;

    @Autowired
    SolicitudesRepository solicitudesRepository;

    @GetMapping("/solicitudes")
    @ResponseBody
    public List<Solicitudes> listarSolicitudes(){return solicitudesService.listarSolicitudes();}

    @GetMapping("/solicitudes/{id}")
    @ResponseBody
    public Solicitudes buscarSolicitudesPorId(@PathVariable Long id) {
        return solicitudesService.buscarSolicitudesPorId(id);
    }

    @GetMapping("/solicitudes/usuario/{solicitanteId}")
    @ResponseBody
    public List<Solicitudes> listarSolicitudesPorUsuario(@PathVariable Long solicitanteId) {
        return solicitudesService.listarSolicitudesPorUsuario(solicitanteId);
    }

    @PostMapping("/solicitudes")
    public ResponseEntity<Solicitudes> crearSolicitudes(@RequestBody SolicitudesDTO dto) {
        System.out.println("Solicitud recibida: " + dto.titulo);

        Usuarios solicitante = usuariosService.buscarUsuariosPorId(dto.solicitanteId);
        if (solicitante == null) {
            System.out.println("Usuario no encontrado con ID: " + dto.solicitanteId);
            return ResponseEntity.badRequest().build();
        }

        Solicitudes solicitud = new Solicitudes();
        solicitud.setTitulo(dto.titulo);
        solicitud.setDescripcion(dto.descripcion);
        solicitud.setEstado(Estado.valueOf(dto.estado));
        solicitud.setPrioridad(Prioridad.valueOf(dto.prioridad));
        solicitud.setSolicitante(solicitante);
        solicitud.setCreadoEn(LocalDateTime.now());


        Solicitudes creada = solicitudesService.crearSolicitudes(solicitud);
        System.out.println("Solicitud creada con ID: " + creada.getId());

        return ResponseEntity.ok(creada);
    }






    @DeleteMapping("/solicitudes/{id}")
    public void borrarSolicitudes(@PathVariable Long id){
        solicitudesService.borrarSolicitudes(id);
    }


    @PutMapping("/solicitudes/{id}")
    public ResponseEntity<Solicitudes> modificarSolicitudes(@PathVariable Long id, @RequestBody Solicitudes solicitudes) {
        solicitudes.setId(id);
        Solicitudes solicitudesModificado = solicitudesService.modificarSolicitudes(solicitudes);
        return ResponseEntity.ok(solicitudesModificado);}

    @PutMapping("solicitudes/{id}/cerrar")
    public ResponseEntity<?> cerrarSolicitud(@PathVariable Long id) {
        Optional<Solicitudes> optionalSolicitud = solicitudesRepository.findById(id);
        if (optionalSolicitud.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Solicitudes solicitudes = optionalSolicitud.get();
        solicitudes.setEstado(Estado.SOLUCIONADO);
        solicitudes.setFinalizadoEn(LocalDateTime.now());



        solicitudesRepository.save(solicitudes);

        return ResponseEntity.ok().build();
    }


}
