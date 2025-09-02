import React, { useState } from 'react';
import { Save, Info, AlertCircle } from 'lucide-react';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

const MarketingAndTracking = () => {
    const [settings, setSettings] = useState({
        cookieDuration: '60',
        autoApproveCommissions: true,
        urlParameters: 'ref, via, aff',
        blockSameEmailReferrals: false,
        blockSocialMediaReferrals: false,
        allowPartnerSubdomainTracking: false,
        programWideCouponCode: '',
        hidePartnerLinks: false
    });

    const [toasts, setToasts] = useState<Toast[]>([]);
    const [hasChanges, setHasChanges] = useState(false);

    const addToast = (message: string, type: Toast['type'] = 'success') => {
        const id = Date.now().toString();
        const newToast = { id, message, type };
        setToasts(prev => [...prev, newToast]);

        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 3000);
    };

    const handleSettingChange = (key: string, value: string | boolean) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
        setHasChanges(true);
    };

    const handleSave = () => {
        // Simulate saving settings
        addToast('Marketing and tracking settings saved successfully');
        setHasChanges(false);
    };

    const handleReset = () => {
        setSettings({
            cookieDuration: '60',
            autoApproveCommissions: true,
            urlParameters: 'ref, via, aff',
            blockSameEmailReferrals: false,
            blockSocialMediaReferrals: false,
            allowPartnerSubdomainTracking: false,
            programWideCouponCode: '',
            hidePartnerLinks: false
        });
        setHasChanges(false);
        addToast('Settings reset to defaults', 'info');
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Marketing and tracking options</h1>
                <p className="text-gray-600">Configure how your affiliate program tracks referrals and manages partner marketing activities</p>
            </div>

            {/* Main Settings Form */}
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 space-y-8">
                    {/* Cookie Duration */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-900">
                            Cookie duration
                        </label>
                        <div className="flex items-center space-x-3">
                            <input
                                type="number"
                                value={settings.cookieDuration}
                                onChange={(e) => handleSettingChange('cookieDuration', e.target.value)}
                                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min="1"
                                max="365"
                            />
                            <span className="text-sm text-gray-600">days</span>
                        </div>
                        <p className="text-xs text-gray-500">How long the referral tracking cookie will last on the customer's browser</p>
                    </div>

                    {/* Auto-approve commissions */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-900">
                            Auto-approve commissions
                        </label>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => handleSettingChange('autoApproveCommissions', true)}
                                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                                    settings.autoApproveCommissions
                                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => handleSettingChange('autoApproveCommissions', false)}
                                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                                    !settings.autoApproveCommissions
                                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                No
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">Automatically approve commissions when sales are completed</p>
                    </div>

                    {/* URL parameters */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-900">
                            URL parameters
                        </label>
                        <input
                            type="text"
                            value={settings.urlParameters}
                            onChange={(e) => handleSettingChange('urlParameters', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="ref, via, aff"
                        />
                        <p className="text-xs text-gray-500">Comma-separated list of URL parameters that will trigger affiliate tracking</p>
                    </div>

                    {/* Block same email referrals */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-900">
                            Block same email referrals (self-referrals)
                        </label>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => handleSettingChange('blockSameEmailReferrals', true)}
                                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                                    settings.blockSameEmailReferrals
                                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => handleSettingChange('blockSameEmailReferrals', false)}
                                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                                    !settings.blockSameEmailReferrals
                                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                No
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">Prevent partners from earning commissions when they refer themselves</p>
                    </div>

                    {/* Block referrals from social media */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-900">
                            Block referrals from social media
                        </label>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => handleSettingChange('blockSocialMediaReferrals', true)}
                                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                                    settings.blockSocialMediaReferrals
                                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => handleSettingChange('blockSocialMediaReferrals', false)}
                                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                                    !settings.blockSocialMediaReferrals
                                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                No
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">Block tracking from social media platforms like Facebook, Twitter, Instagram</p>
                    </div>

                    {/* Allow partners to submit leads manually */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-900">
                            Allow partners to submit leads manually
                        </label>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => handleSettingChange('allowPartnerSubdomainTracking', true)}
                                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                                    settings.allowPartnerSubdomainTracking
                                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => handleSettingChange('allowPartnerSubdomainTracking', false)}
                                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                                    !settings.allowPartnerSubdomainTracking
                                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                No
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">Allow partners to manually submit leads that may not be tracked automatically</p>
                    </div>

                    {/* Program wide coupon code */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-900">
                            Program wide coupon code
                        </label>
                        <div className="flex items-center space-x-3">
                            <input
                                type="text"
                                value={settings.programWideCouponCode}
                                onChange={(e) => handleSettingChange('programWideCouponCode', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter coupon code"
                            />
                            <span className="text-sm text-gray-500">
                {settings.programWideCouponCode ? `${settings.programWideCouponCode}` : 'None | 0%'}
              </span>
                        </div>
                        <p className="text-xs text-gray-500">A universal coupon code that all partners can promote</p>
                    </div>

                    {/* Hide partner links */}
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <label className="block text-sm font-medium text-gray-900">
                                Hide partner links
                            </label>
                            <button className="text-blue-600 hover:text-blue-800">
                                <span className="text-xs underline">Learn more</span>
                            </button>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => handleSettingChange('hidePartnerLinks', true)}
                                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                                    settings.hidePartnerLinks
                                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => handleSettingChange('hidePartnerLinks', false)}
                                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                                    !settings.hidePartnerLinks
                                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                No
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">Hide referral parameters from the URL to make links appear cleaner</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {hasChanges && (
                                <div className="flex items-center text-sm text-amber-600">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    <span>You have unsaved changes</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleReset}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Reset to Defaults
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!hasChanges}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium flex items-center space-x-2 transition-colors"
                            >
                                <Save className="w-4 h-4" />
                                <span>Save Settings</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Information Panel */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <h3 className="text-sm font-medium text-blue-900 mb-1">Important Notes</h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Cookie duration changes will only affect new visitors</li>
                            <li>• URL parameter changes may require updating existing partner links</li>
                            <li>• Social media blocking uses referrer detection and may not catch all cases</li>
                        </ul>
                    </div>
                </div>
            </div>

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
                            <span>{toast.message}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MarketingAndTracking;