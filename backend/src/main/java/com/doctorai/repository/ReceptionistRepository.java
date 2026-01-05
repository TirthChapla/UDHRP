package com.doctorai.repository;

import com.doctorai.model.Receptionist;
import com.doctorai.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReceptionistRepository extends JpaRepository<Receptionist, Long> {
    
    Optional<Receptionist> findByUser(User user);
    
    Optional<Receptionist> findByReceptionistId(String receptionistId);
    
    boolean existsByReceptionistId(String receptionistId);
    
    Optional<Receptionist> findByUserEmail(String email);
}
