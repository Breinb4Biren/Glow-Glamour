package com.example.beautisite;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BeautyServiceRepository extends JpaRepository<BeautyService, Long> {
    // This gives us .findAll(), .save(), .deleteById() for free!
}