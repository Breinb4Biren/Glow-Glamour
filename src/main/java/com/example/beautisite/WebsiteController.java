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

    @GetMapping("/contact")
    public String contact() {
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
        if (principal == null) return "redirect:/login";

        String currentUsername = principal.getName();
        List<Booking> bookings;

        if (currentUsername.equals("admin")) {
            bookings = bookingRepository.findAll();
        } else {
            bookings = bookingRepository.findByName(currentUsername);
        }

        model.addAttribute("bookings", bookings);
        return "bookings";
    }

    @PostMapping("/submit")
    public String submitAppointment(@RequestParam String name, 
                                    @RequestParam String email,
                                    @RequestParam String serviceName,
                                    @RequestParam String date,
                                    Model model) {
        
        Booking newBooking = new Booking(name, email, serviceName, date);
        bookingRepository.save(newBooking);
        
        model.addAttribute("clientName", name);
        model.addAttribute("serviceName", serviceName);
        model.addAttribute("bookingDate", date);
        model.addAttribute("clientEmail", email);
        
        return "success";
    }

    @PostMapping("/delete")
    public String deleteBooking(@RequestParam Long id) {
        bookingRepository.deleteById(id);
        return "redirect:/bookings";
    }
}