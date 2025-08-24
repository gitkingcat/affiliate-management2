package com.saas.AffiliateManagement.exceptions;

public class AffiliateNotFoundException extends RuntimeException {

    public AffiliateNotFoundException(String message) {
        super(message);
    }

    public AffiliateNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}