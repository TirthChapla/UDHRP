package com.doctorai.service;

import com.doctorai.dto.*;
import com.doctorai.exception.BadRequestException;
import com.doctorai.exception.ResourceNotFoundException;
import com.doctorai.model.Receptionist;
import com.doctorai.model.User;
import com.doctorai.repository.ReceptionistRepository;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ReceptionistRepository receptionistRepository;
    
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
        log.info("Starting user registration for email: {}", registerRequest.getEmail());
        
        // Check if email already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            log.warn("Registration failed - Email already exists: {}", registerRequest.getEmail());
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
            log.debug("User role set to: {}", registerRequest.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            log.error("Invalid role provided: {}", registerRequest.getRole());
            throw new BadRequestException("Invalid role: " + registerRequest.getRole());
        }
        
        user.setIsActive(true);
        user.setEmailVerified(false);
        
        User savedUser = userRepository.save(user);
        log.info("User saved successfully with ID: {}", savedUser.getId());
        
        // Create receptionist record if role is receptionist
        if ("RECEPTIONIST".equalsIgnoreCase(registerRequest.getRole())) {
            log.info("Creating receptionist record for user ID: {}", savedUser.getId());
            Receptionist receptionist = new Receptionist();
            receptionist.setUser(savedUser);
            receptionist.setReceptionistId("REC-" + savedUser.getId());
            receptionist.setDepartment(registerRequest.getDepartment());
            receptionist.setEmployeeId(registerRequest.getEmployeeId());
            receptionistRepository.save(receptionist);
            log.info("Receptionist record created successfully");
        }
        
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
        log.info("Login attempt for email: {}", loginRequest.getEmail());
        
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        log.debug("Authentication successful for: {}", loginRequest.getEmail());
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtTokenProvider.generateToken(userDetails);
        log.debug("JWT token generated for: {}", loginRequest.getEmail());
        
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        log.info("Login successful for user: {} with role: {}", user.getEmail(), user.getRole());
        return new JwtAuthResponse(token, user.getId(), user.getEmail(), user.getRole().name());
    }
    
    public UserDTO getCurrentUser(String email) {
        log.debug("Fetching current user details for: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        log.debug("Current user found: {} with role: {}", email, user.getRole());
        return modelMapper.map(user, UserDTO.class);
    }
    
    @Transactional
    public UserDTO updateProfile(String email, UpdateProfileRequest request) {
        log.info("Updating profile for user: {}", email);
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
        log.info("Profile updated successfully for user: {}", email);
        return modelMapper.map(updatedUser, UserDTO.class);
    }
    
    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        log.info("Password change request for user: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        
        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            log.warn("Password change failed - incorrect current password for user: {}", email);
            throw new BadCredentialsException("Current password is incorrect");
        }
        
        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("Password changed successfully for user: {}", email);
    }
    
    @Transactional
    public void forgotPassword(String email) {
        log.info("Forgot password request for email: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        
        // Generate 6-digit OTP
        String otp = String.format("%06d", (int)(Math.random() * 1000000));
        log.debug("OTP generated for user: {}", email);
        
        // Store OTP with 10 minutes expiration
        user.setPasswordResetOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);
        log.debug("OTP stored with 10 minutes expiry for user: {}", email);
        
        // Send OTP email
        try {
            emailService.sendPasswordResetOtp(
                user.getEmail(),
                user.getFirstName(),
                otp
            );
            log.info("OTP email sent successfully to: {}", email);
        } catch (Exception e) {
            // Log error but don't fail request
            log.error("Failed to send OTP email to {}: {}", email, e.getMessage());
        }
    }
    
    @Transactional
    public ApiResponse<String> verifyOtp(String email, String otp) {
        log.info("OTP verification request for email: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        
        // Check if OTP is set
        if (user.getPasswordResetOtp() == null) {
            log.warn("No OTP request found for email: {}", email);
            throw new BadRequestException("No OTP request found for this email");
        }
        
        // Check if OTP is expired (10 minutes)
        if (user.getOtpExpiry() == null || user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            log.warn("OTP expired for email: {}", email);
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
    
    @Transactional
    public UserDTO registerReceptionist(RegisterReceptionistRequest request) {
        // Verify doctor credentials
        User doctor = userRepository.findByEmail(request.getDoctorEmail())
                .orElseThrow(() -> new BadRequestException("Doctor not found with email: " + request.getDoctorEmail()));
        
        // Check if user is actually a doctor
        if (doctor.getRole() != User.UserRole.DOCTOR) {
            throw new BadRequestException("User is not a doctor");
        }
        
        // Verify doctor password
        if (!passwordEncoder.matches(request.getDoctorPassword(), doctor.getPassword())) {
            throw new BadCredentialsException("Invalid doctor credentials");
        }
        
        // Check if receptionist email already exists
        if (userRepository.existsByEmail(request.getReceptionistEmail())) {
            throw new BadRequestException("Email already exists");
        }
        
        // Parse receptionist name
        String[] nameParts = request.getReceptionistName().trim().split("\\s+", 2);
        String firstName = nameParts[0];
        String lastName = nameParts.length > 1 ? nameParts[1] : "";
        
        // Create new receptionist user
        User receptionistUser = new User();
        receptionistUser.setEmail(request.getReceptionistEmail());
        receptionistUser.setPassword(passwordEncoder.encode(request.getReceptionistPassword()));
        receptionistUser.setFirstName(firstName);
        receptionistUser.setLastName(lastName);
        receptionistUser.setPhoneNumber(request.getReceptionistPhone());
        receptionistUser.setRole(User.UserRole.RECEPTIONIST);
        receptionistUser.setIsActive(true);
        receptionistUser.setEmailVerified(false);
        
        User savedUser = userRepository.save(receptionistUser);
        
        // Create receptionist record
        Receptionist receptionist = new Receptionist();
        receptionist.setUser(savedUser);
        receptionist.setDoctor(doctor);
        receptionist.setReceptionistId(generateReceptionistId());
        receptionistRepository.save(receptionist);
        
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
    
    private String generateReceptionistId() {
        String prefix = "REC";
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        Random random = new Random();
        String receptionistId;
        
        // Generate unique ID
        int attempts = 0;
        while (attempts < 100) {
            int randomNum = random.nextInt(10000);
            receptionistId = String.format("%s%s%04d", prefix, datePart, randomNum);
            
            if (!receptionistRepository.existsByReceptionistId(receptionistId)) {
                return receptionistId;
            }
            attempts++;
        }
        
        throw new RuntimeException("Failed to generate unique receptionist ID after 100 attempts");
    }
}
