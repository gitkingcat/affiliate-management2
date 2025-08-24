// PaymentBatchRequest.java
package com.saas.AffiliateManagement.models.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentBatchRequest {

    @NotEmpty(message = "Payment list cannot be empty")
    @Size(max = 100, message = "Batch cannot contain more than 100 payments")
    @Valid
    private List<PaymentCreateRequest> payments;

    @Size(max = 500, message = "Batch description cannot exceed 500 characters")
    private String batchDescription;
}