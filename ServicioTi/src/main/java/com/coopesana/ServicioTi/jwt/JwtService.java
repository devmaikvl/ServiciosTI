package com.coopesana.ServicioTi.jwt;

import com.coopesana.ServicioTi.model.Usuarios;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    private static final String SECRET_KEY="586E3272357538782F413F4428472B4B6250655368566B597033733676397924";

    public String getToken(UserDetails user) {
        return getToken(new HashMap<>(), user);
    }

    private String getToken(Map<String, Object> extraClaims, UserDetails user) {
        // Obtenemos el rol del usuario
        String role = user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_USER");  // Si no hay rol, asignamos un valor por defecto (ROLE_USER)

        // Si tienes una clase 'Usuario', realiza el cast para acceder al id
        if (user instanceof Usuarios) {
            Usuarios usuario = (Usuarios) user;  // Hace el cast a tu clase Usuario
            extraClaims.put("id", usuario.getId());  // Agrega el id al JWT
        }

        // Añadimos el rol al JWT
        extraClaims.put("role", role);  // Agregar el rol al JWT

        return Jwts
                .builder()
                .setClaims(extraClaims)  // Claims adicionales (como el rol y el id)
                .setSubject(user.getUsername())  // El nombre de usuario
                .setIssuedAt(new Date(System.currentTimeMillis()))  // Fecha de emisión
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))  // Expiración en 1 hora
                .signWith(getKey(), SignatureAlgorithm.HS256)  // Firmado con la clave secreta
                .compact();  // Retorna el JWT
    }



    private Key getKey() {
        byte[] keyBytes=Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String getUsernameFromToken(String token) {
        return getClaim(token, Claims::getSubject);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username=getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername())&& !isTokenExpired(token));
    }

    private Claims getAllClaims(String token)
    {
        return Jwts
                .parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public <T> T getClaim(String token, Function<Claims,T> claimsResolver)
    {
        final Claims claims=getAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Date getExpiration(String token)
    {
        return getClaim(token, Claims::getExpiration);
    }

    private boolean isTokenExpired(String token)
    {
        return getExpiration(token).before(new Date());
    }

}