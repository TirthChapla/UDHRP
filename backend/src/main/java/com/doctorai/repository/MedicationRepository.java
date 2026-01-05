package com.doctorai.repository;

import com.doctorai.model.Medication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicationRepository extends JpaRepository<Medication, Long> {
    
    List<Medication> findByPrescriptionId(Long prescriptionId);
    
    void deleteByPrescriptionId(Long prescriptionId);
}
