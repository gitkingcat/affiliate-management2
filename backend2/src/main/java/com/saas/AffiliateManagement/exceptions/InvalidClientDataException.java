package com.saas.AffiliateManagement.exceptions;

public class InvalidClientDataException extends RuntimeException {

    public InvalidClientDataException(String message) {
        super(message);
    }

    public InvalidClientDataException(String message, Throwable cause) {
        super(message, cause);
    }
}