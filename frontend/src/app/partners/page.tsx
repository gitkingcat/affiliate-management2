'use client';

import React, { useEffect, useState } from 'react';
import { MedicalSidebar } from "@/components/medical-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';
import Header from "@/src/headers/header";


import {
  Filter,
  Download,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Users, Plus, UserPlus
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("")
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

      // Handle the response with 'affiliates' array
      if (data.affiliates) {
        setAffiliates(data.affiliates || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
        setStatusCounts(data.statusCounts || null);
      } else if (Array.isArray(data)) {
        // Direct array response
        setAffiliates(data);
        setTotalPages(1);
        setTotalElements(data.length);
      } else {
        // Unexpected format
        console.error('Unexpected response format:', data);
        setAffiliates([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (err) {
      console.error('Error fetching affiliates:', err);

      // Check for CORS errors
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        console.error('Possible CORS issue. Make sure your backend allows requests from http://localhost:3000');
        setError('Cannot connect to backend. Check if the backend is running and CORS is configured.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load affiliates');
      }

      setAffiliates([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(0)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.includes('@')) {
      handleFilterChange('email', query)
    } else {
      handleFilterChange('partnerName', query)
    }
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800';
      case 'INVITED':
        return 'bg-blue-100 text-blue-800';
      case 'REJECTED':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
      <div className="flex h-screen bg-background">
        <MedicalSidebar/>

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
              searchQuery={searchQuery}
              filters={filters}
              onSearchChange={handleSearch}
              onFilterChange={handleFilterChange}
          />

          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
            <div className="container mx-auto px-6 py-8">

              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Partners</h1>

                <div className="flex gap-2">
                  <Button>
                    <Plus className="h-4 w-4 mr-2"/>
                    Create partner
                  </Button>
                  <Button variant="outline">
                    <UserPlus className="h-4 w-4 mr-2"/>
                    Invite partner
                  </Button>
                </div>
              </div>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Affiliate Partners</CardTitle>
                    <div className="flex items-center gap-2">
                      <Select
                          value={statusFilter}
                          onValueChange={(value) => {
                            setStatusFilter(value);
                            setCurrentPage(0);
                          }}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Filter by status"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">All Status</SelectItem>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="INVITED">Invited</SelectItem>
                          <SelectItem value="INACTIVE">Inactive</SelectItem>
                          <SelectItem value="SUSPENDED">Suspended</SelectItem>
                          <SelectItem value="REJECTED">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2"/>
                        More Filters
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2"/>
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {error && (
                      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">Error: {error}</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={fetchAffiliates}
                            className="mt-2"
                        >
                          Retry
                        </Button>
                      </div>
                  )}

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Revenue</TableHead>
                          <TableHead>Earnings</TableHead>
                          <TableHead>Clicks</TableHead>
                          <TableHead>Leads</TableHead>
                          <TableHead>Customers</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                            <TableRow>
                              <TableCell colSpan={10} className="text-center py-8">
                                <div className="flex items-center justify-center">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                              </TableCell>
                            </TableRow>
                        ) : !affiliates || affiliates.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={10} className="text-center py-8">
                                <div className="flex flex-col items-center">
                                  <Users className="w-12 h-12 text-muted-foreground mb-2"/>
                                  <p className="text-muted-foreground">No affiliates found</p>
                                </div>
                              </TableCell>
                            </TableRow>
                        ) : (
                            affiliates && affiliates.map((affiliate) => (
                                <TableRow key={affiliate.id}>
                                  <TableCell className="font-medium">
                                    {affiliate.name}
                                  </TableCell>
                                  <TableCell>{affiliate.email}</TableCell>
                                  <TableCell>
                                    <Badge className={getStatusColor(affiliate.status)}>
                                      {affiliate.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>{formatCurrency(affiliate.revenue)}</TableCell>
                                  <TableCell>{formatCurrency(affiliate.earnings)}</TableCell>
                                  <TableCell>{affiliate.clicks}</TableCell>
                                  <TableCell>{affiliate.leads}</TableCell>
                                  <TableCell>{affiliate.customers}</TableCell>
                                  <TableCell>{formatDate(affiliate.signupDate)}</TableCell>
                                  <TableCell>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                          <MoreHorizontal className="w-4 h-4"/>
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600">
                                          Suspend
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                            ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {totalPages > 1 && affiliates && affiliates.length > 0 && (
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-muted-foreground">
                          Showing {Math.min(currentPage * pageSize + 1, totalElements || 0)} to {Math.min((currentPage + 1) * pageSize, totalElements || 0)} of {totalElements || 0} results
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                              disabled={currentPage === 0}
                          >
                            <ChevronLeft className="w-4 h-4"/>
                            Previous
                          </Button>
                          <div className="flex items-center gap-1">
                            {Array.from({length: Math.min(5, totalPages)}, (_, i) => (
                                <Button
                                    key={i}
                                    variant={currentPage === i ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentPage(i)}
                                    className="w-8"
                                >
                                  {i + 1}
                                </Button>
                            ))}
                            {totalPages > 5 && <span className="px-2">...</span>}
                          </div>
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                              disabled={currentPage === totalPages - 1}
                          >
                            Next
                            <ChevronRight className="w-4 h-4"/>
                          </Button>
                        </div>
                      </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
  );
}