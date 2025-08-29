package com.saas.AffiliateManagement.models.requests;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BulkActionRequest {

    @NotEmpty(message = "Affiliate IDs are required")
    private List<Long> affiliateIds;

    @NotNull(message = "Action is required")
    private BulkAction action;

    @NotNull(message = "Client ID is required")
    private Long clientId;

    private String reason;

    public enum BulkAction {
        ACTIVATE,
        DEACTIVATE,
        APPROVE,
        REJECT,
        DELETE,
        UPDATE_COMMISSION_RATE
    }
}
