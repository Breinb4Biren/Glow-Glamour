package com.example.beautisite.api;

import com.example.beautisite.Booking;
import com.example.beautisite.BookingRepository;
import com.example.beautisite.User;
import com.example.beautisite.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder; 
import org.springframework.web.bind.annotation.*;

import java.util.List; 

// Helper record
record BookingPayload(String name, String email, String phone, String serviceName, String date, String time, String message) {}

@RestController
@RequestMapping("/api")
public class BookingApiController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    // ✅ 1. CREATE BOOKING (POST)
    @PostMapping("/bookings")
    public ResponseEntity<?> createBooking(@RequestBody BookingPayload payload) {
        try {
            User currentUser = null;
            String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            
            if (currentUsername != null && !currentUsername.equals("anonymousUser")) {
                currentUser = userRepository.findByUsername(currentUsername);
            }

            Booking newBooking = new Booking(
                payload.name(),
                payload.email(),
                payload.serviceName(),
                payload.date(),
                payload.time(),
                currentUser
            );

            Booking savedBooking = bookingRepository.save(newBooking);
            return new ResponseEntity<>(savedBooking, HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>("Error creating booking: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ✅ 2. GET MY BOOKINGS (GET)
    @GetMapping("/bookings")
    public ResponseEntity<?> getUserBookings() {
        // Get the currently logged-in user's username
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        if (currentUsername == null || currentUsername.equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You must be logged in to view bookings.");
        }

        // Find the user object from the database
        User currentUser = userRepository.findByUsername(currentUsername);

        // Fetch bookings only for this specific user
        List<Booking> userBookings = bookingRepository.findByUser(currentUser);

        return ResponseEntity.ok(userBookings);
    }

    // ✅ 3. CANCEL BOOKING (DELETE) - NEW METHOD ADDED HERE
    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        try {
            // Check if it exists before trying to delete
            if (bookingRepository.existsById(id)) {
                bookingRepository.deleteById(id);
                return ResponseEntity.ok().body("Booking cancelled successfully!");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Booking not found.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete booking: " + e.getMessage());
        }
    }
}