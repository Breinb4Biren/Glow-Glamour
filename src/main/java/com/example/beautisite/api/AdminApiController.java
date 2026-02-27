package com.example.beautisite.api;

import com.example.beautisite.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // ✅ Needed for images

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminApiController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired 
    private BeautyServiceRepository serviceRepository; // ✅ ADDED THIS

    @Autowired
    private EmailService emailService;

    // ================= BOOKINGS =================

    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingRepository.findAll());
    }

    @PutMapping("/bookings/{id}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Booking booking = bookingRepository.findById(id).orElse(null);
        if (booking == null) return new ResponseEntity<>("Booking not found", HttpStatus.NOT_FOUND);

        String status = payload.get("status");
        booking.setStatus(status);
        bookingRepository.save(booking);

        // Send email notification
        if (booking.getEmail() != null && !booking.getEmail().isEmpty()) {
            try {
                emailService.sendBookingStatusEmail(booking.getEmail(), booking.getName(), status, booking.getDate());
            } catch (Exception e) {
                System.out.println("API Error sending email: " + e.getMessage());
            }
        }
        return ResponseEntity.ok(booking);
    }
    
    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable Long id) {
        if (!bookingRepository.existsById(id)) return new ResponseEntity<>("Booking not found", HttpStatus.NOT_FOUND);
        bookingRepository.deleteById(id);
        return ResponseEntity.ok("Booking deleted successfully.");
    }

    // ================= USERS =================

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        User userToDelete = userRepository.findById(id).orElse(null);
        if (userToDelete == null) return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        
        if ("admin".equals(userToDelete.getUsername())) {
            return new ResponseEntity<>("Cannot delete admin user.", HttpStatus.FORBIDDEN);
        }

        List<Booking> userBookings = bookingRepository.findByUser(userToDelete);
        bookingRepository.deleteAll(userBookings);
        userRepository.deleteById(id);

        return ResponseEntity.ok("User and bookings deleted.");
    }

    // ================= SERVICES (✅ NEW ADDITIONS) =================

    @PostMapping("/services")
    public ResponseEntity<?> addService(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") double price,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        try {
            BeautyService service = new BeautyService();
            service.setName(name);
            service.setDescription(description);
            service.setPrice(price);

            if (imageFile != null && !imageFile.isEmpty()) {
                // Convert image to Base64 for database storage
                String base64Image = Base64.getEncoder().encodeToString(imageFile.getBytes());
                service.setImageBase64(base64Image);
            }

            serviceRepository.save(service);
            return ResponseEntity.ok("Service added successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading image");
        }
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Long id) {
        if (!serviceRepository.existsById(id)) {
            return new ResponseEntity<>("Service not found", HttpStatus.NOT_FOUND);
        }
        serviceRepository.deleteById(id);
        return ResponseEntity.ok("Service deleted");
    }
}