package com.saas.AffiliateManagement.controller;

import com.saas.AffiliateManagement.exceptions.ClientNotFoundException;
import com.saas.AffiliateManagement.exceptions.InvalidClientDataException;
import com.saas.AffiliateManagement.models.requests.ClientCreateRequest;
import com.saas.AffiliateManagement.models.dto.ClientDto;
import com.saas.AffiliateManagement.models.requests.ClientUpdateRequest;
import com.saas.AffiliateManagement.service.ClientService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST Controller for managing Client entities.
 * Handles HTTP requests for client registration, management,
 * and SaaS tenant operations.
 *
 * @author Vladislavs Kraslavskis
 * @version 1.0
 */
@RestController
@RequestMapping("/api/v1/clients")
@Validated
@CrossOrigin(origins = "*", maxAge = 3600)
public class ClientController {

    private final ClientService clientService;

    /**
     * Constructor for dependency injection.
     *
     * @param clientService the client service to handle business logic
     */
    @Autowired
    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    /**
     * Registers a new client for the SaaS platform.
     * Public endpoint for client self-registration.
     *
     * @param createRequest the client registration request
     * @return ResponseEntity containing the created client DTO
     * @throws InvalidClientDataException if the provided data is invalid
     */
    @PostMapping("/register")
    public ResponseEntity<ClientDto> registerClient(
            @Valid @RequestBody ClientCreateRequest createRequest) {

        ClientDto registeredClient = clientService
                .registerClient(createRequest);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(registeredClient);
    }

    /**
     * Creates a new client (admin-only operation).
     * Requires administrative privileges.
     *
     * @param createRequest the client creation request
     * @return ResponseEntity containing the created client DTO
     * @throws InvalidClientDataException if the provided data is invalid
     */
    @PostMapping
    public ResponseEntity<ClientDto> createClient(
            @Valid @RequestBody ClientCreateRequest createRequest) {

        ClientDto createdClient = clientService
                .createClient(createRequest);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(createdClient);
    }

    /**
     * Retrieves a client by their unique identifier.
     *
     * @param clientId the unique identifier of the client
     * @return ResponseEntity containing the client DTO if found
     * @throws ClientNotFoundException if no client exists with the given ID
     */
    @GetMapping("/{clientId}")
    public ResponseEntity<ClientDto> getClientById(
            @PathVariable @Min(1) Long clientId) {

        ClientDto client = clientService.getClientById(clientId);
        return ResponseEntity.ok(client);
    }

    /**
     * Retrieves all clients with optional pagination.
     * Requires super admin privileges.
     *
     * @param pageable pagination information
     * @return ResponseEntity containing a page of client DTOs
     */
    @GetMapping
    public ResponseEntity<Page<ClientDto>> getAllClients(
            Pageable pageable) {

        Page<ClientDto> clients = clientService.getAllClients(pageable);
        return ResponseEntity.ok(clients);
    }

    /**
     * Updates an existing client.
     *
     * @param clientId the unique identifier of the client to update
     * @param updateRequest the client update request containing new data
     * @return ResponseEntity containing the updated client DTO
     * @throws ClientNotFoundException if no client exists with the given ID
     * @throws InvalidClientDataException if the provided data is invalid
     */
    @PutMapping("/{clientId}")
    public ResponseEntity<ClientDto> updateClient(
            @PathVariable @Min(1) Long clientId,
            @Valid @RequestBody ClientUpdateRequest updateRequest) {

        ClientDto updatedClient = clientService
                .updateClient(clientId, updateRequest);

        return ResponseEntity.ok(updatedClient);
    }

    /**
     * Activates a client account.
     * Requires super admin privileges.
     *
     * @param clientId the unique identifier of the client to activate
     * @return ResponseEntity containing the updated client DTO
     * @throws ClientNotFoundException if no client exists with the given ID
     */
    @PatchMapping("/{clientId}/activate")
    public ResponseEntity<ClientDto> activateClient(
            @PathVariable @Min(1) Long clientId) {

        ClientDto activatedClient = clientService
                .activateClient(clientId);

        return ResponseEntity.ok(activatedClient);
    }

    /**
     * Deactivates a client account.
     * Requires super admin privileges.
     *
     * @param clientId the unique identifier of the client to deactivate
     * @return ResponseEntity containing the updated client DTO
     * @throws ClientNotFoundException if no client exists with the given ID
     */
    @PatchMapping("/{clientId}/deactivate")
    public ResponseEntity<ClientDto> deactivateClient(
            @PathVariable @Min(1) Long clientId) {

        ClientDto deactivatedClient = clientService
                .deactivateClient(clientId);

        return ResponseEntity.ok(deactivatedClient);
    }

    /**
     * Suspends a client account.
     * Requires super admin privileges.
     *
     * @param clientId the unique identifier of the client to suspend
     * @param reason the reason for suspension
     * @return ResponseEntity containing the updated client DTO
     * @throws ClientNotFoundException if no client exists with the given ID
     */
    @PatchMapping("/{clientId}/suspend")
    public ResponseEntity<ClientDto> suspendClient(
            @PathVariable @Min(1) Long clientId,
            @RequestParam String reason) {

        ClientDto suspendedClient = clientService
                .suspendClient(clientId, reason);

        return ResponseEntity.ok(suspendedClient);
    }

