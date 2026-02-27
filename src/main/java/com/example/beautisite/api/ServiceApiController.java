package com.example.beautisite.api;

import com.example.beautisite.BeautyService;
import com.example.beautisite.BeautyServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController // ✅ Use @RestController for APIs - it automatically converts to JSON
@RequestMapping("/api") // ✅ All routes in this class will start with /api
public class ServiceApiController {

    @Autowired
    private BeautyServiceRepository serviceRepository;

    @GetMapping("/services") // This matches the GET request from frontend/src/services/api.ts
    public ResponseEntity<List<BeautyService>> getAllServices() {
        // Find all services in the database
        List<BeautyService> services = serviceRepository.findAll();
        // Return the list with an "OK" (200) status. Spring Boot handles the JSON conversion.
        return ResponseEntity.ok(services);
    }
}