package com.saas.AffiliateManagement.service.mappers;

import com.saas.AffiliateManagement.models.entity.Client;
import com.saas.AffiliateManagement.models.requests.ClientCreateRequest;
import com.saas.AffiliateManagement.models.dto.ClientDto;
import com.saas.AffiliateManagement.models.requests.ClientUpdateRequest;
import org.springframework.stereotype.Component;

@Component
public class ClientMapper {

    public ClientDto toDto(Client client) {
        if (client == null) {
            return null;
        }

        return ClientDto.builder()
                .id(client.getId())
                .companyName(client.getCompanyName())
                .email(client.getEmail())
                .contactFirstName(client.getContactFirstName())
                .contactLastName(client.getContactLastName())
                .phoneNumber(client.getPhoneNumber())
                .website(client.getWebsite())
                .address(client.getAddress())
                .city(client.getCity())
                .country(client.getCountry())
                .postalCode(client.getPostalCode())
                .industry(client.getIndustry())
                .companySize(client.getCompanySize())
                .status(client.getStatus())
                .subscriptionPlan(client.getSubscriptionPlan())
                .businessDescription(client.getBusinessDescription())
                .notes(client.getNotes())
                .emailVerified(client.getEmailVerified())
                .suspensionReason(client.getSuspensionReason())
                .emailVerifiedAt(client.getEmailVerifiedAt())
                .subscriptionUpgradedAt(client.getSubscriptionUpgradedAt())
                .suspendedAt(client.getSuspendedAt())
                .createdAt(client.getCreatedAt())
                .updatedAt(client.getUpdatedAt())
                .build();
    }

    public Client toEntity(ClientCreateRequest createRequest) {
        if (createRequest == null) {
            return null;
        }

        return Client.builder()
                .companyName(createRequest.getCompanyName())
                .email(createRequest.getEmail())
                .contactFirstName(createRequest.getContactFirstName())
                .contactLastName(createRequest.getContactLastName())
                .phoneNumber(createRequest.getPhoneNumber())
                .website(createRequest.getWebsite())
                .address(createRequest.getAddress())
                .city(createRequest.getCity())
                .country(createRequest.getCountry())
                .postalCode(createRequest.getPostalCode())
                .industry(createRequest.getIndustry())
                .companySize(createRequest.getCompanySize())
                .subscriptionPlan(createRequest.getSubscriptionPlan())
                .businessDescription(createRequest.getBusinessDescription())
                .notes(createRequest.getNotes())
                .emailVerified(false)
                .build();
    }

    public void updateEntityFromRequest(ClientUpdateRequest updateRequest, Client client) {
        if (updateRequest == null || client == null) {
            return;
        }

        client.setCompanyName(updateRequest.getCompanyName());
        client.setEmail(updateRequest.getEmail());
        client.setContactFirstName(updateRequest.getContactFirstName());
        client.setContactLastName(updateRequest.getContactLastName());
        client.setPhoneNumber(updateRequest.getPhoneNumber());
        client.setWebsite(updateRequest.getWebsite());
        client.setAddress(updateRequest.getAddress());
        client.setCity(updateRequest.getCity());
        client.setCountry(updateRequest.getCountry());
        client.setPostalCode(updateRequest.getPostalCode());
        client.setIndustry(updateRequest.getIndustry());
        client.setCompanySize(updateRequest.getCompanySize());
        client.setBusinessDescription(updateRequest.getBusinessDescription());
        client.setNotes(updateRequest.getNotes());
    }
}