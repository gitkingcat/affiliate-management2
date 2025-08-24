package com.saas.AffiliateManagement.exceptions;

public class InvalidReferralDataException extends RuntimeException {

    public InvalidReferralDataException(String message) {
        super(message);
    }

    public InvalidReferralDataException(String message, Throwable cause) {
        super(message, cause);
    }
}