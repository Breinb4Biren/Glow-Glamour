package com.example.beautisite;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String username;
    
    // ✅ NEW FIELD: We actully store the email here now!
    private String email; 
    
    @JsonIgnore
    private String password;
    private String role; 

    // Constructors
    public User() {}

    // Updated Constructor to include email
    public User(String fullName, String username, String email, String password, String role) {
        this.fullName = fullName;
        this.username = username;
        this.email = email; // Save the email
        this.password = password;
        this.role = role;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    // ✅ NEW GETTER AND SETTER FOR EMAIL
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}