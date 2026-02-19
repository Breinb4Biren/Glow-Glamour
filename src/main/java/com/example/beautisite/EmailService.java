package com.example.beautisite;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendBookingStatusEmail(String toEmail, String clientName, String status, String date) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("prajapatibiren8@gmail.com"); // Make sure this matches application.properties
        message.setTo(toEmail);
        message.setSubject("Update on your Booking - Glow & Glamour");

        String body = "";
        
        if (status.equals("CONFIRMED")) {
            body = "Hello " + clientName + ",\n\n" +
                   "Great news! Your appointment on " + date + " has been CONFIRMED. ✅\n" +
                   "We look forward to seeing you!\n\n" +
                   "Regards,\nGlow & Glamour Team";
        } 
        else if (status.equals("CANCELLED")) {
            body = "Hello " + clientName + ",\n\n" +
                   "We regret to inform you that your appointment on " + date + " could not be confirmed. ❌\n" +
                   "Please contact us to reschedule.\n\n" +
                   "Regards,\nGlow & Glamour Team";
        }
        else if (status.equals("NEGOTIATING")) {
             body = "Hello " + clientName + ",\n\n" +
                   "Regarding your appointment on " + date + ": We need to discuss a slight change. 📞\n" +
                   "Please reply to this email or call us to finalize the details.\n\n" +
                   "Regards,\nGlow & Glamour Team";
        }

        message.setText(body);
        mailSender.send(message);
        System.out.println("Email sent successfully to " + toEmail);
    }
}