// CommissionCreateRequest.java
package com.saas.AffiliateManagement.models.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommissionCreateRequest {

    @NotNull(message = "Affiliate ID is required")
    private Long affiliateId;

    @NotNull(message = "Referral ID is required")
    private Long referralId;

    @NotNull(message = "Commission amount is required")
    @DecimalMin(value = "0.01", message = "Commission amount must be greater than zero")
    private BigDecimal amount;

    @DecimalMin(value = "0.0", message = "Commission percentage cannot be negative")
    private BigDecimal percentage;

    @Size(max = 3, message = "Currency code cannot exceed 3 characters")
    private String currency;

    @Size(max = 50, message = "Commission type cannot exceed 50 characters")
    private String type;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;
}