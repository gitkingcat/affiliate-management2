package com.saas.AffiliateManagement.models.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatusCounts {
    private Long active;
    private Long pending;
    private Long invited;
    private Long inactive;
    private Long rejected;
    private Long total;
}