// ReferralRepository.java
package com.saas.AffiliateManagement.repository;

import com.saas.AffiliateManagement.models.entity.Referral;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReferralRepository extends JpaRepository<Referral, Long> {

    Optional<Referral> findByReferralCode(String referralCode);

    boolean existsByReferralCodeAndStatus(String referralCode, String status);

    List<Referral> findByAffiliateIdAndClickedAtBetween(Long affiliateId,
                                                        LocalDateTime startDate,
                                                        LocalDateTime endDate);

    List<Referral> findByClickedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT r FROM Referral r WHERE " +
            "(:status IS NULL OR r.status = :status) AND " +
            "(:affiliateId IS NULL OR r.affiliate.id = :affiliateId) AND " +
            "(:referralCode IS NULL OR r.referralCode LIKE %:referralCode%)")
    Page<Referral> searchReferrals(@Param("status") String status,
                                   @Param("affiliateId") Long affiliateId,
                                   @Param("referralCode") String referralCode,
                                   Pageable pageable);

    @Query("SELECT r FROM Referral r WHERE r.affiliate.id = :affiliateId AND " +
            "(:status IS NULL OR r.status = :status) AND " +
            "r.clickedAt BETWEEN :startDate AND :endDate")
    Page<Referral> findByAffiliateIdAndDateRange(@Param("affiliateId") Long affiliateId,
                                                 @Param("status") String status,
                                                 @Param("startDate") LocalDateTime startDate,
                                                 @Param("endDate") LocalDateTime endDate,
                                                 Pageable pageable);

    @Query("SELECT r FROM Referral r WHERE r.affiliate.id = :affiliateId AND " +
            "r.status = 'CONVERTED' AND r.clickedAt BETWEEN :startDate AND :endDate " +
            "ORDER BY r.conversionValue DESC")
    Page<Referral> findTopPerformingByAffiliateId(@Param("affiliateId") Long affiliateId,
                                                  @Param("startDate") LocalDateTime startDate,
                                                  @Param("endDate") LocalDateTime endDate,
                                                  Pageable pageable);

    @Query("SELECT COALESCE(SUM(r.conversionValue), 0) FROM Referral r WHERE " +
            "r.affiliate.id = :affiliateId AND r.status = 'CONVERTED' AND " +
            "r.convertedAt BETWEEN :startDate AND :endDate")
    Optional<BigDecimal> calculateTotalRevenue(@Param("affiliateId") Long affiliateId,
                                               @Param("startDate") LocalDateTime startDate,
                                               @Param("endDate") LocalDateTime endDate);

    @Query("SELECT r FROM Referral r WHERE " +
            "(:affiliateId IS NULL OR r.affiliate.id = :affiliateId) AND " +
            "r.status = 'CLICKED' AND r.clickedAt < :cutoffDate")
    Page<Referral> findPendingConversions(@Param("affiliateId") Long affiliateId,
                                          @Param("cutoffDate") LocalDateTime cutoffDate,
                                          Pageable pageable);

    @Query("SELECT COUNT(r) FROM Referral r WHERE r.affiliate.client.id = :clientId " +
            "AND r.createdAt BETWEEN :startDate AND :endDate")
    Long countByAffiliateClientIdAndCreatedAtBetween(@Param("clientId") Long clientId,
                                                     @Param("startDate") LocalDateTime startDate,
                                                     @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(r) FROM Referral r WHERE r.affiliate.client.id = :clientId " +
            "AND r.status = :status AND r.createdAt BETWEEN :startDate AND :endDate")
    Long countByAffiliateClientIdAndStatusAndCreatedAtBetween(@Param("clientId") Long clientId,
                                                              @Param("status") String status,
                                                              @Param("startDate") LocalDateTime startDate,
                                                              @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COALESCE(SUM(r.conversionValue), 0) FROM Referral r " +
            "WHERE r.affiliate.client.id = :clientId AND r.status = 'CONVERTED' " +
            "AND r.createdAt BETWEEN :startDate AND :endDate")
    BigDecimal calculateTotalRevenueByClientIdAndDateRange(@Param("clientId") Long clientId,
                                                           @Param("startDate") LocalDateTime startDate,
                                                           @Param("endDate") LocalDateTime endDate);
}