    /**
     * Searches for clients based on various criteria.
     * Requires super admin privileges.
     *
     * @param companyName optional company name filter
     * @param status optional status filter
     * @param subscriptionPlan optional subscription plan filter
     * @param pageable pagination information
     * @return ResponseEntity containing a page of matching client DTOs
     */
    @GetMapping("/search")
    public ResponseEntity<Page<ClientDto>> searchClients(
            @RequestParam Optional<String> companyName,
            @RequestParam Optional<String> status,
            @RequestParam Optional<String> subscriptionPlan,
            Pageable pageable) {

        Page<ClientDto> searchResults = clientService
                .searchClients(companyName, status, subscriptionPlan, pageable);

        return ResponseEntity.ok(searchResults);
    }

    /**
     * Retrieves clients by subscription plan.
     * Requires super admin privileges.
     *
     * @param subscriptionPlan the subscription plan to filter by
     * @param pageable pagination information
     * @return ResponseEntity containing a page of client DTOs
     */
    @GetMapping("/subscription/{subscriptionPlan}")
    public ResponseEntity<Page<ClientDto>> getClientsBySubscriptionPlan(
            @PathVariable String subscriptionPlan,
            Pageable pageable) {

        Page<ClientDto> clients = clientService
                .getClientsBySubscriptionPlan(subscriptionPlan, pageable);

        return ResponseEntity.ok(clients);
    }

    /**
     * Retrieves active clients.
     * Requires super admin privileges.
     *
     * @param pageable pagination information
     * @return ResponseEntity containing a page of active client DTOs
     */
    @GetMapping("/active")
    public ResponseEntity<Page<ClientDto>> getActiveClients(
            Pageable pageable) {

        Page<ClientDto> activeClients = clientService
                .getActiveClients(pageable);

        return ResponseEntity.ok(activeClients);
    }

    /**
     * Upgrades a client's subscription plan.
     *
     * @param clientId the unique identifier of the client
     * @param newPlan the new subscription plan
     * @return ResponseEntity containing the updated client DTO
     * @throws ClientNotFoundException if no client exists with the given ID
     */
    @PatchMapping("/{clientId}/upgrade")
    public ResponseEntity<ClientDto> upgradeSubscription(
            @PathVariable @Min(1) Long clientId,
            @RequestParam String newPlan) {

        ClientDto upgradedClient = clientService
                .upgradeSubscription(clientId, newPlan);

        return ResponseEntity.ok(upgradedClient);
    }

    /**
     * Downgrades a client's subscription plan.
     *
     * @param clientId the unique identifier of the client
     * @param newPlan the new subscription plan
     * @return ResponseEntity containing the updated client DTO
     * @throws ClientNotFoundException if no client exists with the given ID
     */
    @PatchMapping("/{clientId}/downgrade")
    public ResponseEntity<ClientDto> downgradeSubscription(
            @PathVariable @Min(1) Long clientId,
            @RequestParam String newPlan) {

        ClientDto downgradedClient = clientService
                .downgradeSubscription(clientId, newPlan);

        return ResponseEntity.ok(downgradedClient);
    }

    /**
     * Deletes a client account.
     * Requires super admin privileges.
     *
     * @param clientId the unique identifier of the client to delete
     * @return ResponseEntity with no content
     * @throws ClientNotFoundException if no client exists with the given ID
     */
    @DeleteMapping("/{clientId}")
    public ResponseEntity<Void> deleteClient(
            @PathVariable @Min(1) Long clientId) {

        clientService.deleteClient(clientId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Verifies client email address.
     *
     * @param clientId the unique identifier of the client
     * @param verificationToken the email verification token
     * @return ResponseEntity containing the updated client DTO
     * @throws ClientNotFoundException if no client exists with the given ID
     */
    @PatchMapping("/{clientId}/verify-email")
    public ResponseEntity<ClientDto> verifyEmail(
            @PathVariable @Min(1) Long clientId,
            @RequestParam String verificationToken) {

        ClientDto verifiedClient = clientService
                .verifyEmail(clientId, verificationToken);

        return ResponseEntity.ok(verifiedClient);
    }

    /**
     * Generates API keys for a client.
     *
     * @param clientId the unique identifier of the client
     * @return ResponseEntity containing the generated API keys
     * @throws ClientNotFoundException if no client exists with the given ID
     */
    @PostMapping("/{clientId}/generate-api-keys")
    public ResponseEntity<List<String>> generateApiKeys(
            @PathVariable @Min(1) Long clientId) {

        List<String> apiKeys = clientService.generateApiKeys(clientId);
        return ResponseEntity.ok(apiKeys);
    }

    /**
     * Regenerates API keys for a client.
     *
     * @param clientId the unique identifier of the client
     * @return ResponseEntity containing the new API keys
     * @throws ClientNotFoundException if no client exists with the given ID
     */
    @PostMapping("/{clientId}/regenerate-api-keys")
    public ResponseEntity<List<String>> regenerateApiKeys(
            @PathVariable @Min(1) Long clientId) {

        List<String> newApiKeys = clientService.regenerateApiKeys(clientId);
        return ResponseEntity.ok(newApiKeys);
    }
}