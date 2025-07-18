package com.coopesana.ServicioTi.controller;

import com.coopesana.ServicioTi.model.Usuarios;
import com.coopesana.ServicioTi.service.UsuariosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RequestMapping
@RestController
public class UsuariosController {
    @Autowired
    UsuariosService usuariosService;

    @GetMapping("/usuarios")
    @ResponseBody
    public List<Usuarios> listarUsuarios(){return usuariosService.listarUsuarios();}

    @GetMapping("/usuarios/buscar")
    @ResponseBody
    public List<Usuarios> buscarUsuariosPorNombre(@RequestParam String nombre) {
        return usuariosService.buscarUsuariosPorNombre(nombre);
    }

    @PostMapping("/usuarios")
    public Usuarios crearUsuario(@RequestBody Usuarios usuarios){
        return usuariosService.crearUsuarios(usuarios);
    }


    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        usuariosService.borrarUsuarios(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/usuarios/{id}")
    @ResponseBody
    public Usuarios buscarUsuarioPorId(@PathVariable Long id){
        return usuariosService.buscarUsuariosPorId(id);
    }


    @PutMapping("/usuarios/{id}")
    public ResponseEntity<Usuarios> modificarUsuario(@PathVariable Long id, @RequestBody Usuarios usuario) {
        usuario.setId(id);
        Usuarios actualizado = usuariosService.modificarUsuarios(usuario);
        return ResponseEntity.ok(actualizado);
    }


}
