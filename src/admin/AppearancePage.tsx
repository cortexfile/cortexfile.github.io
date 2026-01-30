import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Button } from '../../components/UI';
import { Save, Upload, Image as ImageIcon, RefreshCw } from 'lucide-react';

interface SiteSettings {
    id: string;
    site_name: string;
    logo_url: string;
    primary_color: string;
    accent_color: string;
    hero_title: string;
    hero_subtitle: string;
    hero_image: string;
    hero_button_text: string;
    footer_text: string;
    particle_color?: string;
    particle_speed?: number;
    particle_density?: number;
}

const AppearancePage: React.FC = () => {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('site_settings').select('*').limit(1).single();
        if (error) {
            console.error('Error fetching settings:', error);
            // Create default settings if none exist
            const { data: newData } = await supabase.from('site_settings').insert([{ site_name: 'CortexFile' }]).select().single();
            setSettings(newData);
        } else {
            setSettings(data);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!settings) return;
        setSaving(true);
        const { error } = await supabase.from('site_settings').update(settings).eq('id', settings.id);
        if (error) {
            alert('Error saving: ' + error.message);
        } else {
            alert('Settings saved successfully!');
        }
        setSaving(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo_url' | 'hero_image') => {
        if (!e.target.files?.length || !settings) return;
        setUploading(true);
        try {
            const file = e.target.files[0];
            const fileName = `${field}_${Date.now()}.${file.name.split('.').pop()}`;
            const { error } = await supabase.storage.from('product-files').upload(fileName, file);
            if (error) throw error;
            const { data } = supabase.storage.from('product-files').getPublicUrl(fileName);
            setSettings({ ...settings, [field]: data.publicUrl });
        } catch (err: any) {
            alert('Upload failed: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    const updateField = (field: keyof SiteSettings, value: string | number) => {
        if (settings) {
            setSettings({ ...settings, [field]: value });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-2 border-cyber-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!settings) {
        return <div className="text-center text-gray-400">Error loading settings</div>;
    }

    return (
        <div className="space-y-8 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Appearance</h1>
                    <p className="text-gray-400">Customize your store's look and feel</p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? <RefreshCw className="animate-spin mr-2" size={18} /> : <Save size={18} className="mr-2" />}
                    Save Changes
                </Button>
            </div>

            {/* Branding Section */}
            <div className="bg-cyber-card border border-white/5 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Branding</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Site Name</label>
                        <input
                            type="text"
                            className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none"
                            value={settings.site_name}
                            onChange={(e) => updateField('site_name', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Logo</label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="text"
                                placeholder="Logo URL"
                                className="flex-1 bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none"
                                value={settings.logo_url || ''}
                                onChange={(e) => updateField('logo_url', e.target.value)}
                            />
                            <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg flex items-center gap-2 transition-colors">
                                <Upload size={16} />
                                {uploading ? '...' : 'Upload'}
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'logo_url')} />
                            </label>
                        </div>
                        {settings.logo_url && <img src={settings.logo_url} alt="Logo" className="h-12 mt-2" />}
                    </div>
                </div>
            </div>

            {/* Colors Section */}
            <div className="bg-cyber-card border border-white/5 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Colors</h2>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Primary Color</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border border-white/10"
                                value={settings.primary_color}
                                onChange={(e) => updateField('primary_color', e.target.value)}
                            />
                            <input
                                type="text"
                                className="flex-1 bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none font-mono"
                                value={settings.primary_color}
                                onChange={(e) => updateField('primary_color', e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Accent Color</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border border-white/10"
                                value={settings.accent_color}
                                onChange={(e) => updateField('accent_color', e.target.value)}
                            />
                            <input
                                type="text"
                                className="flex-1 bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none font-mono"
                                value={settings.accent_color}
                                onChange={(e) => updateField('accent_color', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-cyber-card border border-white/5 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Hero Section</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Title</label>
                        <input
                            type="text"
                            className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none"
                            value={settings.hero_title}
                            onChange={(e) => updateField('hero_title', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Subtitle</label>
                        <textarea
                            className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none h-20"
                            value={settings.hero_subtitle}
                            onChange={(e) => updateField('hero_subtitle', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Button Text</label>
                        <input
                            type="text"
                            className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none"
                            value={settings.hero_button_text}
                            onChange={(e) => updateField('hero_button_text', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Hero Image</label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="text"
                                placeholder="Image URL"
                                className="flex-1 bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none"
                                value={settings.hero_image || ''}
                                onChange={(e) => updateField('hero_image', e.target.value)}
                            />
                            <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg flex items-center gap-2 transition-colors">
                                <ImageIcon size={16} />
                                Upload
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'hero_image')} />
                            </label>
                        </div>
                        {settings.hero_image && (
                            <img src={settings.hero_image} alt="Hero Preview" className="w-full max-w-md h-40 object-cover mt-2 rounded-lg border border-white/10" />
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <div className="bg-cyber-card border border-white/5 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Footer</h2>

                <div>
                    <label className="block text-sm text-gray-400 mb-1">Footer Text</label>
                    <input
                        type="text"
                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none"
                        value={settings.footer_text}
                        onChange={(e) => updateField('footer_text', e.target.value)}
                    />
                </div>
            </div>

            {/* Particle Settings Section */}
            <div className="bg-cyber-card border border-white/5 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Particle Background</h2>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Particle Color</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border border-white/10"
                                value={settings.particle_color || '#6366f1'}
                                onChange={(e) => updateField('particle_color', e.target.value)}
                            />
                            <input
                                type="text"
                                className="flex-1 bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none font-mono"
                                value={settings.particle_color || '#6366f1'}
                                onChange={(e) => updateField('particle_color', e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Animation Speed ({settings.particle_speed || 1.0}x)</label>
                        <input
                            type="range"
                            min="0.1"
                            max="5.0"
                            step="0.1"
                            className="w-full"
                            value={settings.particle_speed || 1.0}
                            onChange={(e) => updateField('particle_speed', parseFloat(e.target.value))}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Density ({settings.particle_density || 80} particles)</label>
                        <input
                            type="range"
                            min="20"
                            max="200"
                            step="10"
                            className="w-full"
                            value={settings.particle_density || 80}
                            onChange={(e) => updateField('particle_density', parseInt(e.target.value))}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppearancePage;
