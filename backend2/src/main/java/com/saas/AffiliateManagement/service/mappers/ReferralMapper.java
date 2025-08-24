package com.saas.AffiliateManagement.service.mappers;


import com.saas.AffiliateManagement.models.entity.Referral;
import com.saas.AffiliateManagement.models.requests.ReferralCreateRequest;
import com.saas.AffiliateManagement.models.dto.ReferralDto;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class ReferralMapper {

    public ReferralDto toDto(Referral referral) {
        if (referral == null) {
            return null;
        }

        return ReferralDto.builder()
                .id(referral.getId())
                .affiliateId(referral.getAffiliate().getId())
                .affiliateName(referral.getAffiliate().getName())
                .referralCode(referral.getReferralCode())
                .targetUrl(referral.getTargetUrl())
                .sourceUrl(referral.getSourceUrl())
                .status(referral.getStatus())
                .userAgent(referral.getUserAgent())
                .ipAddress(referral.getIpAddress())
                .deviceType(referral.getDeviceType())
                .browserName(referral.getBrowserName())
                .operatingSystem(referral.getOperatingSystem())
                .country(referral.getCountry())
                .city(referral.getCity())
                .conversionValue(referral.getConversionValue())
                .orderId(referral.getOrderId())
                .metadata(referral.getMetadata())
                .clickedAt(referral.getClickedAt())
                .convertedAt(referral.getConvertedAt())
                .createdAt(referral.getCreatedAt())
                .updatedAt(referral.getUpdatedAt())
                .build();
    }

    public Referral toEntity(ReferralCreateRequest createRequest) {
        if (createRequest == null) {
            return null;
        }

        return Referral.builder()
                .referralCode(createRequest.getReferralCode())
                .targetUrl(createRequest.getTargetUrl())
                .sourceUrl(createRequest.getSourceUrl())
                .metadata(createRequest.getMetadata())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }
}