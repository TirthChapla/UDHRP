package com.doctorai.repository;

import com.doctorai.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    
    Optional<Doctor> findByUserId(Long userId);
    
    Optional<Doctor> findByLicenseNumber(String licenseNumber);
    
    List<Doctor> findBySpecialization(String specialization);
    
    List<Doctor> findByIsAvailableTrue();
    
    List<Doctor> findBySpecializationAndIsAvailableTrue(String specialization);
    
    @Query("SELECT d FROM Doctor d WHERE LOWER(d.specialization) LIKE LOWER(CONCAT('%', :specialization, '%'))")
    List<Doctor> findBySpecializationContainingIgnoreCase(@Param("specialization") String specialization);
    
    @Query("SELECT d FROM Doctor d JOIN d.user u WHERE LOWER(u.city) = LOWER(:city)")
    List<Doctor> findByUserCity(@Param("city") String city);
    
    @Query("SELECT d FROM Doctor d JOIN d.user u WHERE " +
           "(LOWER(u.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.specialization) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.hospital) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Doctor> searchDoctors(@Param("query") String query);
    
    @Query("SELECT DISTINCT d.specialization FROM Doctor d WHERE d.specialization IS NOT NULL AND d.specialization <> ''")
    List<String> findDistinctSpecializations();
    
    @Query("SELECT DISTINCT u.city FROM Doctor d JOIN d.user u WHERE u.city IS NOT NULL AND u.city <> ''")
    List<String> findDistinctCities();
}
