// CommissionRepository.java
package com.saas.AffiliateManagement.repository;

import com.saas.AffiliateManagement.models.entity.Commission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CommissionRepository extends JpaRepository<Commission, Long> {

    Page<Commission> findByAffiliateId(Long affiliateId, Pageable pageable);

    Page<Commission> findByAffiliateIdAndStatus(Long affiliateId, String status, Pageable pageable);

    Page<Commission> findByStatus(String status, Pageable pageable);

    Page<Commission> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    // Add List versions for the earnings service
    List<Commission> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    List<Commission> findByAffiliateIdAndCreatedAtBetween(Long affiliateId, LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT c FROM Commission c WHERE c.affiliate.client.id = :clientId AND c.createdAt BETWEEN :startDate AND :endDate")
    List<Commission> findByAffiliateClientIdAndCreatedAtBetween(@Param("clientId") Long clientId,
                                                                @Param("startDate") LocalDateTime startDate,
                                                                @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COALESCE(SUM(c.amount), 0) FROM Commission c WHERE c.affiliate.id = :affiliateId " +
            "AND c.createdAt BETWEEN :startDate AND :endDate")
    BigDecimal calculateTotalCommissionByAffiliateAndDateRange(@Param("affiliateId") Long affiliateId,
                                                               @Param("startDate") LocalDateTime startDate,
                                                               @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COALESCE(SUM(c.amount), 0) FROM Commission c WHERE c.status = :status")
    BigDecimal calculateTotalCommissionByStatus(@Param("status") String status);
}