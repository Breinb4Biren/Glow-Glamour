package com.example.beautisite;

import jakarta.persistence.*;

@Entity
public class BeautyService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private Double price;

    // ✅ FIXED FOR POSTGRESQL: Changed "MEDIUMBLOB"(MySQL) to "TEXT"(PostgreSQL)
    @Lob
    @Column(columnDefinition = "TEXT") 
    private String imageBase64;

    public BeautyService() {
    }

    public BeautyService(String name, String description, Double price, String imageBase64) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageBase64 = imageBase64;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getImageBase64() { return imageBase64; }
    public void setImageBase64(String imageBase64) { this.imageBase64 = imageBase64; }
}