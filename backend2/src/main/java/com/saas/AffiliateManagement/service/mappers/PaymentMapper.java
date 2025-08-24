// PaymentMapper.java
package com.saas.AffiliateManagement.service.mappers;

import com.saas.AffiliateManagement.models.dto.PaymentDto;
import com.saas.AffiliateManagement.models.entity.Payment;
import com.saas.AffiliateManagement.models.requests.PaymentCreateRequest;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    public PaymentDto toDto(Payment payment) {
        if (payment == null) {
            return null;
        }

        return PaymentDto.builder()
                .id(payment.getId())
                .affiliateId(payment.getAffiliate().getId())
                .affiliateName(payment.getAffiliate().getName())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .paymentMethod(payment.getPaymentMethod())
                .status(payment.getStatus())
                .transactionId(payment.getTransactionId())
                .description(payment.getDescription())
                .cancellationReason(payment.getCancellationReason())
                .processedAt(payment.getProcessedAt())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }

    public Payment toEntity(PaymentCreateRequest createRequest) {
        if (createRequest == null) {
            return null;
        }

        return Payment.builder()
                .amount(createRequest.getAmount())
                .currency(createRequest.getCurrency())
                .paymentMethod(createRequest.getPaymentMethod())
                .transactionId(createRequest.getTransactionId())
                .description(createRequest.getDescription())
                .build();
    }
}