'use client';

import React, { useEffect, useState } from 'react';
import { MedicalSidebar } from "@/components/medical-sidebar";
import { PartnersMainContent } from "@/src/app/partners/partnersMainContent";
import { useRouter } from 'next/navigation';
import Header from "@/src/headers/header";


interface FilterState {
  partnerName: string
  email: string
  status: string
  commissionStart: string
  commissionEnd: string
}

interface Affiliate {
  id: number;
  name: string;
  email: string;
  signupDate: string;
  status: string;
  revenue: number;
  earnings: number;
  clicks: number;
  leads: number;
  customers: number;
}

interface StatusCounts {
  active: number;
  pending: number;
  invited: number;
  inactive: number;
  rejected: number;
  total: number;
}

interface AffiliateTableResponse {
  affiliates: Affiliate[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  statusCounts: StatusCounts;
}

export default function PartnersPage() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [statusCounts, setStatusCounts] = useState<StatusCounts | null>(null);

  const clientId = 1;
  const router = useRouter();

  const [filters, setFilters] = useState<FilterState>({
    partnerName: "",
    email: "",
    status: "",
    commissionStart: "",
    commissionEnd: ""
  })

  useEffect(() => {
    fetchAffiliates();
  }, [currentPage, pageSize, statusFilter]);

  const fetchAffiliates = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        clientId: clientId.toString(),
        page: currentPage.toString(),
        size: pageSize.toString(),
        sort: 'signupDate,desc'
      });

      if (statusFilter !== 'ALL') {
        params.append('status', statusFilter);
      }

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const url = `http://localhost:8080/api/v1/affiliates/table?${params}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch affiliates: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.affiliates) {
        setAffiliates(data.affiliates || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
        setStatusCounts(data.statusCounts || null);
      } else if (Array.isArray(data)) {
        setAffiliates(data);
        setTotalPages(1);
        setTotalElements(data.length);
      } else {
        console.error('Unexpected response format:', data);
        setAffiliates([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (err) {
      console.error('Error fetching affiliates:', err);

      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        console.error('Possible CORS issue. Make sure your backend allows requests from http://localhost:3000');
        setError('Cannot connect to backend. Check if the backend is running and CORS is configured.');
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(0)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(0);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.includes('@')) {
      handleFilterChange('email', query)
    } else {
      handleFilterChange('partnerName', query)
    }
  }

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(0);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(0);
  };

  const handleAddPartner = () => {
    router.push('/partners/add');
  };

  return (
      <div className="flex h-screen bg-background">
        <MedicalSidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
              searchQuery={searchQuery}
              filters={filters}
              onSearchChange={handleSearch}
              onFilterChange={handleFilterChange}
          />
          <main>
            <PartnersMainContent
                affiliates={affiliates}
                loading={loading}
                error={error}
                searchQuery={searchQuery}
                statusFilter={statusFilter}
                currentPage={currentPage}
                totalPages={totalPages}
                totalElements={totalElements}
                pageSize={pageSize}
                statusCounts={statusCounts}
                onSearchChange={handleSearchChange}
                onStatusFilterChange={handleStatusFilterChange}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                onRetry={fetchAffiliates}
                onAddPartner={handleAddPartner}
            />
          </main>
        </div>
      </div>
  );
}