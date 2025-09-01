package com.saas.AffiliateManagement.repository;

import com.saas.AffiliateManagement.models.entity.Payout;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface PayoutRepository extends JpaRepository<Payout, Long>, JpaSpecificationExecutor<Payout> {

    @Query(value = "SELECT p.* FROM payouts p " +
            "JOIN affiliates a ON a.id = p.affiliate_id " +
            "WHERE a.client_id = :clientId " +
            "AND (:partnerName IS NULL OR " +
            "     (a.first_name ILIKE '%' || :partnerName || '%' OR " +
            "      a.last_name ILIKE '%' || :partnerName || '%')) " +
            "AND (:email IS NULL OR a.email ILIKE '%' || :email || '%') " +
            "AND (:status IS NULL OR p.status = :status) " +
            "AND (:commissionStart IS NULL OR p.commission_start >= :commissionStart) " +
            "AND (:commissionEnd IS NULL OR p.commission_end <= :commissionEnd) " +
            "ORDER BY p.created_at DESC",
            countQuery = "SELECT COUNT(*) FROM payouts p " +
                    "JOIN affiliates a ON a.id = p.affiliate_id " +
                    "WHERE a.client_id = :clientId " +
                    "AND (:partnerName IS NULL OR " +
                    "     (a.first_name ILIKE '%' || :partnerName || '%' OR " +
                    "      a.last_name ILIKE '%' || :partnerName || '%')) " +
                    "AND (:email IS NULL OR a.email ILIKE '%' || :email || '%') " +
                    "AND (:status IS NULL OR p.status = :status) " +
                    "AND (:commissionStart IS NULL OR p.commission_start >= :commissionStart) " +
                    "AND (:commissionEnd IS NULL OR p.commission_end <= :commissionEnd)",
            nativeQuery = true)
    Page<Payout> findPayoutsForClientWithFilters(
            @Param("clientId") Long clientId,
            @Param("partnerName") String partnerName,
            @Param("email") String email,
            @Param("status") String status,
            @Param("commissionStart") LocalDate commissionStart,
            @Param("commissionEnd") LocalDate commissionEnd,
            Pageable pageable);
}
