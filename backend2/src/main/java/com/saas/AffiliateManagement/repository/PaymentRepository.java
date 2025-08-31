package com.saas.AffiliateManagement.repository;

import com.saas.AffiliateManagement.models.entity.Payment;
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
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Page<Payment> findByAffiliateId(Long affiliateId, Pageable pageable);

    Page<Payment> findByStatus(String status, Pageable pageable);

    Page<Payment> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    Page<Payment> findByCreatedAtBetweenAndStatus(LocalDateTime startDate, LocalDateTime endDate,
                                                  String status, Pageable pageable);

    List<Payment> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.affiliate.id = :affiliateId " +
            "AND p.createdAt BETWEEN :startDate AND :endDate")
    Optional<BigDecimal> calculateTotalPaymentsForAffiliate(@Param("affiliateId") Long affiliateId,
                                                            @Param("startDate") LocalDateTime startDate,
                                                            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = :status")
    Optional<BigDecimal> calculateTotalPaymentsByStatus(@Param("status") String status);

    @Query(value = "SELECT * FROM payments p WHERE p.affiliate_id = :affiliateId " +
            "ORDER BY p.created_at DESC LIMIT :limit", nativeQuery = true)
    List<Payment> findTopByAffiliateIdOrderByCreatedAtDesc(@Param("affiliateId") Long affiliateId,
                                                           @Param("limit") int limit);

    @Query("SELECT p FROM Payment p " +
            "LEFT JOIN p.affiliate a " +
            "WHERE p.id = :clientId " +
            "AND (:search IS NULL OR :search = '' OR " +
            "     LOWER(CONCAT(a.firstName, ' ', a.lastName)) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "     LOWER(a.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "     LOWER(p.transactionId) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "     LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND (:status IS NULL OR :status = '' OR p.status = :status) " +
            "AND (:paymentMethod IS NULL OR :paymentMethod = '' OR p.paymentMethod = :paymentMethod) " +
            "AND (CAST(:startDate AS timestamp) IS NULL OR p.createdAt >= :startDate) " +
            "AND (CAST(:endDate AS timestamp) IS NULL OR p.createdAt <= :endDate) " +
            "ORDER BY p.createdAt DESC")
    Page<Payment> findTransactionsByClientWithFilters(
            @Param("clientId") Long clientId,
            @Param("search") String search,
            @Param("status") String status,
            @Param("paymentMethod") String paymentMethod,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable
    );

}
