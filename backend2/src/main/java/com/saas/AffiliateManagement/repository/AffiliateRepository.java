package com.saas.AffiliateManagement.repository;

import com.saas.AffiliateManagement.models.entity.Affiliate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AffiliateRepository extends JpaRepository<Affiliate, Long> {

    boolean existsByEmail(String email);

    boolean existsByEmailAndClientId(String email, Long clientId);

    boolean existsByReferralCode(String referralCode);

    Optional<Affiliate> findByEmail(String email);

    Optional<Affiliate> findByReferralCode(String referralCode);

    Page<Affiliate> findByStatus(String status, Pageable pageable);

    Page<Affiliate> findByClientId(Long clientId, Pageable pageable);

    List<Affiliate> findByClientId(Long clientId);

    Page<Affiliate> findByClientIdAndStatus(Long clientId, String status, Pageable pageable);

    long countByStatus(String status);

    long countByClientId(Long clientId);

    long countByClientIdAndStatus(Long clientId, String status);

    @Query("SELECT COUNT(a) FROM Affiliate a WHERE a.client.id = :clientId " +
            "AND a.createdAt BETWEEN :startDate AND :endDate")
    long countByClientIdAndCreatedAtBetween(@Param("clientId") Long clientId,
                                            @Param("startDate") LocalDateTime startDate,
                                            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT a FROM Affiliate a WHERE " +
            "(:email = '' OR LOWER(a.email) LIKE LOWER(CONCAT('%', :email, '%'))) AND " +
            "(:status = '' OR LOWER(a.status) LIKE LOWER(CONCAT('%', :status, '%'))) AND " +
            "(:companyName = '' OR LOWER(a.companyName) LIKE LOWER(CONCAT('%', :companyName, '%'))) AND " +
            "(:clientId IS NULL OR a.client.id = :clientId)")
    Page<Affiliate> searchAffiliates(@Param("email") String email,
                                     @Param("status") String status,
                                     @Param("companyName") String companyName,
                                     @Param("clientId") Long clientId,
                                     Pageable pageable);

    @Query("SELECT a FROM Affiliate a WHERE a.client.id = :clientId AND " +
            "(:email = '' OR LOWER(a.email) LIKE LOWER(CONCAT('%', :email, '%'))) AND " +
            "(:status = '' OR LOWER(a.status) LIKE LOWER(CONCAT('%', :status, '%'))) AND " +
            "(:companyName = '' OR LOWER(a.companyName) LIKE LOWER(CONCAT('%', :companyName, '%')))")
    Page<Affiliate> searchClientAffiliates(@Param("clientId") Long clientId,
                                           @Param("email") String email,
                                           @Param("status") String status,
                                           @Param("companyName") String companyName,
                                           Pageable pageable);


}