import React, { useState } from 'react';
import { Plus, Copy, CheckCircle, AlertCircle, Clock, Settings, Trash2, Globe, Shield, X } from 'lucide-react';

interface Domain {
    id: string;
    name: string;
    type: 'Portal Domain' | 'Tracking Domain';
    status: 'Pending' | 'Verified' | 'Error';
    sslEnabled: boolean;
    isPrimary: boolean;
    createdAt: string;
}

const CustomDomains = () => {
    const [domains, setDomains] = useState<Domain[]>([
        {
            id: '1',
            name: 'partners.mybrand.com',
            type: 'Portal Domain',
            status: 'Verified',
            sslEnabled: true,
            isPrimary: true,
            createdAt: '2025-01-15'
        },
        {
            id: '2',
            name: 'track.mybrand.com',
            type: 'Tracking Domain',
            status: 'Pending',
            sslEnabled: true,
            isPrimary: false,
            createdAt: '2025-01-20'
        },
        {
            id: '3',
            name: 'affiliate.oldbrand.com',
            type: 'Portal Domain',
            status: 'Error',
            sslEnabled: false,
            isPrimary: false,
            createdAt: '2025-01-10'
        }
    ]);

    const [formData, setFormData] = useState({
        domain: '',
        type: 'Portal Domain' as 'Portal Domain' | 'Tracking Domain',
        sslEnabled: true
    });

    const [showDnsInstructions, setShowDnsInstructions] = useState(false);
    const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [copiedRecord, setCopiedRecord] = useState<string | null>(null);

    const dnsRecords = [
        {
            type: 'CNAME',
            name: formData.domain || 'your-domain.com',
            value: 'cname.affiliateflow.com',
            description: 'Points your domain to our servers'
        },
        {
            type: 'TXT',
            name: '_affiliateflow-challenge',
            value: 'af-verify-abc123def456ghi789',
            description: 'Verifies domain ownership'
        }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.domain) return;

        const newDomain: Domain = {
            id: Date.now().toString(),
            name: formData.domain,
            type: formData.type,
            status: 'Pending',
            sslEnabled: formData.sslEnabled,
            isPrimary: false,
            createdAt: new Date().toISOString().split('T')[0]
        };

        setDomains(prev => [...prev, newDomain]);
        setShowDnsInstructions(true);
        setFormData({ domain: '', type: 'Portal Domain', sslEnabled: true });
    };

    const copyToClipboard = (text: string, recordType: string) => {
        navigator.clipboard.writeText(text);
        setCopiedRecord(recordType);
        setTimeout(() => setCopiedRecord(null), 2000);
    };

    const handleSetPrimary = (domainId: string) => {
        setDomains(prev => prev.map(domain => ({
            ...domain,
            isPrimary: domain.id === domainId
        })));
    };

    const handleDelete = () => {
        if (selectedDomain) {
            setDomains(prev => prev.filter(domain => domain.id !== selectedDomain.id));
            setShowDeleteModal(false);
            setSelectedDomain(null);
        }
    };

    const handleEdit = () => {
        if (selectedDomain) {
            setDomains(prev => prev.map(domain =>
                domain.id === selectedDomain.id ? selectedDomain : domain
            ));
            setShowEditModal(false);
            setSelectedDomain(null);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Verified':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'Pending':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'Error':
                return <AlertCircle className="w-4 h-4 text-red-500" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Verified':
                return 'bg-green-100 text-green-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Error':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div>
                <p className="text-gray-600 mt-2">Configure custom domains for your affiliate portal and tracking links</p>
            </div>

            {/* Domain Setup Form */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Domain</h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Custom Domain
                        </label>
                        <input
                            type="text"
                            value={formData.domain}
                            onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
                            placeholder="affiliate.mybrand.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Domain Type
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                type: e.target.value as 'Portal Domain' | 'Tracking Domain'
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="Portal Domain">Portal Domain</option>
                            <option value="Tracking Domain">Tracking Domain</option>
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="ssl"
                            checked={formData.sslEnabled}
                            onChange={(e) => setFormData(prev => ({ ...prev, sslEnabled: e.target.checked }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="ssl" className="text-sm font-medium text-gray-700">
                            Enable SSL
                        </label>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!formData.domain}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium flex items-center justify-center space-x-2 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Domain</span>
                    </button>
                </div>
            </div>

            {/* DNS Instructions Panel */}
            {showDnsInstructions && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-blue-900">DNS Configuration Required</h3>
                            <p className="text-blue-700 text-sm">Add these DNS records to your domain provider to verify ownership</p>
                        </div>
                        <button
                            onClick={() => setShowDnsInstructions(false)}
                            className="text-blue-400 hover:text-blue-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {dnsRecords.map((record) => (
                            <div key={record.type} className="bg-white rounded-md p-4 border">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                    <span className="inline-block bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
                      {record.type}
                    </span>
                                        <p className="text-sm text-gray-600 mt-1">{record.description}</p>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(record.value, record.type)}
                                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        {copiedRecord === record.type ? (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                <span>Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4" />
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            Name/Host
                                        </label>
                                        <code className="block text-sm bg-gray-50 p-2 rounded border font-mono">
                                            {record.name}
                                        </code>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            Value
                                        </label>
                                        <code className="block text-sm bg-gray-50 p-2 rounded border font-mono">
                                            {record.value}
                                        </code>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-800">
                            <strong>Note:</strong> DNS propagation can take up to 24 hours. We'll automatically verify your domain once the records are detected.
                        </p>
                    </div>
                </div>
            )}

            {/* Domain List Table */}
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Configured Domains</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Domain Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                SSL
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {domains.map((domain) => (
                            <tr key={domain.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <Globe className="w-4 h-4 text-gray-400 mr-2" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 flex items-center">
                                                {domain.name}
                                                {domain.isPrimary && (
                                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              Primary
                            </span>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-500">Added {domain.createdAt}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-gray-900">{domain.type}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {getStatusIcon(domain.status)}
                                        <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(domain.status)}`}>
                        {domain.status}
                      </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {domain.sslEnabled ? (
                                            <>
                                                <Shield className="w-4 h-4 text-green-500 mr-1" />
                                                <span className="text-sm text-green-600">Enabled</span>
                                            </>
                                        ) : (
                                            <span className="text-sm text-gray-500">Disabled</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    {!domain.isPrimary && domain.status === 'Verified' && (
                                        <button
                                            onClick={() => handleSetPrimary(domain.id)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            Set Primary
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            setSelectedDomain(domain);
                                            setShowEditModal(true);
                                        }}
                                        className="text-gray-600 hover:text-gray-900"
                                    >
                                        <Settings className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedDomain(domain);
                                            setShowDeleteModal(true);
                                        }}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && selectedDomain && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Domain</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Domain Name
                                </label>
                                <input
                                    type="text"
                                    value={selectedDomain.name}
                                    onChange={(e) => setSelectedDomain(prev => prev ? {...prev, name: e.target.value} : null)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Type
                                </label>
                                <select
                                    value={selectedDomain.type}
                                    onChange={(e) => setSelectedDomain(prev => prev ? {
                                        ...prev,
                                        type: e.target.value as 'Portal Domain' | 'Tracking Domain'
                                    } : null)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="Portal Domain">Portal Domain</option>
                                    <option value="Tracking Domain">Tracking Domain</option>
                                </select>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="edit-ssl"
                                    checked={selectedDomain.sslEnabled}
                                    onChange={(e) => setSelectedDomain(prev => prev ? {...prev, sslEnabled: e.target.checked} : null)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="edit-ssl" className="ml-2 text-sm text-gray-700">
                                    Enable SSL
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEdit}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedDomain && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Domain</h3>

                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete <strong>{selectedDomain.name}</strong>? This action cannot be undone.
                        </p>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Delete Domain
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomDomains;