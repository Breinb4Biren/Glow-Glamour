package com.example.beautisite;

public class ServiceItem {
    private String name;
    private String description;
    private double price;
    private String imageName; // <--- NEW FIELD

    // Constructor
    public ServiceItem(String name, String description, double price, String imageName) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageName = imageName;
    }

    // Getters (Essential for HTML to read the data)
    public String getName() { return name; }
    public String getDescription() { return description; }
    public double getPrice() { return price; }
    public String getImageName() { return imageName; } // <--- NEW GETTER
}