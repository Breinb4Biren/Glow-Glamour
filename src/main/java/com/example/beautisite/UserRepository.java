package com.example.beautisite;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    // This allows us to find a user by their username (for login later)
    User findByUsername(String username);
}