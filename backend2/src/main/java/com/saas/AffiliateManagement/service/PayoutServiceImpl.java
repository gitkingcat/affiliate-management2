package com.saas.AffiliateManagement.service;

import com.saas.AffiliateManagement.models.dto.PayoutDto;
import com.saas.AffiliateManagement.models.entity.Payout;
import com.saas.AffiliateManagement.repository.PayoutRepository;
import com.saas.AffiliateManagement.service.mappers.PayoutMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PayoutServiceImpl implements PayoutService {

    private final PayoutRepository payoutRepository;
    private final PayoutMapper payoutMapper;

    @Override
    public Page<PayoutDto> getPayoutsForClient(
            Long clientId,
            String partnerName,
            String email,
            String status,
            LocalDate commissionStart,
            LocalDate commissionEnd,
            Pageable pageable) {

        Pageable sortedPageable = pageable.getSort().isUnsorted()
                ? PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "created_at"))
                : pageable;

        Page<Payout> payouts = payoutRepository.findPayoutsForClientWithFilters(
                clientId,
                partnerName != null ? partnerName.toLowerCase() : null,
                email != null ? email.toLowerCase() : null,
                status != null ? status.toLowerCase() : null,
                commissionStart, commissionEnd, sortedPageable);

        return payouts.map(payoutMapper::toDto);
    }
}