package com.doctorai.controller;

import com.doctorai.dto.*;
import com.doctorai.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Authentication APIs")
@Slf4j
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<ApiResponse<UserDTO>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        log.info("Registration request received for email: {}, role: {}", registerRequest.getEmail(), registerRequest.getRole());
        UserDTO user = authService.register(registerRequest);
        log.info("User registered successfully with email: {}", registerRequest.getEmail());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", user));
    }
    
    @PostMapping("/login")
    @Operation(summary = "Login user")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        log.info("Login attempt for email: {}", loginRequest.getEmail());
        JwtAuthResponse response = authService.login(loginRequest);
        log.info("Login successful for email: {}", loginRequest.getEmail());
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }
    
    @GetMapping("/me")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Get current logged in user")
    public ResponseEntity<ApiResponse<UserDTO>> getCurrentUser(Authentication authentication) {
        log.info("Fetching current user details for: {}", authentication.getName());
        UserDTO user = authService.getCurrentUser(authentication.getName());
        log.debug("Current user details fetched successfully for: {}", authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(user));
    }
    
    @PutMapping("/profile")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Update user profile")
    public ResponseEntity<ApiResponse<UserDTO>> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            Authentication authentication) {
        log.info("Profile update request for user: {}", authentication.getName());
        UserDTO user = authService.updateProfile(authentication.getName(), request);
        log.info("Profile updated successfully for user: {}", authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", user));
    }
    
    @PostMapping("/change-password")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Change user password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {
        log.info("Password change request for user: {}", authentication.getName());
        authService.changePassword(authentication.getName(), request);
        log.info("Password changed successfully for user: {}", authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }
    
    @PostMapping("/forgot-password")
    @Operation(summary = "Request password reset OTP")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        log.info("Forgot password request for email: {}", request.getEmail());
        authService.forgotPassword(request.getEmail());
        log.info("OTP sent successfully to email: {}", request.getEmail());
        return ResponseEntity.ok(ApiResponse.success("OTP sent to your email", null));
    }
    
    @PostMapping("/verify-otp")
    @Operation(summary = "Verify OTP for password reset")
    public ResponseEntity<ApiResponse<String>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        log.info("OTP verification request for email: {}", request.getEmail());
        ApiResponse<String> response = authService.verifyOtp(request.getEmail(), request.getOtp());
        log.info("OTP verification completed for email: {}", request.getEmail());
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/reset-password-otp")
    @Operation(summary = "Reset password with OTP and auto login")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> resetPasswordWithOtp(@Valid @RequestBody ResetPasswordWithOtpRequest request) {
        log.info("Password reset with OTP request for email: {}", request.getEmail());
        JwtAuthResponse authResponse = authService.resetPasswordWithOtp(request.getEmail(), request.getOtp(), request.getNewPassword());
        log.info("Password reset successful and user logged in: {}", request.getEmail());
        return ResponseEntity.ok(ApiResponse.success("Password reset successful. You are now logged in", authResponse));
    }
    
    @PostMapping("/reset-password")
    @Operation(summary = "Reset password with token")
    public ResponseEntity<ApiResponse<String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        log.info("Password reset with token request received");
        authService.resetPassword(request.getToken(), request.getNewPassword());
        log.info("Password reset with token successful");
        return ResponseEntity.ok(ApiResponse.success("Password reset successfully", null));
    }
    
    @GetMapping("/verify-email")
    @Operation(summary = "Verify email with token (GET request)")
    public ResponseEntity<ApiResponse<String>> verifyEmailGet(@RequestParam String token) {
        log.info("Email verification request received (GET)");
        authService.verifyEmail(token);
        log.info("Email verification successful");
        return ResponseEntity.ok(ApiResponse.success("Email verified successfully", null));
    }
    
    @PostMapping("/verify-email")
    @Operation(summary = "Verify email with token (POST request)")
    public ResponseEntity<ApiResponse<String>> verifyEmailPost(@Valid @RequestBody VerifyEmailRequest request) {
        log.info("Email verification request received (POST)");
        authService.verifyEmail(request.getToken());
        log.info("Email verification successful");
        return ResponseEntity.ok(ApiResponse.success("Email verified successfully", null));
    }
    
    @PostMapping("/resend-verification")
    @Operation(summary = "Resend email verification")
    public ResponseEntity<ApiResponse<String>> resendVerification(@Valid @RequestBody ResendVerificationRequest request) {
        log.info("Resend verification email request for: {}", request.getEmail());
        authService.resendVerification(request.getEmail());
        log.info("Verification email resent to: {}", request.getEmail());
        return ResponseEntity.ok(ApiResponse.success("Verification email sent", null));
    }
    
    @PostMapping("/register-receptionist")
    @Operation(summary = "Register a new receptionist with doctor verification")
    public ResponseEntity<ApiResponse<UserDTO>> registerReceptionist(@Valid @RequestBody RegisterReceptionistRequest request) {
        log.info("Receptionist registration request for email: {}", request.getDoctorEmail());
        UserDTO user = authService.registerReceptionist(request);
        log.info("Receptionist registered successfully: {}", request.getDoctorEmail());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Receptionist registered successfully", user));
    }
}
