package com.doctorai.controller;

import com.doctorai.dto.ApiResponse;
import com.doctorai.dto.ReceptionistProfileDTO;
import com.doctorai.dto.UpdateReceptionistProfileRequest;
import com.doctorai.service.ReceptionistProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/receptionist/profile")
@Tag(name = "Receptionist Profile", description = "Receptionist Profile Management APIs")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class ReceptionistController {

    @Autowired
    private ReceptionistProfileService receptionistProfileService;

    @GetMapping
    @Operation(summary = "Get receptionist profile", description = "Retrieve the current logged-in receptionist's profile information")
    public ResponseEntity<ApiResponse<ReceptionistProfileDTO>> getReceptionistProfile(Authentication authentication) {
        log.info("Fetching receptionist profile for user: {}", authentication.getName());
        ReceptionistProfileDTO profile = receptionistProfileService.getReceptionistProfile(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Receptionist profile retrieved successfully", profile));
    }

    @PutMapping
    @Operation(summary = "Update receptionist profile", description = "Update the current logged-in receptionist's profile information")
    public ResponseEntity<ApiResponse<ReceptionistProfileDTO>> updateReceptionistProfile(
            @Valid @RequestBody UpdateReceptionistProfileRequest request,
            Authentication authentication) {
        log.info("Updating receptionist profile for user: {}", authentication.getName());
        ReceptionistProfileDTO profile = receptionistProfileService.updateReceptionistProfile(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Receptionist profile updated successfully", profile));
    }
}
