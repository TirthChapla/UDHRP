package com.doctorai.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    @Value("${app.name}")
    private String appName;
    
    @Value("${app.base-url}")
    private String baseUrl;
    
    @Value("${app.frontend-url}")
    private String frontendUrl;
    
    /**
     * Send verification email to user
     */
    public void sendVerificationEmail(String toEmail, String name, String verificationToken) {
        String subject = "Verify Your Email - " + appName;
        String verificationUrl = baseUrl + "/auth/verify-email?token=" + verificationToken;
        
        String body = buildEmailBody(
            name,
            "Welcome to " + appName + "!",
            "Thank you for registering. Please verify your email address by clicking the button below:",
            verificationUrl,
            "Verify Email"
        );
        
        sendHtmlEmail(toEmail, subject, body);
    }
    
    /**
     * Send password reset email
     */
    public void sendPasswordResetEmail(String toEmail, String name, String resetToken) {
        String subject = "Reset Your Password - " + appName;
        String resetUrl = frontendUrl + "/reset-password?token=" + resetToken;
        
        String body = buildEmailBody(
            name,
            "Password Reset Request",
            "You requested to reset your password. Click the button below to proceed:",
            resetUrl,
            "Reset Password"
        );
        
        sendHtmlEmail(toEmail, subject, body);
    }
    
    /**
     * Send password reset OTP email
     */
    public void sendPasswordResetOtp(String toEmail, String name, String otp) {
        String subject = "Password Reset OTP - " + appName;
        
        String body = buildOtpEmailBody(
            name,
            "Password Reset OTP",
            "You requested to reset your password. Use the OTP below to proceed:",
            otp
        );
        
        sendHtmlEmail(toEmail, subject, body);
    }
    
    /**
     * Build OTP email body
     */
    private String buildOtpEmailBody(String name, String title, String message, String otp) {
        return "<!DOCTYPE html>" +
            "<html>" +
            "<head>" +
            "    <meta charset='UTF-8'>" +
            "    <meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
            "</head>" +
            "<body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;'>" +
            "    <table width='100%' cellpadding='0' cellspacing='0' style='background-color: #f4f4f4; padding: 20px;'>" +
            "        <tr>" +
            "            <td align='center'>" +
            "                <table width='600' cellpadding='0' cellspacing='0' style='background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);'>" +
            "                    <!-- Header -->" +
            "                    <tr>" +
            "                        <td style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;'>" +
            "                            <h1 style='margin: 0; color: #ffffff; font-size: 28px;'>" + appName + "</h1>" +
            "                        </td>" +
            "                    </tr>" +
            "                    <!-- Content -->" +
            "                    <tr>" +
            "                        <td style='padding: 40px 30px; text-align: center;'>" +
            "                            <h2 style='margin: 0 0 20px; color: #333333; font-size: 24px;'>" + title + "</h2>" +
            "                            <p style='margin: 0 0 10px; color: #666666; font-size: 16px; line-height: 1.6;'>Hi " + name + ",</p>" +
            "                            <p style='margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.6;'>" + message + "</p>" +
            "                            <div style='background-color: #f8f9fa; border: 2px dashed #667eea; border-radius: 8px; padding: 30px; margin: 30px 0;'>" +
            "                                <p style='margin: 0 0 10px; color: #666666; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;'>Your OTP</p>" +
            "                                <p style='margin: 0; color: #667eea; font-size: 42px; font-weight: bold; letter-spacing: 8px; font-family: monospace;'>" + otp + "</p>" +
            "                            </div>" +
            "                            <p style='margin: 20px 0 0; color: #999999; font-size: 14px; line-height: 1.6;'>This OTP will expire in 10 minutes.</p>" +
            "                            <p style='margin: 10px 0 0; color: #999999; font-size: 14px; line-height: 1.6;'>If you didn't request this, please ignore this email.</p>" +
            "                        </td>" +
            "                    </tr>" +
            "                    <!-- Footer -->" +
            "                    <tr>" +
            "                        <td style='background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #eeeeee;'>" +
            "                            <p style='margin: 0; color: #999999; font-size: 14px;'>This is an automated email. Please do not reply.</p>" +
            "                            <p style='margin: 10px 0 0; color: #999999; font-size: 14px;'>&copy; 2026 " + appName + ". All rights reserved.</p>" +
            "                        </td>" +
            "                    </tr>" +
            "                </table>" +
            "            </td>" +
            "        </tr>" +
            "    </table>" +
            "</body>" +
            "</html>";
    }
    
    /**
     * Build HTML email body
     */
    private String buildEmailBody(String name, String title, String message, String actionUrl, String buttonText) {
        return "<!DOCTYPE html>" +
            "<html>" +
            "<head>" +
            "    <meta charset='UTF-8'>" +
            "    <meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
            "</head>" +
            "<body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;'>" +
            "    <table width='100%' cellpadding='0' cellspacing='0' style='background-color: #f4f4f4; padding: 20px;'>" +
            "        <tr>" +
            "            <td align='center'>" +
            "                <table width='600' cellpadding='0' cellspacing='0' style='background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);'>" +
            "                    <!-- Header -->" +
            "                    <tr>" +
            "                        <td style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;'>" +
            "                            <h1 style='margin: 0; color: #ffffff; font-size: 28px;'>" + appName + "</h1>" +
            "                        </td>" +
            "                    </tr>" +
            "                    <!-- Content -->" +
            "                    <tr>" +
            "                        <td style='padding: 40px 30px;'>" +
            "                            <h2 style='margin: 0 0 20px; color: #333333; font-size: 24px;'>" + title + "</h2>" +
            "                            <p style='margin: 0 0 10px; color: #666666; font-size: 16px; line-height: 1.6;'>Hi " + name + ",</p>" +
            "                            <p style='margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.6;'>" + message + "</p>" +
            "                            <table width='100%' cellpadding='0' cellspacing='0'>" +
            "                                <tr>" +
            "                                    <td align='center'>" +
            "                                        <a href='" + actionUrl + "' style='display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;'>" + buttonText + "</a>" +
            "                                    </td>" +
            "                                </tr>" +
            "                            </table>" +
            "                            <p style='margin: 30px 0 0; color: #999999; font-size: 14px; line-height: 1.6;'>If the button doesn't work, copy and paste this link into your browser:</p>" +
            "                            <p style='margin: 10px 0 0; color: #667eea; font-size: 14px; word-break: break-all;'>" + actionUrl + "</p>" +
            "                        </td>" +
            "                    </tr>" +
            "                    <!-- Footer -->" +
            "                    <tr>" +
            "                        <td style='background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #eeeeee;'>" +
            "                            <p style='margin: 0; color: #999999; font-size: 14px;'>This is an automated email. Please do not reply.</p>" +
            "                            <p style='margin: 10px 0 0; color: #999999; font-size: 14px;'>&copy; 2026 " + appName + ". All rights reserved.</p>" +
            "                        </td>" +
            "                    </tr>" +
            "                </table>" +
            "            </td>" +
            "        </tr>" +
            "    </table>" +
            "</body>" +
            "</html>";
    }
    
    /**
     * Send HTML email
     */
    private void sendHtmlEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}
