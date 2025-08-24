package com.saas.AffiliateManagement.service.mappers;

import com.saas.AffiliateManagement.models.entity.Affiliate;
import com.saas.AffiliateManagement.models.dto.AffiliateDto;
import com.saas.AffiliateManagement.models.requests.AffiliateCreateRequest;
import com.saas.AffiliateManagement.models.requests.AffiliateUpdateRequest;
import org.springframework.stereotype.Component;

@Component
public class AffiliateMapper {

    public AffiliateDto toDto(Affiliate affiliate) {
        if (affiliate == null) {
            return null;
        }

        return AffiliateDto.builder()
                .id(affiliate.getId())
                .clientId(affiliate.getClient().getId())
                .clientCompanyName(affiliate.getClient().getCompanyName())
                .email(affiliate.getEmail())
                .firstName(affiliate.getFirstName())
                .lastName(affiliate.getLastName())
                .companyName(affiliate.getCompanyName())
                .phoneNumber(affiliate.getPhoneNumber())
                .status(affiliate.getStatus())
                .paymentMethod(affiliate.getPaymentMethod())
                .paymentDetails(affiliate.getPaymentDetails())
                .website(affiliate.getWebsite())
                .socialMediaLinks(affiliate.getSocialMediaLinks())
                .notes(affiliate.getNotes())
                .referralCode(affiliate.getReferralCode())
                .rejectionReason(affiliate.getRejectionReason())
                .createdAt(affiliate.getCreatedAt())
                .updatedAt(affiliate.getUpdatedAt())
                .build();
    }

    public Affiliate toEntity(AffiliateCreateRequest createRequest) {
        if (createRequest == null) {
            return null;
        }

        return Affiliate.builder()
                .email(createRequest.getEmail())
                .firstName(createRequest.getFirstName())
                .lastName(createRequest.getLastName())
                .companyName(createRequest.getCompanyName())
                .phoneNumber(createRequest.getPhoneNumber())
                .paymentMethod(createRequest.getPaymentMethod())
                .paymentDetails(createRequest.getPaymentDetails())
                .website(createRequest.getWebsite())
                .socialMediaLinks(createRequest.getSocialMediaLinks())
                .notes(createRequest.getNotes())
                .build();
    }

    public void updateEntityFromRequest(AffiliateUpdateRequest updateRequest, Affiliate affiliate) {
        if (updateRequest == null || affiliate == null) {
            return;
        }

        affiliate.setEmail(updateRequest.getEmail());
        affiliate.setFirstName(updateRequest.getFirstName());
        affiliate.setLastName(updateRequest.getLastName());
        affiliate.setCompanyName(updateRequest.getCompanyName());
        affiliate.setPhoneNumber(updateRequest.getPhoneNumber());
        affiliate.setPaymentMethod(updateRequest.getPaymentMethod());
        affiliate.setPaymentDetails(updateRequest.getPaymentDetails());
        affiliate.setWebsite(updateRequest.getWebsite());
        affiliate.setSocialMediaLinks(updateRequest.getSocialMediaLinks());
        affiliate.setNotes(updateRequest.getNotes());
    }
}