package com.coopesana.ServicioTi.service;

import com.coopesana.ServicioTi.model.Usuarios;
import com.coopesana.ServicioTi.repository.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuariosService {
    @Autowired
    UsuariosRepository usuarioRepo;
    private final PasswordEncoder passwordEncoder;

    public UsuariosService(PasswordEncoder passwordEncoder) {this.passwordEncoder = passwordEncoder;}

    public Usuarios crearUsuarios(Usuarios usuarios) {
        usuarios.setPassword(passwordEncoder.encode(usuarios.getPassword()));
        return usuarioRepo.save(usuarios);
    }

    public void borrarUsuarios (Long Id) {usuarioRepo.deleteById(Id);}

    public List<Usuarios> listarUsuarios(){return usuarioRepo.findAll();}

    public Usuarios buscarUsuariosPorId(Long Id) {
        if (Id == null) {
            return null; // o lanzar una excepción controlada si prefieres
        }
        return usuarioRepo.findById(Id).orElse(null);
    }

    public List<Usuarios> buscarUsuariosPorNombre(String nombre) {
        return usuarioRepo.findByNombreContainingIgnoreCase(nombre);}

    public Usuarios modificarUsuarios(Usuarios usuarios) {
        Usuarios usuarioExistente = usuarioRepo.findById(usuarios.getId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuarioExistente.setNombre(usuarios.getNombre());
        usuarioExistente.setUsername(usuarios.getUsername());
        usuarioExistente.setEmail(usuarios.getEmail());


        if (usuarios.getPassword() != null && !usuarios.getPassword().isBlank()) {
            usuarioExistente.setPassword(passwordEncoder.encode(usuarios.getPassword()));
        }

        usuarioExistente.setRol(usuarios.getRol());
        usuarioExistente.setDepartamento(usuarios.getDepartamento());

        return usuarioRepo.save(usuarioExistente);
    }


    public Usuarios login (String email, String password) {return new Usuarios();}
}

