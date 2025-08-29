package com.saas.AffiliateManagement.models.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulkActionResponseDto {
    private Integer totalProcessed;
    private Integer successful;
    private Integer failed;
    private List<Long> successfulIds;
    private Map<Long, String> failedIds;
    private String action;
    private Long executionTimeMs;
}