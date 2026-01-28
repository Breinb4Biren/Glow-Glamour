package com.example.beautisite;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User.UserBuilder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 1. Try to find the user in the database
        User user = userRepository.findByUsername(username);

        // 2. If not found, throw an error
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        // 3. If found, convert it to a Spring Security "UserDetails" object
        UserBuilder builder = org.springframework.security.core.userdetails.User.withUsername(username);
        builder.password(user.getPassword()); // This is the encrypted password from DB
        builder.roles(user.getRole());
        
        return builder.build();
    }
}