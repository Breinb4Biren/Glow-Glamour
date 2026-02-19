package com.example.beautisite;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class AdminController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    // ✅ NEW: Inject the EmailService =we just created
    @Autowired
    private EmailService emailService;

    // ==========================================
    // 1. SHOW THE DASHBOARD
    // ==========================================
    @GetMapping("/admin")
    public String adminDashboard(Model model, java.security.Principal principal) {
         // 1. SECURITY CHECK: Is anyone logged in?
        if (principal == null) {
            return "redirect:/login";
        }

        // 2. ROLE CHECK: Is the logged-in user actually the "admin"?
        String currentUsername = principal.getName();
        // ✅ ADD THIS LINE: Pass the username to the HTML so Thymeleaf knows it's the admin!
        model.addAttribute("loggedInUser", currentUsername);
        if (!currentUsername.equals("admin")) {
            // If they aren't admin, redirect them away!
            System.out.println("⛔ ACCESS DENIED: User " + currentUsername + " tried to open Admin Dashboard.");
            //return "admin";
            return "redirect:/";
        }

        // 3. If they ARE admin, proceed as normal
        List<Booking> allBookings = bookingRepository.findAll();
        List<User> allUsers = userRepository.findAll();
        model.addAttribute("bookings", allBookings);
        model.addAttribute("users", allUsers);
        return "admin"; 
    }

    // ==========================================
    // 2. UPDATE STATUS & SEND EMAIL
    // ==========================================
    @PostMapping("/admin/update-status")
    public String updateStatus(@RequestParam Long id, @RequestParam String status) {
        
        // Find the booking
        Booking booking = bookingRepository.findById(id).orElse(null);
        
        if (booking != null) {
            // A. Update the database
            booking.setStatus(status);
            bookingRepository.save(booking);

            // B. ✅ NEW: Send Email Notification
            // We check if the user gave us an email, then send the update
            if (booking.getEmail() != null && !booking.getEmail().isEmpty()) {
                try {
                    emailService.sendBookingStatusEmail(
                        booking.getEmail(), 
                        booking.getName(), 
                        status, 
                        booking.getDate()
                    );
                } catch (Exception e) {
                    System.out.println("Error sending email: " + e.getMessage());
                }
            }
        }
        
        return "redirect:/admin";
    }

    // ==========================================
    // 3. ✅ NEW: DELETE BOOKING (Trash Can)
    // ==========================================
    @PostMapping("/admin/delete")
    public String deleteBooking(@RequestParam Long id) {
        bookingRepository.deleteById(id);
        return "redirect:/admin";
    }

    // ==========================================
    // 4. DELETE USER  ✅ NEW
    // ==========================================
    @PostMapping("/admin/delete-user")
    public String deleteUser(@RequestParam Long id) {

        // 1. Find the user first
        User userToDelete = userRepository.findById(id).orElse(null);

        // 2. SAFETY CHECK: If User doesn't exist OR is 'admin', STOP!
        if (userToDelete == null) {
            return "redirect:/admin"; // User not found, just refresh
        }
        if (userToDelete.getUsername().equals("admin")) {
            System.out.println("❌ SECURITY ALERT: Attempt to delete Admin blocked!");
            return "redirect:/admin?error=cannot_delete_admin";
        }
        // 3. CLEANUP: Delete this user's bookings first so the database stays happy
        List<Booking> userBookings = bookingRepository.findByUser(userToDelete);
        bookingRepository.deleteAll(userBookings);

        userRepository.deleteById(id);
        return "redirect:/admin";
    }
}

