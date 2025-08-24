// CommissionMapper.java
package com.saas.AffiliateManagement.service.mappers;


import com.saas.AffiliateManagement.models.entity.Commission;
import com.saas.AffiliateManagement.models.requests.CommissionCreateRequest;
import com.saas.AffiliateManagement.models.dto.CommissionDto;
import com.saas.AffiliateManagement.models.requests.CommissionUpdateRequest;
import org.springframework.stereotype.Component;

@Component
public class CommissionMapper {

    public CommissionDto toDto(Commission commission) {
        if (commission == null) {
            return null;
        }

        return CommissionDto.builder()
                .id(commission.getId())
                .affiliateId(commission.getAffiliate().getId())
                .affiliateName(commission.getAffiliate().getName())
                .referralId(commission.getReferralId())
                .amount(commission.getAmount())
                .percentage(commission.getPercentage())
                .currency(commission.getCurrency())
                .status(commission.getStatus())
                .type(commission.getType())
                .description(commission.getDescription())
                .earnedAt(commission.getEarnedAt())
                .paidAt(commission.getPaidAt())
                .createdAt(commission.getCreatedAt())
                .updatedAt(commission.getUpdatedAt())
                .build();
    }

    public Commission toEntity(CommissionCreateRequest createRequest) {
        if (createRequest == null) {
            return null;
        }

        return Commission.builder()
                .referralId(createRequest.getReferralId())
                .amount(createRequest.getAmount())
                .percentage(createRequest.getPercentage())
                .currency(createRequest.getCurrency())
                .type(createRequest.getType())
                .description(createRequest.getDescription())
                .build();
    }

    public void updateEntityFromRequest(CommissionUpdateRequest updateRequest, Commission commission) {
        if (updateRequest == null || commission == null) {
            return;
        }

        if (updateRequest.getAmount() != null) {
            commission.setAmount(updateRequest.getAmount());
        }

        if (updateRequest.getPercentage() != null) {
            commission.setPercentage(updateRequest.getPercentage());
        }

        if (updateRequest.getCurrency() != null) {
            commission.setCurrency(updateRequest.getCurrency());
        }

        if (updateRequest.getType() != null) {
            commission.setType(updateRequest.getType());
        }

        if (updateRequest.getDescription() != null) {
            commission.setDescription(updateRequest.getDescription());
        }

        if (updateRequest.getStatus() != null) {
            commission.setStatus(updateRequest.getStatus());
        }
    }
}