package com.hardware.entities;

import jakarta.persistence.*;
import lombok.*;
import com.hardware.enums.*;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users") // "user" est un mot réservé en SQL
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Role role = Role.OWNER; // par défaut OWNER

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<HardwareStore> hardwareStores;

    // Relation gérant → une seule quincaillerie
    @JsonIgnore
    @OneToOne(mappedBy = "gerant")
    private HardwareStore managedStore;
}
