import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, Users, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, X, Check, AlertTriangle } from 'lucide-react';

interface Partner {
    id: string;
    name: string;
    email: string;
    status: 'Active' | 'Inactive';
}

interface Group {
    id: string;
    name: string;
    description: string;
    partnerCount: number;
    createdAt: string;
    partners: Partner[];
}

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

const PartnerGroups = () => {
    const [groups, setGroups] = useState<Group[]>([
        {
            id: '1',
            name: 'Premium Partners',
            description: 'High-value partners with special commission rates',
            partnerCount: 15,
            createdAt: '2025-01-10',
            partners: [
                { id: '1', name: 'John Smith', email: 'john@example.com', status: 'Active' },
                { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', status: 'Active' },
                { id: '3', name: 'Mike Wilson', email: 'mike@example.com', status: 'Inactive' }
            ]
        },
        {
            id: '2',
            name: 'New Partners',
            description: 'Recently onboarded partners in trial period',
            partnerCount: 8,
            createdAt: '2025-01-15',
            partners: [
                { id: '4', name: 'Emily Davis', email: 'emily@example.com', status: 'Active' },
                { id: '5', name: 'David Brown', email: 'david@example.com', status: 'Active' }
            ]
        },
        {
            id: '3',
            name: 'Enterprise Partners',
            description: 'Large-scale enterprise affiliate partners',
            partnerCount: 5,
            createdAt: '2025-01-05',
            partners: [
                { id: '6', name: 'Alex Thompson', email: 'alex@enterprise.com', status: 'Active' }
            ]
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<'name' | 'createdAt'>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showMembersModal, setShowMembersModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [toasts, setToasts] = useState<Toast[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const itemsPerPage = 5;

    // Filter and sort groups
    const filteredGroups = useMemo(() => {
        let filtered = groups.filter(group =>
            group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            group.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filtered.sort((a, b) => {
            const aValue = sortField === 'name' ? a.name : a.createdAt;
            const bValue = sortField === 'name' ? b.name : b.createdAt;

            if (sortDirection === 'asc') {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        });

        return filtered;
    }, [groups, searchTerm, sortField, sortDirection]);

    // Pagination
    const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
    const paginatedGroups = filteredGroups.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const addToast = (message: string, type: Toast['type'] = 'success') => {
        const id = Date.now().toString();
        const newToast = { id, message, type };
        setToasts(prev => [...prev, newToast]);

        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 3000);
    };

    const handleSort = (field: 'name' | 'createdAt') => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleSelectGroup = (groupId: string) => {
        setSelectedGroups(prev =>
            prev.includes(groupId)
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
        );
    };

    const handleSelectAll = () => {
        if (selectedGroups.length === paginatedGroups.length) {
            setSelectedGroups([]);
        } else {
            setSelectedGroups(paginatedGroups.map(group => group.id));
        }
    };

    const handleAddGroup = () => {
        if (!formData.name.trim()) {
            addToast('Group name is required', 'error');
            return;
        }

        const newGroup: Group = {
            id: Date.now().toString(),
            name: formData.name.trim(),
            description: formData.description.trim(),
            partnerCount: 0,
            createdAt: new Date().toISOString().split('T')[0],
            partners: []
        };

        setGroups(prev => [...prev, newGroup]);
        setFormData({ name: '', description: '' });
        setShowAddModal(false);
        addToast('Group created successfully');
    };

    const handleEditGroup = () => {
        if (!selectedGroup || !formData.name.trim()) {
            addToast('Group name is required', 'error');
            return;
        }

        setGroups(prev => prev.map(group =>
            group.id === selectedGroup.id
                ? {
                    ...group,
                    name: formData.name.trim(),
                    description: formData.description.trim()
                }
                : group
        ));

        setFormData({ name: '', description: '' });
        setShowEditModal(false);
        setSelectedGroup(null);
        addToast('Group updated successfully');
    };

    const handleDeleteGroups = () => {
        const groupsToDelete = selectedGroup ? [selectedGroup.id] : selectedGroups;
        setGroups(prev => prev.filter(group => !groupsToDelete.includes(group.id)));

        const message = groupsToDelete.length === 1
            ? 'Group deleted successfully'
            : `${groupsToDelete.length} groups deleted successfully`;

        addToast(message);
        setSelectedGroups([]);
        setShowDeleteModal(false);
        setSelectedGroup(null);
    };

    const openEditModal = (group: Group) => {
        setSelectedGroup(group);
        setFormData({ name: group.name, description: group.description });
        setShowEditModal(true);
    };

    const openMembersModal = (group: Group) => {
        setSelectedGroup(group);
        setShowMembersModal(true);
    };

    const openDeleteModal = (group?: Group) => {
        if (group) {
            setSelectedGroup(group);
        }
        setShowDeleteModal(true);
    };

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div>
                <p className="text-gray-600 mt-2">Organize your affiliate partners into groups for better management and targeted campaigns</p>
            </div>

            {/* Toolbar */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-3 flex-1">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center space-x-2 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Group</span>
                        </button>

                        {selectedGroups.length > 0 && (
                            <button
                                onClick={() => openDeleteModal()}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium flex items-center space-x-2 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete Selected ({selectedGroups.length})</span>
                            </button>
                        )}
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search groups..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Groups Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left">
                                <input
                                    type="checkbox"
                                    checked={selectedGroups.length === paginatedGroups.length && paginatedGroups.length > 0}
                                    onChange={handleSelectAll}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <button
                                    onClick={() => handleSort('name')}
                                    className="flex items-center space-x-1 hover:text-gray-700"
                                >
                                    <span>Group Name</span>
                                    {sortField === 'name' && (
                                        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                                    )}
                                </button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Partners
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <button
                                    onClick={() => handleSort('createdAt')}
                                    className="flex items-center space-x-1 hover:text-gray-700"
                                >
                                    <span>Created Date</span>
                                    {sortField === 'createdAt' && (
                                        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                                    )}
                                </button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedGroups.map((group) => (
                            <tr key={group.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                        type="checkbox"
                                        checked={selectedGroups.includes(group.id)}
                                        onChange={() => handleSelectGroup(group.id)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{group.name}</div>
                                        {group.description && (
                                            <div className="text-sm text-gray-500">{group.description}</div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center text-sm text-gray-900">
                                        <Users className="w-4 h-4 text-gray-400 mr-1" />
                                        {group.partnerCount}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {new Date(group.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => openMembersModal(group)}
                                            className="text-blue-600 hover:text-blue-900"
                                            title="View Members"
                                        >
                                            <Users className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => openEditModal(group)}
                                            className="text-gray-600 hover:text-gray-900"
                                            title="Edit Group"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(group)}
                                            className="text-red-600 hover:text-red-900"
                                            title="Delete Group"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-700">
                <span>
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredGroups.length)} of {filteredGroups.length} results
                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>

                                <div className="flex space-x-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-1 text-sm rounded ${
                                                currentPage === page
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Group Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Group</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Group Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter group name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Optional description"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setFormData({ name: '', description: '' });
                                }}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddGroup}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Add Group
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Group Modal */}
            {showEditModal && selectedGroup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Group</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Group Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedGroup(null);
                                    setFormData({ name: '', description: '' });
                                }}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditGroup}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Members Modal */}
            {showMembersModal && selectedGroup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Members in "{selectedGroup.name}"
                            </h3>
                            <button
                                onClick={() => {
                                    setShowMembersModal(false);
                                    setSelectedGroup(null);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {selectedGroup.partners.length > 0 ? (
                                <div className="space-y-2">
                                    {selectedGroup.partners.map((partner) => (
                                        <div key={partner.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                                            <div>
                                                <div className="font-medium text-gray-900">{partner.name}</div>
                                                <div className="text-sm text-gray-500">{partner.email}</div>
                                            </div>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                                partner.status === 'Active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                        {partner.status}
                      </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <p>No partners in this group yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="flex items-center mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
                            <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
                        </div>

                        <p className="text-gray-600 mb-6">
                            {selectedGroup
                                ? `Are you sure you want to delete "${selectedGroup.name}"? This action cannot be undone.`
                                : `Are you sure you want to delete ${selectedGroups.length} selected groups? This action cannot be undone.`
                            }
                        </p>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedGroup(null);
                                }}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteGroups}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notifications */}
            {toasts.length > 0 && (
                <div className="fixed top-4 right-4 z-50 space-y-2">
                    {toasts.map((toast) => (
                        <div
                            key={toast.id}
                            className={`flex items-center p-4 rounded-md shadow-lg ${
                                toast.type === 'success'
                                    ? 'bg-green-50 text-green-800 border border-green-200'
                                    : toast.type === 'error'
                                        ? 'bg-red-50 text-red-800 border border-red-200'
                                        : 'bg-blue-50 text-blue-800 border border-blue-200'
                            }`}
                        >
                            {toast.type === 'success' && <Check className="w-5 h-5 mr-2" />}
                            {toast.type === 'error' && <AlertTriangle className="w-5 h-5 mr-2" />}
                            <span>{toast.message}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PartnerGroups;