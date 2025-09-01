package com.saas.AffiliateManagement.service;

import com.saas.AffiliateManagement.models.dto.PayoutDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface PayoutService {

    Page<PayoutDto> getPayoutsForClient(
            Long clientId,
            String partnerName,
            String email,
            String status,
            LocalDate commissionStart,
            LocalDate commissionEnd,
            Pageable pageable
    );
}
