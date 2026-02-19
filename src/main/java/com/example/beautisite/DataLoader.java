package com.example.beautisite;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(BeautyServiceRepository serviceRepository, 
                                   UserRepository userRepository, 
                                   PasswordEncoder passwordEncoder) {
        return args -> {
            
            // ==========================================
            // TASK 1: Load Default Services
            // ==========================================
            if (serviceRepository.count() == 0) {
                System.out.println("⚠️ Services table is empty! Loading default services...");

                serviceRepository.save(new BeautyService("Bridal Makeup", "Complete bridal look with trial", 150.00, "makeup.jpg"));
                serviceRepository.save(new BeautyService("Facial Therapy", "Rejuvenating fruit facial", 45.00, "facial.jpg"));
                serviceRepository.save(new BeautyService("Hair Spa", "Deep conditioning treatment", 30.00, "hair.jpg"));
                serviceRepository.save(new BeautyService("Manicure", "Basic cleaning and polish", 20.00, "nails.jpg"));
                
                System.out.println("✅ Default services saved to Database!");
            } else {
                System.out.println("✅ Services already exist.");
            }

            // ==========================================
            // TASK 2: Create Admin User (If missing)
            // ==========================================
            if (userRepository.findByUsername("admin") == null) {
                System.out.println("⚠️ Admin not found! Creating default admin...");

                // Create the Admin User
                User admin = new User(
                    "System Admin",        // Full Name
                    "admin",               // Username (Login ID)
                    "prajapatibiren8@gmail.com",   // Email
                    passwordEncoder.encode("admin123"), // Password
                    "ADMIN"                // Role
                );
                
                userRepository.save(admin);
                System.out.println("✅ ADMIN ACCOUNT CREATED! (User: admin)");
            } else {
                System.out.println("✅ Admin already exists.");
            }
        };
    }
}