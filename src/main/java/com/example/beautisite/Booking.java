package com.example.beautisite;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import com.fasterxml.jackson.annotation.JsonIgnore; // 👈 1. IMPORT THIS

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String email;
    
    // To store "Hydra Facial", "Hair Cut", etc.
    private String serviceName; 
    
    private String date;

    private String time;

    // Stores "PENDING", "CONFIRMED", or "CANCELLED"
    private String status = "PENDING";

    // ✅ THE FIX IS HERE:
    @ManyToOne 
    @JoinColumn(name = "user_id") 
    @JsonIgnore // 👈 2. ADD THIS LINE (Stops the infinite loop)
    private User user;

    // --- CONSTRUCTORS ---
    public Booking() {
    }

    public Booking(String name, String email, String serviceName, String date, String time, User user) {
        this.name = name;
        this.email = email;
        this.serviceName = serviceName;
        this.date = date;
        this.time = time;
        this.user = user;
    }

    // --- GETTERS AND SETTERS ---
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public User getUser() { return user; }
    public void setUser(User user){ this.user = user; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
}