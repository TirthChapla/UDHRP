package com.doctorai.service;

import com.doctorai.dto.*;
import com.doctorai.exception.BadRequestException;
import com.doctorai.exception.ResourceNotFoundException;
import com.doctorai.model.User;
import com.doctorai.repository.UserRepository;
import com.doctorai.security.CustomUserDetailsService;
import com.doctorai.security.JwtTokenProvider;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @Autowired
    private ModelMapper modelMapper;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Transactional
    public UserDTO register(RegisterRequest registerRequest) {
        // Check if email already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email already exists");
        }
        
        // Create new user
        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setPhoneNumber(registerRequest.getPhoneNumber());
        
        try {
            user.setRole(User.UserRole.valueOf(registerRequest.getRole().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role: " + registerRequest.getRole());
        }
        
        user.setIsActive(true);
        user.setEmailVerified(false);
        
        User savedUser = userRepository.save(user);
        
        // Generate verification token
        String verificationToken = UUID.randomUUID().toString();
        savedUser.setVerificationToken(verificationToken);
        savedUser.setVerificationTokenExpiry(LocalDateTime.now().plusHours(24));
        userRepository.save(savedUser);
        
        // Send verification email
        try {
            emailService.sendVerificationEmail(
                savedUser.getEmail(),
                savedUser.getFirstName(),
                verificationToken
            );
        } catch (Exception e) {
            // Log error but don't fail registration
            System.err.println("Failed to send verification email: " + e.getMessage());
        }
        
        return modelMapper.map(savedUser, UserDTO.class);
    }

    public JwtAuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtTokenProvider.generateToken(userDetails);
        
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return new JwtAuthResponse(token, user.getId(), user.getEmail(), user.getRole().name());
    }
    
    public UserDTO getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return modelMapper.map(user, UserDTO.class);
    }
    
    @Transactional
    public UserDTO updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getDateOfBirth() != null) {
            user.setDateOfBirth(request.getDateOfBirth());
        }
        if (request.getGender() != null) {
            try {
                user.setGender(User.Gender.valueOf(request.getGender().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid gender: " + request.getGender());
            }
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        if (request.getCity() != null) {
            user.setCity(request.getCity());
        }
        if (request.getState() != null) {
            user.setState(request.getState());
        }
        if (request.getZipCode() != null) {
            user.setZipCode(request.getZipCode());
        }
        
        User updatedUser = userRepository.save(user);
        return modelMapper.map(updatedUser, UserDTO.class);
    }
    
    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        
        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadCredentialsException("Current password is incorrect");
        }
        
        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
    
    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        
        // Generate 6-digit OTP
        String otp = String.format("%06d", (int)(Math.random() * 1000000));
        
        // Store OTP with 10 minutes expiration
        user.setPasswordResetOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);
        
        // Send OTP email
        try {
            emailService.sendPasswordResetOtp(
                user.getEmail(),
                user.getFirstName(),
                otp
            );
        } catch (Exception e) {
            // Log error but don't fail request
            System.err.println("Failed to send OTP email: " + e.getMessage());
        }
    }
    
    @Transactional
    public ApiResponse<String> verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        
        // Check if OTP is set
        if (user.getPasswordResetOtp() == null) {
            throw new BadRequestException("No OTP request found for this email");
        }
        
        // Check if OTP is expired (10 minutes)
        if (user.getOtpExpiry() == null || user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            user.setPasswordResetOtp(null);
            user.setOtpExpiry(null);
            userRepository.save(user);
            throw new BadRequestException("OTP has expired. Please request a new one");
        }
        
        // Verify OTP
        if (!otp.equals(user.getPasswordResetOtp())) {
            throw new BadRequestException("Invalid OTP");
        }
        
        return ApiResponse.success("OTP verified successfully. You can now reset your password", null);
    }
    
    @Transactional
    public JwtAuthResponse resetPasswordWithOtp(String email, String otp, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        
        // Check if OTP is set
        if (user.getPasswordResetOtp() == null) {
            throw new BadRequestException("No OTP request found for this email");
        }
        
        // Check if OTP is expired
        if (user.getOtpExpiry() == null || user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            user.setPasswordResetOtp(null);
            user.setOtpExpiry(null);
            userRepository.save(user);
            throw new BadRequestException("OTP has expired. Please request a new one");
        }
        
        // Verify OTP
        if (!otp.equals(user.getPasswordResetOtp())) {
            throw new BadRequestException("Invalid OTP");
        }
        
        // Update password and clear OTP
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setPasswordResetOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);
        
        // Auto login - generate JWT token
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtTokenProvider.generateToken(userDetails);
        
        JwtAuthResponse response = new JwtAuthResponse();
        response.setToken(token);
        response.setType("Bearer");
        response.setUserId(user.getId());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());
        
        return response;
    }
    
    @Transactional
    public void resetPassword(String token, String newPassword) {
        // Find user by reset token
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid or expired reset token"));
        
        // Check if token is expired
        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Reset token has expired");
        }
        
        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }
    
    @Transactional
    public void verifyEmail(String token) {
        // Find user by verification token
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid verification token"));
        
        // Check if token is expired (24 hours)
        if (user.getVerificationTokenExpiry() == null || user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Verification token has expired");
        }
        
        // Verify email
        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(null);
        userRepository.save(user);
    }
    
    @Transactional
    public void resendVerification(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        
        if (user.getEmailVerified()) {
            throw new BadRequestException("Email is already verified");
        }
        
        // Generate new verification token
        String verificationToken = UUID.randomUUID().toString();
        
        // Store verification token with 24 hours expiration
        user.setVerificationToken(verificationToken);
        user.setVerificationTokenExpiry(LocalDateTime.now().plusHours(24));
        userRepository.save(user);
        
        // Send verification email
        try {
            emailService.sendVerificationEmail(
                user.getEmail(),
                user.getFirstName(),
                verificationToken
            );
        } catch (Exception e) {
            // Log error but don't fail request
            System.err.println("Failed to send verification email: " + e.getMessage());
        }
    }
}
