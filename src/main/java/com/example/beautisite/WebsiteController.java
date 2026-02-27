package com.example.beautisite;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile; 

import java.io.IOException;     
import java.security.Principal;
import java.util.Base64; // ✅ IMPORT ADDED
import java.util.List;

@Controller
public class WebsiteController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BeautyServiceRepository serviceRepository;

    // ✅ 1. ADD THIS: Inject User Repository to find user details
    @Autowired
    private UserRepository userRepository;

    // ✅ NOTE: UPLOAD_DIRECTORY IS GONE! We don't need it anymore.

    // ==========================================
    // GLOBAL LOGIC
    // ==========================================
    @ModelAttribute
    public void addGlobalAttributes(Model model, Principal principal) {
        if (principal != null) {
            String username = principal.getName();
            model.addAttribute("isLoggedIn", true);
            model.addAttribute("loggedInUser", username);
            model.addAttribute("isAdmin", username.equals("admin"));
        } else {
            model.addAttribute("isLoggedIn", false);
            model.addAttribute("loggedInUser", "Guest");
            model.addAttribute("isAdmin", false);
        }
    }

    // ==========================================
    // PAGE MAPPINGS
    // ==========================================

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("businessName", "Mom's Glow & Glamour");
        return "index";
    }

    // ✅ PASTE THIS NEW BLOCK HERE
    @GetMapping("/contact")
        public String contact(Model model, Principal principal) {
            // Check if someone is logged in
            if (principal != null) {
                String username = principal.getName();
     
                User user = userRepository.findByUsername(username); // Find the user in DB          
                if (user != null) {
                    // Send their Name and Email to the HTML
                    model.addAttribute("userName", user.getFullName());
                    model.addAttribute("userEmail", user.getEmail());
                }
            }
            return "contact";
        }

    @GetMapping("/services")
    public String services(Model model) {
        List<BeautyService> serviceList = serviceRepository.findAll();
        model.addAttribute("services", serviceList);
        return "services";
    }

    // ==========================================
    // ADMIN: ADD & DELETE SERVICES
    // ==========================================

    @GetMapping("/add-service")
    public String showAddServicePage(Model model, Principal principal) {
        if (principal == null || !principal.getName().equals("admin")) {
            return "redirect:/"; 
        }
        return "add-service";
    }

    // ✅ UPDATED: Converts Image to Text (Base64)
    @PostMapping("/add-service")
    public String addServiceToDB(@RequestParam String name,
                                 @RequestParam String description,
                                 @RequestParam Double price,
                                 @RequestParam("image") MultipartFile imageFile) throws IOException {
        
        String imageString = null;
        if (!imageFile.isEmpty()) {
            imageString = Base64.getEncoder().encodeToString(imageFile.getBytes());
        }

        BeautyService newService = new BeautyService(name, description, price, imageString);
        serviceRepository.save(newService);

        return "redirect:/services";
    }

    // ==========================================
    // EDIT & UPDATE
    // ==========================================

    @GetMapping("/edit-service")
    public String showEditPage(@RequestParam Long id, Model model) {
        BeautyService service = serviceRepository.findById(id).orElse(null);
        model.addAttribute("service", service);
        return "edit-service";
    }

    // ✅ UPDATED: Handles Base64 Update
    @PostMapping("/update-service")
    public String updateService(@RequestParam Long id,
                                @RequestParam String name,
                                @RequestParam String description,
                                @RequestParam Double price,
                                @RequestParam("image") MultipartFile imageFile) throws IOException {
        
        BeautyService service = serviceRepository.findById(id).orElse(null);

        if (service != null) {
            service.setName(name);
            service.setDescription(description);
            service.setPrice(price);

            if (!imageFile.isEmpty()) {
                String imageString = Base64.getEncoder().encodeToString(imageFile.getBytes());
                service.setImageBase64(imageString);
            }

            serviceRepository.save(service);
        }

        return "redirect:/services";
    }

    @PostMapping("/delete-service")
    public String deleteService(@RequestParam Long id) {
        serviceRepository.deleteById(id);
        return "redirect:/services";
    }

    // ==========================================
    // BOOKING LOGIC
    // ==========================================

    @GetMapping("/bookings")
    public String listBookings(Model model, Principal principal) {
        
        // 1. If not logged in, send to login page
        if (principal == null) return "redirect:/login";

        String currentUsername = principal.getName();
        List<Booking> bookings;

        // 2. Logic for Admin vs Normal User
        if (currentUsername.equals("admin")) {
            // Admin sees ALL bookings
            bookings = bookingRepository.findAll();
        } else {
            // ✅ THIS IS THE FIX!
            // First, find the logged-in User object (e.g., User ID 6)
            User currentUser = userRepository.findByUsername(currentUsername);
            
            // Then, ask the repo: "Give me bookings linked to THIS User account"
            // (This ignores the name text and looks at the ID connection)
            bookings = bookingRepository.findByUser(currentUser);
        }

        model.addAttribute("bookings", bookings);
        return "bookings";
    }

    @PostMapping("/submit")
    public String submitAppointment(@RequestParam String name, 
                                    @RequestParam String email,
                                    @RequestParam String serviceName,
                                    @RequestParam String date,
                                    @RequestParam String time,
                                    Principal principal,
                                    Model model) {
        
                                        
        // 🛑 1. DOUBLE BOOKING CHECK
        if (bookingRepository.existsByDateAndTime(date, time)) {
            // If the slot is taken, create an error message
            model.addAttribute("errorMessage", "Sorry! " + time + " on " + date + " is already booked. Please choose another slot.");
            
            // Re-populate the user's name/email so the form doesn't go blank
            // 🌟 THE UPGRADE: 
            // Send exactly what they typed right back to the form!
            // This works perfectly for BOTH logged-in users AND guests.
            model.addAttribute("userName", name); 
            model.addAttribute("userEmail", email);
            model.addAttribute("serviceName", serviceName);
            model.addAttribute("date", date); // Sends the date back
            model.addAttribute("time", time); // Sends the time back
            // Fixes the blank service box!
            // Send them back to the booking form to try again
            return "contact"; 
        }                               
        User currentUser = null;
        if (principal != null) {
            currentUser = userRepository.findByUsername(principal.getName());
        }
        Booking newBooking = new Booking(name, email, serviceName, date, time, currentUser);
        bookingRepository.save(newBooking);
        
        model.addAttribute("clientName", name);
        model.addAttribute("serviceName", serviceName);
        model.addAttribute("bookingDate", date);
        model.addAttribute("bookingTime", time);
        model.addAttribute("clientEmail", email);
        
        return "success";
    }

    @PostMapping("/delete")
    public String deleteBooking(@RequestParam Long id, Principal principal) {
        if(principal == null) return "redirect:/login";
        Booking booking = bookingRepository.findById(id).orElse(null);
        String currentUsername = principal.getName(); 
       // Only allow deletion if user is Admin OR if the booking belongs to the logged-in user
        if (booking != null && (currentUsername.equals("admin") || 
            (booking.getUser() != null && booking.getUser().getUsername().equals(currentUsername)))) {
            bookingRepository.deleteById(id);
        }
        return "redirect:/bookings";
    }
}