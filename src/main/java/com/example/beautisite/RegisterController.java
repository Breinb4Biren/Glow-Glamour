package com.example.beautisite;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class RegisterController {

    // This is the tool that talks to the Database
    @Autowired
    private UserRepository userRepository;

    // This is the tool that scrambles passwords
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/register")
    public String showRegisterPage() {
        return "register";
    }

    @PostMapping("/register")
    public String registerUser(@RequestParam String fullName, 
                               @RequestParam String username, 
                               @RequestParam String password) {
        
        // 1. Check if user already exists
        if (userRepository.findByUsername(username) != null) {
            return "redirect:/register?error"; 
        }

        // 2. Scramble the password so it is secure
        String hashedPassword = passwordEncoder.encode(password);

        // 3. Create the new User object
        User newUser = new User(fullName, username, hashedPassword, "USER");

        // 4. SAVE IT TO THE DATABASE (The most important part!)
        userRepository.save(newUser);

        // 5. Send them to login
        return "redirect:/login?success"; 
    }
}