package com.example.beautisite;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String email;
    
    // ✅ NEW FIELD: To store "Hydra Facial", "Hair Cut", etc.
    private String serviceName; 
    
    private String date;

    // --- CONSTRUCTORS ---
    public Booking() {
    }

    // Updated constructor to include serviceName
    public Booking(String name, String email, String serviceName, String date) {
        this.name = name;
        this.email = email;
        this.serviceName = serviceName; // ✅ Save it here
        this.date = date;
    }

    // --- GETTERS AND SETTERS ---
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // ✅ NEW Getter and Setter for Service Name
    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}