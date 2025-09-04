import React, { useState } from 'react';
import { Settings, Upload } from 'lucide-react';

const PartnerExperience = () => {
    const [activeTab, setActiveTab] = useState('login');
    const [settings, setSettings] = useState<{
        backgroundColor: string;
        buttonColor: string;
        textColor: string;
        hideBranding: boolean;
        companyLogo: string | null;
    }>({
        backgroundColor: '#b1fe7a',
        buttonColor: '#b1fe7a',
        textColor: '#052d2b',
        hideBranding: false,
        companyLogo: null
    });
    const [email, setEmail] = useState('');

    const handleColorChange = (field: keyof typeof settings, color: string | boolean) => {
        setSettings(prev => ({
            ...prev,
            [field]: color
        }));
    };

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSettings(prev => ({
                    ...prev,
                    companyLogo: e.target?.result as string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Settings Panel */}
            <div className="w-80 bg-white shadow-lg p-6 border-r">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Customize Experience
                    </h2>
                </div>

                <div className="space-y-6">
                    {/* Background Color */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Background Color
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={settings.backgroundColor}
                                onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                                className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={settings.backgroundColor}
                                onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                        </div>
                    </div>

                    {/* Button Color */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Button Color
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={settings.buttonColor}
                                onChange={(e) => handleColorChange('buttonColor', e.target.value)}
                                className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={settings.buttonColor}
                                onChange={(e) => handleColorChange('buttonColor', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                        </div>
                    </div>

                    {/* Text Color */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Text Color
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={settings.textColor}
                                onChange={(e) => handleColorChange('textColor', e.target.value)}
                                className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={settings.textColor}
                                onChange={(e) => handleColorChange('textColor', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                        </div>
                    </div>

                    {/* Logo Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Logo
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="hidden"
                                id="logo-upload"
                            />
                            <label htmlFor="logo-upload" className="cursor-pointer">
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">Click to upload logo</p>
                                <p className="text-xs text-gray-400">PNG, JPG up to 2MB</p>
                            </label>
                        </div>
                    </div>

                    {/* Favicon Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Favicon
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="favicon-upload"
                            />
                            <label htmlFor="favicon-upload" className="cursor-pointer">
                                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                                <p className="text-xs text-gray-600">Upload favicon</p>
                            </label>
                        </div>
                    </div>

                    {/* Hide Branding Toggle */}
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">
                            Hide Branding
                        </label>
                        <button
                            onClick={() => handleColorChange('hideBranding', !settings.hideBranding)}
                            className={`relative w-11 h-6 rounded-full transition-colors ${
                                settings.hideBranding ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                        >
                            <div
                                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                                    settings.hideBranding ? 'translate-x-5' : 'translate-x-0.5'
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Preview Area */}
            <div className="flex-1 p-8">
                {/* Tab Navigation */}
                <div className="mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8">
                            <button
                                onClick={() => setActiveTab('login')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'login'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setActiveTab('dashboard')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'dashboard'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Dashboard
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Partner Experience Preview */}
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ minHeight: '600px' }}>
                        <div className="grid md:grid-cols-2 h-full">
                            {/* Left Section - Company Card */}
                            <div
                                className="relative p-12 flex flex-col justify-center"
                                style={{ backgroundColor: settings.backgroundColor }}
                            >
                                {/* Decorative circles */}
                                <div className="absolute top-8 left-8 w-16 h-16 rounded-full bg-white/20"></div>
                                <div className="absolute bottom-8 right-8 w-24 h-24 rounded-full bg-white/10"></div>
                                <div className="absolute top-24 right-12 w-8 h-8 rounded-full bg-white/30"></div>

                                <div className="relative z-10">
                                    {/* Company Logo */}
                                    <div className="mb-8">
                                        {settings.companyLogo ? (
                                            <img
                                                src={settings.companyLogo}
                                                alt="Company Logo"
                                                className="h-12 w-auto object-contain"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                                <span className="text-white font-bold text-xl">C</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-4">
                                        <p
                                            className="text-sm font-medium opacity-80"
                                            style={{ color: settings.textColor }}
                                        >
                                            Get to know us more.
                                        </p>
                                        <h1
                                            className="text-4xl font-bold leading-tight"
                                            style={{ color: settings.textColor }}
                                        >
                                            Demo Partner Program
                                        </h1>
                                        <p
                                            className="text-xl"
                                            style={{ color: settings.textColor }}
                                        >
                                            Earn 55% for every paid referral.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Section - Login Form */}
                            <div className="p-12 flex flex-col justify-center bg-white">
                                <div className="max-w-sm mx-auto w-full">
                                    <div className="mb-8">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                            Log in or Sign up
                                        </h2>
                                        <p className="text-gray-600">
                                            Please enter your email address to continue.
                                        </p>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="name@company.com"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            />
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                console.log('Continue clicked with email:', email);
                                            }}
                                            className="w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                                            style={{
                                                backgroundColor: settings.buttonColor,
                                                boxShadow: '0 4px 14px rgba(177, 254, 122, 0.3)'
                                            }}
                                            onMouseEnter={(e) => {
                                                const target = e.target as HTMLButtonElement;
                                                target.style.backgroundColor = settings.buttonColor;
                                                target.style.filter = 'brightness(0.95)';
                                            }}
                                            onMouseLeave={(e) => {
                                                const target = e.target as HTMLButtonElement;
                                                target.style.backgroundColor = settings.buttonColor;
                                                target.style.filter = 'brightness(1)';
                                            }}
                                        >
                                            Continue
                                        </button>
                                    </div>

                                    {/* Footer */}
                                    {!settings.hideBranding && (
                                        <div className="mt-8 text-center">
                                            <p className="text-sm text-gray-500">
                                                Powered by <span className="font-medium text-gray-700">Tolt</span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerExperience;