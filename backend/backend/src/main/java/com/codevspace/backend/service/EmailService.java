package com.codevspace.backend.service;

import com.codevspace.backend.dto.ContactRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String adminEmail;

    public void sendPasswordResetEmail(String toEmail,String resetLink){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Reset Password");
        message.setText("Hello, \n\n" +
                "You have requested to reset your password.Please click the link below to set a new password:\n\n"+
                resetLink + "\n\n" +
                "This link will expire within 15 minutes.\n\n"+
                "If you did not request this, please ignore this email.");

        mailSender.send(message);
    }

    public void sendContactFormEmail(ContactRequest contactRequest){
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(adminEmail);
        message.setReplyTo(contactRequest.getEmail());
        message.setSubject("New Contact Form Submission from: " + contactRequest.getName());
        message.setText(
                "You have received a new message from the CodevSpace Contact Form.\n\n" +
                        "Name: " + contactRequest.getName() + "\n" +
                        "Email: " + contactRequest.getEmail() + "\n\n" +
                        "Message:\n" + contactRequest.getMessage()
        );

        mailSender.send(message);
    }

    public void sendInviteRequest(String toEmail,String projectName,String inviterName){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("CodevSpace - You've been invited to collaborate!");
        message.setText("Hello,\n\n" +
                inviterName + " has invited you to collaborate on the project '" + projectName + "' in CodevSpace.\n\n" +
                "Please log in to your dashboard to Accept or Reject this invitation.\n\n" +
                "Happy Coding!\nThe CodevSpace Team");

        mailSender.send(message);
    }
}
