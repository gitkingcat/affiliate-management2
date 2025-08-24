package com.saas.AffiliateManagement.service;

import com.saas.AffiliateManagement.exceptions.ClientNotFoundException;
import com.saas.AffiliateManagement.exceptions.InvalidClientDataException;
import com.saas.AffiliateManagement.models.entity.Client;
import com.saas.AffiliateManagement.models.requests.ClientCreateRequest;
import com.saas.AffiliateManagement.models.dto.ClientDto;
import com.saas.AffiliateManagement.models.requests.ClientUpdateRequest;
import com.saas.AffiliateManagement.repository.ClientRepository;
import com.saas.AffiliateManagement.service.mappers.ClientMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ClientService {

    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;
    private final EmailService emailService;
    private final ApiKeyService apiKeyService;

    @Transactional
    public ClientDto registerClient(ClientCreateRequest createRequest) {
        validateCreateRequest(createRequest);

        if (clientRepository.existsByEmail(createRequest.getEmail())) {
            throw new InvalidClientDataException("Client with email already exists: " + createRequest.getEmail());
        }

        if (clientRepository.existsByCompanyName(createRequest.getCompanyName())) {
            throw new InvalidClientDataException("Client with company name already exists: " + createRequest.getCompanyName());
        }

        Client client = clientMapper.toEntity(createRequest);
        client.setStatus("PENDING_VERIFICATION");
        client.setSubscriptionPlan("FREE");
        client.setEmailVerified(false);
        client.setCreatedAt(LocalDateTime.now());
        client.setUpdatedAt(LocalDateTime.now());
        client.setEmailVerificationToken(generateVerificationToken());

        Client savedClient = clientRepository.save(client);
        log.info("Registered new client with ID: {} and company: {}",
                savedClient.getId(), savedClient.getCompanyName());

        emailService.sendVerificationEmail(savedClient.getEmail(),
                savedClient.getEmailVerificationToken());

        return clientMapper.toDto(savedClient);
    }

    @Transactional
    public ClientDto createClient(ClientCreateRequest createRequest) {
        validateCreateRequest(createRequest);

        if (clientRepository.existsByEmail(createRequest.getEmail())) {
            throw new InvalidClientDataException("Client with email already exists: " + createRequest.getEmail());
        }

        if (clientRepository.existsByCompanyName(createRequest.getCompanyName())) {
            throw new InvalidClientDataException("Client with company name already exists: " + createRequest.getCompanyName());
        }

        Client client = clientMapper.toEntity(createRequest);
        client.setStatus("ACTIVE");
        client.setEmailVerified(true);
        client.setCreatedAt(LocalDateTime.now());
        client.setUpdatedAt(LocalDateTime.now());

        Client savedClient = clientRepository.save(client);
        log.info("Created new client with ID: {} by admin", savedClient.getId());

        return clientMapper.toDto(savedClient);
    }

    public ClientDto getClientById(Long clientId) {
        Client client = findClientById(clientId);
        return clientMapper.toDto(client);
    }

    public Page<ClientDto> getAllClients(Pageable pageable) {
        Page<Client> clientsPage = clientRepository.findAll(pageable);
        return clientsPage.map(clientMapper::toDto);
    }

    @Transactional
    public ClientDto updateClient(Long clientId, ClientUpdateRequest updateRequest) {
        validateUpdateRequest(updateRequest);

        Client existingClient = findClientById(clientId);

        if (!existingClient.getEmail().equals(updateRequest.getEmail())
                && clientRepository.existsByEmail(updateRequest.getEmail())) {
            throw new InvalidClientDataException("Email already exists: " + updateRequest.getEmail());
        }

        if (!existingClient.getCompanyName().equals(updateRequest.getCompanyName())
                && clientRepository.existsByCompanyName(updateRequest.getCompanyName())) {
            throw new InvalidClientDataException("Company name already exists: " + updateRequest.getCompanyName());
        }

        clientMapper.updateEntityFromRequest(updateRequest, existingClient);
        existingClient.setUpdatedAt(LocalDateTime.now());

        if (!existingClient.getEmail().equals(updateRequest.getEmail())) {
            existingClient.setEmailVerified(false);
            existingClient.setEmailVerificationToken(generateVerificationToken());
            emailService.sendVerificationEmail(updateRequest.getEmail(),
                    existingClient.getEmailVerificationToken());
        }

        Client updatedClient = clientRepository.save(existingClient);
        log.info("Updated client with ID: {}", clientId);

        return clientMapper.toDto(updatedClient);
    }

    @Transactional
    public ClientDto activateClient(Long clientId) {
        Client client = findClientById(clientId);

        if ("ACTIVE".equals(client.getStatus())) {
            throw new InvalidClientDataException("Client is already active");
        }

        client.setStatus("ACTIVE");
        client.setUpdatedAt(LocalDateTime.now());

        Client activatedClient = clientRepository.save(client);
        log.info("Activated client with ID: {}", clientId);

        emailService.sendActivationNotification(client.getEmail());

        return clientMapper.toDto(activatedClient);
    }

    @Transactional
    public ClientDto deactivateClient(Long clientId) {
        Client client = findClientById(clientId);

        if ("INACTIVE".equals(client.getStatus())) {
            throw new InvalidClientDataException("Client is already inactive");
        }

        client.setStatus("INACTIVE");
        client.setUpdatedAt(LocalDateTime.now());

        Client deactivatedClient = clientRepository.save(client);
        log.info("Deactivated client with ID: {}", clientId);

        return clientMapper.toDto(deactivatedClient);
    }

    @Transactional
    public ClientDto suspendClient(Long clientId, String reason) {
        Client client = findClientById(clientId);

        if ("SUSPENDED".equals(client.getStatus())) {
            throw new InvalidClientDataException("Client is already suspended");
        }

        client.setStatus("SUSPENDED");
        client.setSuspensionReason(reason);
        client.setSuspendedAt(LocalDateTime.now());
        client.setUpdatedAt(LocalDateTime.now());

        Client suspendedClient = clientRepository.save(client);
        log.info("Suspended client with ID: {} for reason: {}", clientId, reason);

        emailService.sendSuspensionNotification(client.getEmail(), reason);

        return clientMapper.toDto(suspendedClient);
    }

    public Page<ClientDto> searchClients(Optional<String> companyName,
                                         Optional<String> status,
                                         Optional<String> subscriptionPlan,
                                         Pageable pageable) {
        Page<Client> clientsPage = clientRepository
                .findByCompanyNameContainingIgnoreCaseAndStatusContainingIgnoreCaseAndSubscriptionPlanContainingIgnoreCase(
                        companyName.orElse(""),
                        status.orElse(""),
                        subscriptionPlan.orElse(""),
                        pageable);

        return clientsPage.map(clientMapper::toDto);
    }

    public Page<ClientDto> getClientsBySubscriptionPlan(String subscriptionPlan, Pageable pageable) {
        Page<Client> clientsPage = clientRepository.findBySubscriptionPlan(subscriptionPlan, pageable);
        return clientsPage.map(clientMapper::toDto);
    }

    public Page<ClientDto> getActiveClients(Pageable pageable) {
        Page<Client> activeClients = clientRepository.findByStatus("ACTIVE", pageable);
        return activeClients.map(clientMapper::toDto);
    }

    @Transactional
    public ClientDto upgradeSubscription(Long clientId, String newPlan) {
        Client client = findClientById(clientId);

        validateSubscriptionPlan(newPlan);

        if (!isUpgrade(client.getSubscriptionPlan(), newPlan)) {
            throw new InvalidClientDataException("New plan is not an upgrade from current plan");
        }

        String oldPlan = client.getSubscriptionPlan();
        client.setSubscriptionPlan(newPlan);
        client.setSubscriptionUpgradedAt(LocalDateTime.now());
        client.setUpdatedAt(LocalDateTime.now());

        Client upgradedClient = clientRepository.save(client);
        log.info("Upgraded client {} subscription from {} to {}", clientId, oldPlan, newPlan);

        emailService.sendSubscriptionUpgradeNotification(client.getEmail(), oldPlan, newPlan);

        return clientMapper.toDto(upgradedClient);
    }

    @Transactional
    public ClientDto downgradeSubscription(Long clientId, String newPlan) {
        Client client = findClientById(clientId);

        validateSubscriptionPlan(newPlan);

        if (!isDowngrade(client.getSubscriptionPlan(), newPlan)) {
            throw new InvalidClientDataException("New plan is not a downgrade from current plan");
        }

        String oldPlan = client.getSubscriptionPlan();
        client.setSubscriptionPlan(newPlan);
        client.setUpdatedAt(LocalDateTime.now());

        Client downgradedClient = clientRepository.save(client);
        log.info("Downgraded client {} subscription from {} to {}", clientId, oldPlan, newPlan);

        emailService.sendSubscriptionDowngradeNotification(client.getEmail(), oldPlan, newPlan);

        return clientMapper.toDto(downgradedClient);
    }

    @Transactional
    public void deleteClient(Long clientId) {
        Client client = findClientById(clientId);

        if ("ACTIVE".equals(client.getStatus())) {
            throw new InvalidClientDataException("Cannot delete active client. Deactivate first.");
        }

        clientRepository.deleteById(clientId);
        log.info("Deleted client with ID: {}", clientId);

        emailService.sendAccountDeletionNotification(client.getEmail());
    }

    @Transactional
    public ClientDto verifyEmail(Long clientId, String verificationToken) {
        Client client = findClientById(clientId);

        if (client.getEmailVerified()) {
            throw new InvalidClientDataException("Email is already verified");
        }

        if (!verificationToken.equals(client.getEmailVerificationToken())) {
            throw new InvalidClientDataException("Invalid verification token");
        }

        client.setEmailVerified(true);
        client.setEmailVerificationToken(null);
        client.setEmailVerifiedAt(LocalDateTime.now());
        client.setUpdatedAt(LocalDateTime.now());

        if ("PENDING_VERIFICATION".equals(client.getStatus())) {
            client.setStatus("ACTIVE");
        }

        Client verifiedClient = clientRepository.save(client);
        log.info("Verified email for client with ID: {}", clientId);

        return clientMapper.toDto(verifiedClient);
    }

    @Transactional
    public List<String> generateApiKeys(Long clientId) {
        Client client = findClientById(clientId);

        if (!"ACTIVE".equals(client.getStatus())) {
            throw new InvalidClientDataException("Cannot generate API keys for inactive client");
        }

        List<String> apiKeys = apiKeyService.generateApiKeys(clientId);
        log.info("Generated {} API keys for client: {}", apiKeys.size(), clientId);

        return apiKeys;
    }

    @Transactional
    public List<String> regenerateApiKeys(Long clientId) {
        Client client = findClientById(clientId);

        if (!"ACTIVE".equals(client.getStatus())) {
            throw new InvalidClientDataException("Cannot regenerate API keys for inactive client");
        }

        apiKeyService.revokeExistingKeys(clientId);
        List<String> newApiKeys = apiKeyService.generateApiKeys(clientId);

        log.info("Regenerated {} API keys for client: {}", newApiKeys.size(), clientId);

        return newApiKeys;
    }

    public boolean isClientOwner(Long clientId, String email) {
        return clientRepository.findById(clientId)
                .map(client -> client.getEmail().equals(email))
                .orElse(false);
    }

    public boolean existsByEmail(String email) {
        return clientRepository.existsByEmail(email);
    }

    public boolean existsByCompanyName(String companyName) {
        return clientRepository.existsByCompanyName(companyName);
    }

    public Optional<ClientDto> getClientByEmail(String email) {
        return clientRepository.findByEmail(email)
                .map(clientMapper::toDto);
    }

    public long getTotalClientCount() {
        return clientRepository.count();
    }

    public long getActiveClientCount() {
        return clientRepository.countByStatus("ACTIVE");
    }

    private Client findClientById(Long clientId) {
        return clientRepository.findById(clientId)
                .orElseThrow(() -> new ClientNotFoundException("Client not found with ID: " + clientId));
    }

    private void validateCreateRequest(ClientCreateRequest createRequest) {
        if (createRequest.getEmail() == null || createRequest.getEmail().trim().isEmpty()) {
            throw new InvalidClientDataException("Email is required");
        }

        if (createRequest.getCompanyName() == null || createRequest.getCompanyName().trim().isEmpty()) {
            throw new InvalidClientDataException("Company name is required");
        }

        if (createRequest.getContactFirstName() == null || createRequest.getContactFirstName().trim().isEmpty()) {
            throw new InvalidClientDataException("Contact first name is required");
        }

        if (createRequest.getContactLastName() == null || createRequest.getContactLastName().trim().isEmpty()) {
            throw new InvalidClientDataException("Contact last name is required");
        }
    }

    private void validateUpdateRequest(ClientUpdateRequest updateRequest) {
        if (updateRequest.getEmail() == null || updateRequest.getEmail().trim().isEmpty()) {
            throw new InvalidClientDataException("Email is required");
        }

        if (updateRequest.getCompanyName() == null || updateRequest.getCompanyName().trim().isEmpty()) {
            throw new InvalidClientDataException("Company name is required");
        }

        if (updateRequest.getContactFirstName() == null || updateRequest.getContactFirstName().trim().isEmpty()) {
            throw new InvalidClientDataException("Contact first name is required");
        }

        if (updateRequest.getContactLastName() == null || updateRequest.getContactLastName().trim().isEmpty()) {
            throw new InvalidClientDataException("Contact last name is required");
        }
    }

    private void validateSubscriptionPlan(String plan) {
        if (!List.of("FREE", "BASIC", "PROFESSIONAL", "ENTERPRISE").contains(plan)) {
            throw new InvalidClientDataException("Invalid subscription plan: " + plan);
        }
    }

    private boolean isUpgrade(String currentPlan, String newPlan) {
        List<String> planHierarchy = List.of("FREE", "BASIC", "PROFESSIONAL", "ENTERPRISE");
        int currentIndex = planHierarchy.indexOf(currentPlan);
        int newIndex = planHierarchy.indexOf(newPlan);
        return newIndex > currentIndex;
    }

    private boolean isDowngrade(String currentPlan, String newPlan) {
        List<String> planHierarchy = List.of("FREE", "BASIC", "PROFESSIONAL", "ENTERPRISE");
        int currentIndex = planHierarchy.indexOf(currentPlan);
        int newIndex = planHierarchy.indexOf(newPlan);
        return newIndex < currentIndex;
    }

    private String generateVerificationToken() {
        return UUID.randomUUID().toString();
    }
}