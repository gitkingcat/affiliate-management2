package com.saas.AffiliateManagement.exceptions;

public class ReferralNotFoundException extends RuntimeException {

    public ReferralNotFoundException(String message) {
        super(message);
    }

    public ReferralNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}