package com.coopesana.ServicioTi.controller;

import com.coopesana.ServicioTi.model.Usuarios;
import com.coopesana.ServicioTi.service.UsuariosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UsuariosController {
    @Autowired
    UsuariosService usuariosService;

    @GetMapping("/usuarios")
    @ResponseBody
    public List<Usuarios> listarUsuarios(){return usuariosService.listarUsuarios();}

    @GetMapping("/usuario/buscar")
    @ResponseBody
    public List<Usuarios> buscarUsuariosPorNombre(@RequestParam String nombre) {
        return usuariosService.buscarUsuariosPorNombre(nombre);
    }

    @PostMapping("/usuario")
    public Usuarios crearUsuario(@RequestBody Usuarios usuarios){
        return usuariosService.crearUsuarios(usuarios);
    }

    @DeleteMapping("/usuario/{id}")
    public void borrarUsuario(@PathVariable Long id){
        usuariosService.borrarUsuarios(id);
    }

    @GetMapping("/usuario/{id}")
    @ResponseBody
    public Usuarios buscarUsuarioPorId(@PathVariable Long id){
        return usuariosService.buscarUsuariosPorId(id);
    }

    @PutMapping("/usuario/{id}")
    public ResponseEntity<Usuarios> modificarUsuario2(@PathVariable Long id, @RequestBody Usuarios usuarios) {
        usuarios.setId(id); // Asegurar que el ID del usuario es el correcto
        Usuarios usuarioModificado = usuariosService.modificarUsuarios(usuarios);
        return ResponseEntity.ok(usuarioModificado);}


}
