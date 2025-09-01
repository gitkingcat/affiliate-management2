// Mock data for Customers page tabs
// Path: frontend/src/data/customers-mock-data.ts

export interface Customer {
    id: number
    createdAt: string
    customerName: string
    customerEmail: string
    partnerName: string
    partnerEmail: string
    totalPaid: number
    totalCommission: number
    status: string
    signupDate?: string
    lastPurchase?: string
}

export interface Commission {
    id: number
    affiliateName: string
    affiliateEmail: string
    amount: number
    percentage: number
    currency: string
    status: 'PAID' | 'PENDING'
    type: 'SALE' | 'LEAD' | 'SUBSCRIPTION' | 'RENEWAL'
    description: string
    earnedAt: string
    paidAt: string | null
    referralId: string
}

export interface Transaction {
    id: number
    affiliateName: string
    affiliateEmail: string
    amount: number
    currency: string
    paymentMethod: string
    status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'PROCESSING'
    transactionId: string
    description: string
    processedAt: string | null
    createdAt: string
    cancellationReason?: string
}

export const transactions: Transaction[] = [
    {
        id: 1,
        affiliateName: "Andy Bernard",
        affiliateEmail: "andy@dundermifflin.com",
        amount: 54.45,
        currency: "USD",
        paymentMethod: "PayPal",
        status: "COMPLETED",
        transactionId: "TXN-001-2025",
        description: "Commission payment for February 2025",
        processedAt: "2025-02-28T14:00:00",
        createdAt: "2025-02-28T13:45:00"
    },
    {
        id: 2,
        affiliateName: "Kevin Malone",
        affiliateEmail: "kevin@dundermifflin.com",
        amount: 75.20,
        currency: "USD",
        paymentMethod: "Bank Transfer",
        status: "COMPLETED",
        transactionId: "TXN-002-2025",
        description: "Commission payment for February 2025",
        processedAt: "2025-02-26T16:30:00",
        createdAt: "2025-02-26T16:15:00"
    },
    {
        id: 3,
        affiliateName: "Jim Halpert",
        affiliateEmail: "jim@dundermifflin.com",
        amount: 109.45,
        currency: "USD",
        paymentMethod: "PayPal",
        status: "PENDING",
        transactionId: "TXN-003-2025",
        description: "Commission payment for February 2025",
        processedAt: null,
        createdAt: "2025-02-24T11:30:00"
    },
    {
        id: 4,
        affiliateName: "Dwight Schrute",
        affiliateEmail: "dwight@dundermifflin.com",
        amount: 164.45,
        currency: "USD",
        paymentMethod: "Bank Transfer",
        status: "COMPLETED",
        transactionId: "TXN-004-2025",
        description: "Commission payment for February 2025",
        processedAt: "2025-02-26T10:15:00",
        createdAt: "2025-02-26T10:00:00"
    },
    {
        id: 5,
        affiliateName: "Creed Bratton",
        affiliateEmail: "creed@dundermifflin.com",
        amount: 89.75,
        currency: "USD",
        paymentMethod: "PayPal",
        status: "PROCESSING",
        transactionId: "TXN-005-2025",
        description: "Commission payment for February 2025",
        processedAt: null,
        createdAt: "2025-02-21T16:45:00"
    },
    {
        id: 6,
        affiliateName: "Ryan Howard",
        affiliateEmail: "ryan@dundermifflin.com",
        amount: 125.80,
        currency: "USD",
        paymentMethod: "Stripe",
        status: "COMPLETED",
        transactionId: "TXN-006-2025",
        description: "Commission payment for February 2025",
        processedAt: "2025-02-24T09:30:00",
        createdAt: "2025-02-24T09:15:00"
    },
    {
        id: 7,
        affiliateName: "Toby Flenderson",
        affiliateEmail: "toby@dundermifflin.com",
        amount: 42.30,
        currency: "USD",
        paymentMethod: "Bank Transfer",
        status: "FAILED",
        transactionId: "TXN-007-2025",
        description: "Commission payment for February 2025",
        processedAt: "2025-02-20T14:30:00",
        createdAt: "2025-02-20T14:15:00",
        cancellationReason: "Insufficient bank account details"
    }
]