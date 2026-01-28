package com.example.beautisite;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List; // <--- Don't forget this import!

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    // This custom method tells the DB: "Only give me rows where the 'name' column matches"
    List<Booking> findByName(String name);
}