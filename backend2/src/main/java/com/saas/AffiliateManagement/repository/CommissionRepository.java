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
import java.util.Optional;

@Repository
public interface CommissionRepository extends JpaRepository<Commission, Long> {

    Page<Commission> findByAffiliateId(Long affiliateId, Pageable pageable);

    Page<Commission> findByAffiliateIdAndStatus(Long affiliateId, String status, Pageable pageable);

    Page<Commission> findByStatus(String status, Pageable pageable);

    Page<Commission> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    @Query(value = "SELECT * FROM commissions WHERE created_at BETWEEN :startDate AND :endDate",
            nativeQuery = true)
    List<Commission> findByCreatedAtBetweenAsList(@Param("startDate") LocalDateTime startDate,
                                                  @Param("endDate") LocalDateTime endDate);

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

    @Query("SELECT COALESCE(SUM(c.amount), 0) FROM Commission c WHERE c.affiliate.client.id = :clientId " +
            "AND c.createdAt BETWEEN :startDate AND :endDate")
    BigDecimal calculateTotalCommissionByClientIdAndDateRange(@Param("clientId") Long clientId,
                                                              @Param("startDate") LocalDateTime startDate,
                                                              @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COALESCE(SUM(c.amount), 0) FROM Commission c WHERE c.affiliate.id = :affiliateId " +
            "AND c.createdAt BETWEEN :startDate AND :endDate")
    Optional<BigDecimal> calculateTotalCommissionByAffiliateId(@Param("affiliateId") Long affiliateId,
                                                               @Param("startDate") LocalDateTime startDate,
                                                               @Param("endDate") LocalDateTime endDate);


    @Query("SELECT c FROM Commission c WHERE c.affiliate.client.id = :clientId " +
            "AND (:status IS NULL OR :status = '' OR c.status = :status) " +
            "AND (:type IS NULL OR :type = '' OR c.type = :type) " +
            "AND (:affiliateName IS NULL OR :affiliateName = '' OR " +
            "LOWER(CONCAT(c.affiliate.firstName, ' ', c.affiliate.lastName)) LIKE LOWER(CONCAT('%', :affiliateName, '%'))) " +
            "AND (:search IS NULL OR :search = '' OR " +
            "('' || COALESCE(c.description, '')) LIKE CONCAT('%', :search, '%') OR " +
            "('' || COALESCE(c.referralId, '')) LIKE CONCAT('%', :search, '%') OR " +
            "LOWER(CONCAT(c.affiliate.firstName, ' ', c.affiliate.lastName)) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "('' || COALESCE(c.affiliate.email, '')) LIKE CONCAT('%', :search, '%'))")
    Page<Commission> findFilteredByClient(@Param("clientId") Long clientId,
                                          @Param("status") String status,
                                          @Param("type") String type,
                                          @Param("affiliateName") String affiliateName,
                                          @Param("search") String search,
                                          Pageable pageable);




}