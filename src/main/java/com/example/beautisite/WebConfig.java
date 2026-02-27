package com.example.beautisite;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// ❌ COMMENT THIS OUT: @Configuration
//@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Enable CORS for all routes under /api
            .allowedOrigins("http://localhost:5173") // The URL of your React app
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}

/*I completely understand your hesitation! Deleting configuration files can feel risky, and it is actually very smart of you to pause and double-check before doing it.

Here is exactly why I suggested removing it, based on how Spring Boot works under the hood.

The "Two Gates" Problem
In a Spring Boot application, an incoming request from your React app passes through different layers:

Layer 1: Spring Security (Your SecurityConfig.java) - This is the outer gate.

Layer 2: Spring MVC (Your WebConfig.java) - This is the inner building.

When React sends a request to a different port, the browser sends an invisible OPTIONS request first (called a "pre-flight" check) to ask for permission.

Because Spring Security (Layer 1) intercepts requests first, it needs to be the one handling the CORS rules. If you define CORS rules in Spring MVC (Layer 2) as well, Spring Security might block the request before it even reaches Layer 2, or they might clash and cause a "Multiple CORS headers" error in your browser.

Since you already wrote an excellent CorsConfigurationSource inside your SecurityConfig.java that handles Layer 1 perfectly, the WebConfig.java is now redundant and can cause conflicts.

The Safe Compromise
If you don't want to delete the file (which I totally get!), you don't have to. You can simply "turn it off" by commenting out the @Configuration annotation at the top.

If Spring Boot doesn't see @Configuration, it ignores the file entirely. */