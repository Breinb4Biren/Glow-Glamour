package com.example.beautisite;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(BeautyServiceRepository repository) {
        return args -> {
            // Check if the table is empty
            if (repository.count() == 0) {
                System.out.println("⚠️ Services table is empty! Loading default services...");

                // Save the 4 services to PostgreSQL automatically
                repository.save(new BeautyService("Bridal Makeup", "Complete bridal look with trial", 150.00, "makeup.jpg"));
                repository.save(new BeautyService("Facial Therapy", "Rejuvenating fruit facial", 45.00, "facial.jpg"));
                repository.save(new BeautyService("Hair Spa", "Deep conditioning treatment", 30.00, "hair.jpg"));
                repository.save(new BeautyService("Manicure", "Basic cleaning and polish", 20.00, "nails.jpg"));
                
                System.out.println("✅ Default services saved to Database!");
            } else {
                System.out.println("✅ Services already exist. Skipping loader.");
            }
        };
    }
}