package com.example.beautisite.api;

import com.example.beautisite.User;
import com.example.beautisite.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// Helper records to define the structure of our JSON requests and responses
record RegisterPayload(String fullName, String username, String email, String password) {}
record LoginPayload(String username, String password) {}
record AuthResponse(String token, String username, String role) {}

@RestController
@RequestMapping("/api/auth")
public class AuthApiController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider; 

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginPayload loginPayload) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginPayload.username(), loginPayload.password())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByUsername(loginPayload.username());
        
        String token = tokenProvider.generateToken(authentication);

        return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getRole()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterPayload registerPayload) {
        if (userRepository.findByUsername(registerPayload.username()) != null) {
            return new ResponseEntity<>("Username is already taken!", HttpStatus.BAD_REQUEST);
        }

        User newUser = new User(
            registerPayload.fullName(), 
            registerPayload.username(), 
            registerPayload.email(),
            passwordEncoder.encode(registerPayload.password()), 
            "USER" 
        );

        userRepository.save(newUser);

        return new ResponseEntity<>("User registered successfully!", HttpStatus.CREATED);
    }

    @GetMapping("/verify") 
    public ResponseEntity<?> verifyToken(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username);
        
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }
        
        // Return the username and role to the React AuthContext using Map.of
        return ResponseEntity.ok(Map.of(
            "username", user.getUsername(),
            "role", user.getRole()
        ));
    }
}