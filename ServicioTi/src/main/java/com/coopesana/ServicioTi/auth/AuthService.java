package com.coopesana.ServicioTi.auth;

import com.coopesana.ServicioTi.jwt.JwtService;
import com.coopesana.ServicioTi.model.Departamento;
import com.coopesana.ServicioTi.model.Rol;
import com.coopesana.ServicioTi.model.Usuarios;
import com.coopesana.ServicioTi.repository.UsuariosRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuariosRepository usuariosRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    // Constructor manual (ya que no se usa @RequiredArgsConstructor)
    public AuthService(UsuariosRepository usuariosRepository,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager,
                       PasswordEncoder passwordEncoder) {
        this.usuariosRepository = usuariosRepository;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        UserDetails user = usuariosRepository.findByUsername(request.getUsername())
                .orElseThrow();

        String token = jwtService.getToken(user);

        return new AuthResponse(token);
    }

    public AuthResponse register(RegisterRequest request) {
        Usuarios usuarios = new Usuarios();
        usuarios.setUsername(request.getUsername());
        usuarios.setNombre(request.getNombre());
        usuarios.setPassword(passwordEncoder.encode(request.getPassword()));
        usuarios.setEmail(request.getEmail());
        usuarios.setRol(Rol.USUARIO);
        usuarios.setDepartamento(Departamento.ADMINISTRACION);

        usuariosRepository.save(usuarios);

        String token = jwtService.getToken(usuarios);
        return new AuthResponse(token);
    }
}
