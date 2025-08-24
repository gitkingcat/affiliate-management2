// InvalidCommissionDataException.java
package com.saas.AffiliateManagement.exceptions;

public class InvalidCommissionDataException extends RuntimeException {

    public InvalidCommissionDataException(String message) {
        super(message);
    }

    public InvalidCommissionDataException(String message, Throwable cause) {
        super(message, cause);
    }
}