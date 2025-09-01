package com.saas.AffiliateManagement.service.mappers;

import com.saas.AffiliateManagement.models.dto.PayoutDto;
import com.saas.AffiliateManagement.models.entity.Payout;
import org.springframework.stereotype.Component;

@Component
public class PayoutMapper {

    public PayoutDto toDto(Payout payout) {
        if (payout == null) {
            return null;
        }

        return PayoutDto.builder()
                .id(payout.getId())
                .createdAt(payout.getCreatedAt())
                .partnerName(payout.getAffiliate().getFirstName() + " " + payout.getAffiliate().getLastName())
                .email(payout.getAffiliate().getEmail())
                .method(payout.getMethod())
                .commissionStart(payout.getCommissionStart())
                .commissionEnd(payout.getCommissionEnd())
                .amount(payout.getAmount())
                .status(payout.getStatus())
                .build();
    }
}
