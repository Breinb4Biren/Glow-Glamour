package com.example.beautisite;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        System.out.println(">>> SECURITY CONFIG IS LOADING! <<<");
        http
            // 1. Disable CSRF (Specific security token) for now to keep forms simple
            .csrf(csrf -> csrf.disable())
            
            // 2. Define who can go where
            .authorizeHttpRequests((requests) -> requests
                // EVERYONE can visit these pages:
                .requestMatchers("/", "/contact", "/submit", "/services","/register", "/css/**", "/images/**").permitAll()
                // ONLY Logged in users can visit anything else (like /bookings, /delete):
                .anyRequest().authenticated()
            )
            // 3. Enable the Standard Login Form
            .formLogin(form -> form
                .loginPage("/login") // Tells Spring: "Don't use yours, use mine"
                .loginProcessingUrl("/login") // The URL your form POSTs to
                .defaultSuccessUrl("/bookings", true) // Where to go after login
                .permitAll()
            )
            // 4. Enable Logout
            .logout((logout) -> logout.permitAll());

        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}