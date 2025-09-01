package com.hardware.service;

import com.hardware.dto.AuthResponse;
import com.hardware.dto.LoginRequest;
import com.hardware.dto.RegisterRequest;
import com.hardware.dto.CreateGerantRequest;
import com.hardware.entities.User;
import com.hardware.entities.HardwareStore;
import com.hardware.enums.Role;
import com.hardware.repositories.UserRepository;
import com.hardware.repositories.HardwareStoreRepository;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final HardwareStoreRepository hardwareStoreRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;

    public AuthService(UserRepository userRepository,
                       HardwareStoreRepository hardwareStoreRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager,
                       UserDetailsServiceImpl userDetailsService) {
        this.userRepository = userRepository;
        this.hardwareStoreRepository = hardwareStoreRepository;
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
                .role(Role.OWNER) // 🔹 par défaut OWNER
                .build();
        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtService.generateToken(userDetails);
        return AuthResponse.builder().token(token).build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()));

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        String token = jwtService.generateToken(userDetails);
        return AuthResponse.builder().token(token).build();
    }

    public AuthResponse createGerant(CreateGerantRequest request) {
        User currentUser = getCurrentUser();

        HardwareStore store = hardwareStoreRepository.findById(request.getStoreId())
                .orElseThrow(() -> new RuntimeException("Quincaillerie non trouvée"));

        if (!store.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Vous n'êtes pas le propriétaire de cette quincaillerie");
        }

        User gerant = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.GERANT)
                .managedStore(store)
                .build();
        userRepository.save(gerant);

        store.setGerant(gerant);
        hardwareStoreRepository.save(store);

        UserDetails userDetails = userDetailsService.loadUserByUsername(gerant.getUsername());
        String token = jwtService.generateToken(userDetails);

        return AuthResponse.builder().token(token).build();
    }

    // 🔹 Méthode utilitaire pour récupérer l’utilisateur connecté
    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }
}
