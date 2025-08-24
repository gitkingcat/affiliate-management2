package com.saas.AffiliateManagement.repository;

import com.saas.AffiliateManagement.models.entity.Client;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {

    boolean existsByEmail(String email);

    boolean existsByCompanyName(String companyName);

    Optional<Client> findByEmail(String email);

    Optional<Client> findByCompanyName(String companyName);

    Page<Client> findByStatus(String status, Pageable pageable);

    Page<Client> findBySubscriptionPlan(String subscriptionPlan, Pageable pageable);

    long countByStatus(String status);

    @Query("SELECT c FROM Client c WHERE " +
            "(:companyName = '' OR LOWER(c.companyName) LIKE LOWER(CONCAT('%', :companyName, '%'))) AND " +
            "(:status = '' OR LOWER(c.status) LIKE LOWER(CONCAT('%', :status, '%'))) AND " +
            "(:subscriptionPlan = '' OR LOWER(c.subscriptionPlan) LIKE LOWER(CONCAT('%', :subscriptionPlan, '%')))")
    Page<Client> findByCompanyNameContainingIgnoreCaseAndStatusContainingIgnoreCaseAndSubscriptionPlanContainingIgnoreCase(
            @Param("companyName") String companyName,
            @Param("status") String status,
            @Param("subscriptionPlan") String subscriptionPlan,
            Pageable pageable);

    @Query("SELECT c FROM Client c WHERE c.emailVerified = false AND c.createdAt < :cutoffDate")
    Page<Client> findUnverifiedClientsOlderThan(@Param("cutoffDate") java.time.LocalDateTime cutoffDate, Pageable pageable);

    @Query("SELECT c FROM Client c WHERE c.status = 'ACTIVE' AND c.subscriptionPlan = :plan")
    Page<Client> findActiveClientsByPlan(@Param("plan") String subscriptionPlan, Pageable pageable);
}