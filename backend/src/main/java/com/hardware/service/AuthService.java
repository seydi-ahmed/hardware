package com.hardware.service;

import com.hardware.dto.AuthResponse;
import com.hardware.dto.LoginRequest;
import com.hardware.dto.RegisterRequest;
import com.hardware.entities.User;
import com.hardware.repositories.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService,
            AuthenticationManager authenticationManager, UserDetailsServiceImpl userDetailsService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
    }

    public AuthResponse register(RegisterRequest request) {
        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        userRepository.save(user);
        // Charge UserDetails pour générer le token
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtService.generateToken(userDetails);
        return AuthResponse.builder()
                .token(token)
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()));
        // Charge UserDetails pour générer le token
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        String token = jwtService.generateToken(userDetails);
        return AuthResponse.builder()
                .token(token)
                .build();
    }
}