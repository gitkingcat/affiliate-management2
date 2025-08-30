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

export const customers: Customer[] = [
    {
        id: 1,
        createdAt: "February 28, 2025 12:00 AM",
        customerName: "Stanley Hudson",
        customerEmail: "stanley@email.com",
        partnerName: "Andy Bernard",
        partnerEmail: "andy@dundermifflin.com",
        totalPaid: 99.00,
        totalCommission: 54.45,
        status: "Active",
        signupDate: "2025-02-25",
        lastPurchase: "2025-02-28"
    },
    {
        id: 2,
        createdAt: "February 27, 2025 12:00 AM",
        customerName: "Pam Beesly",
        customerEmail: "pam@email.com",
        partnerName: "Jim Halpert",
        partnerEmail: "jim@dundermifflin.com",
        totalPaid: 199.00,
        totalCommission: 109.45,
        status: "Active",
        signupDate: "2025-02-24",
        lastPurchase: "2025-02-27"
    },
    {
        id: 3,
        createdAt: "February 26, 2025 12:00 AM",
        customerName: "Michael Scott",
        customerEmail: "michael@email.com",
        partnerName: "Dwight Schrute",
        partnerEmail: "dwight@dundermifflin.com",
        totalPaid: 299.00,
        totalCommission: 164.45,
        status: "Active",
        signupDate: "2025-02-23",
        lastPurchase: "2025-02-26"
    },
    {
        id: 4,
        createdAt: "February 25, 2025 12:00 AM",
        customerName: "Angela Martin",
        customerEmail: "angela@email.com",
        partnerName: "Toby Flenderson",
        partnerEmail: "toby@dundermifflin.com",
        totalPaid: 0.00,
        totalCommission: 0.00,
        status: "Suspended"
    },
    {
        id: 5,
        createdAt: "February 1, 2025 12:00 AM",
        customerName: "Oscar Martinez",
        customerEmail: "oscar@email.com",
        partnerName: "Andy Bernard",
        partnerEmail: "andy@dundermifflin.com",
        totalPaid: 99.00,
        totalCommission: 54.45,
        status: "Active"
    }
]

export const commissions: Commission[] = [
    {
        id: 1,
        affiliateName: "Andy Bernard",
        affiliateEmail: "andy@dundermifflin.com",
        amount: 54.45,
        percentage: 55.0,
        currency: "USD",
        status: "PAID",
        type: "SALE",
        description: "Commission for REF-001",
        earnedAt: "2025-02-25T10:30:00",
        paidAt: "2025-02-28T14:00:00",
        referralId: "REF-001"
    },
    {
        id: 2,
        affiliateName: "Jim Halpert",
        affiliateEmail: "jim@dundermifflin.com",
        amount: 109.45,
        percentage: 55.0,
        currency: "USD",
        status: "PENDING",
        type: "SALE",
        description: "Commission for REF-002",
        earnedAt: "2025-02-24T11:15:00",
        paidAt: null,
        referralId: "REF-002"
    },
    {
        id: 3,
        affiliateName: "Kevin Malone",
        affiliateEmail: "kevin@dundermifflin.com",
        amount: 75.20,
        percentage: 50.0,
        currency: "USD",
        status: "PAID",
        type: "SUBSCRIPTION",
        description: "Commission for REF-003",
        earnedAt: "2025-02-23T09:45:00",
        paidAt: "2025-02-26T16:30:00",
        referralId: "REF-003"
    },
    {
        id: 4,
        affiliateName: "Dwight Schrute",
        affiliateEmail: "dwight@dundermifflin.com",
        amount: 164.45,
        percentage: 55.0,
        currency: "USD",
        status: "PAID",
        type: "SALE",
        description: "Commission for REF-004",
        earnedAt: "2025-02-23T13:20:00",
        paidAt: "2025-02-26T10:15:00",
        referralId: "REF-004"
    },
    {
        id: 5,
        affiliateName: "Creed Bratton",
        affiliateEmail: "creed@dundermifflin.com",
        amount: 89.75,
        percentage: 60.0,
        currency: "USD",
        status: "PENDING",
        type: "RENEWAL",
        description: "Commission for REF-005",
        earnedAt: "2025-02-21T16:45:00",
        paidAt: null,
        referralId: "REF-005"
    },
    {
        id: 6,
        affiliateName: "Toby Flenderson",
        affiliateEmail: "toby@dundermifflin.com",
        amount: 42.30,
        percentage: 45.0,
        currency: "USD",
        status: "PENDING",
        type: "LEAD",
        description: "Commission for REF-006",
        earnedAt: "2025-02-20T14:30:00",
        paidAt: null,
        referralId: "REF-006"
    },
    {
        id: 7,
        affiliateName: "Ryan Howard",
        affiliateEmail: "ryan@dundermifflin.com",
        amount: 125.80,
        percentage: 70.0,
        currency: "USD",
        status: "PAID",
        type: "SUBSCRIPTION",
        description: "Commission for REF-007",
        earnedAt: "2025-02-19T12:00:00",
        paidAt: "2025-02-24T09:30:00",
        referralId: "REF-007"
    }
]

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