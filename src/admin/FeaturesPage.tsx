import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Button } from '../../components/UI';
import { Plus, Trash2, Edit2, Save, X, Zap, GripVertical } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface Feature {
    id: string;
    title: string;
    description: string;
    icon: string;
    sort_order: number;
    is_visible: boolean;
}

const iconOptions = ['Globe', 'Download', 'Monitor', 'Shield', 'Zap', 'Cloud', 'Lock', 'Server', 'Cpu', 'Database'];

const FeaturesPage: React.FC = () => {
    const [features, setFeatures] = useState<Feature[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState<Partial<Feature> | null>(null);

    const emptyFeature: Partial<Feature> = {
        title: '',
        description: '',
        icon: 'Globe',
        sort_order: 0,
        is_visible: true,
    };

    useEffect(() => {
        fetchFeatures();
    }, []);

    const fetchFeatures = async () => {
        setLoading(true);
        const { data } = await supabase.from('features').select('*').order('sort_order', { ascending: true });
        setFeatures(data || []);
        setLoading(false);
    };

    const handleSave = async () => {
        if (!editing?.title || !editing?.description) {
            alert('Please fill in all fields');
            return;
        }

        let error;
        if (editing.id) {
            const result = await supabase.from('features').update(editing).eq('id', editing.id);
            error = result.error;
        } else {
            const newOrder = features.length + 1;
            const result = await supabase.from('features').insert([{ ...editing, sort_order: newOrder }]);
            error = result.error;
        }

        if (error) {
            alert('Error: ' + error.message);
        } else {
            setIsModalOpen(false);
            setEditing(null);
            fetchFeatures();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this feature?')) return;
        await supabase.from('features').delete().eq('id', id);
        fetchFeatures();
    };

    const toggleVisibility = async (f: Feature) => {
        await supabase.from('features').update({ is_visible: !f.is_visible }).eq('id', f.id);
        fetchFeatures();
    };

    const getIcon = (iconName: string) => {
        const IconComponent = (LucideIcons as any)[iconName];
        return IconComponent ? <IconComponent size={24} /> : <Zap size={24} />;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Features</h1>
                    <p className="text-gray-400">Manage homepage features section</p>
                </div>
                <Button onClick={() => { setEditing({ ...emptyFeature }); setIsModalOpen(true); }}>
                    <Plus size={18} className="mr-2" /> Add Feature
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin w-8 h-8 border-2 border-cyber-primary border-t-transparent rounded-full" />
                </div>
            ) : features.length === 0 ? (
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center">
                    <Zap size={48} className="mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-400">No features yet</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {features.map((f, index) => (
                        <div
                            key={f.id}
                            className={`bg-cyber-card border rounded-xl p-4 flex items-center gap-4 ${f.is_visible ? 'border-white/5' : 'border-red-500/30 opacity-60'}`}
                        >
                            <div className="text-gray-600 cursor-grab">
                                <GripVertical size={20} />
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyber-primary/20 to-cyber-accent/20 flex items-center justify-center text-cyber-neon">
                                {getIcon(f.icon)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-white">{f.title}</h3>
                                <p className="text-sm text-gray-400 truncate">{f.description}</p>
                            </div>
                            <button
                                onClick={() => toggleVisibility(f)}
                                className={`text-xs px-2 py-1 rounded ${f.is_visible ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                            >
                                {f.is_visible ? 'Visible' : 'Hidden'}
                            </button>
                            <button
                                onClick={() => { setEditing(f); setIsModalOpen(true); }}
                                className="p-2 text-gray-400 hover:text-white"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button onClick={() => handleDelete(f.id)} className="p-2 text-red-400 hover:text-red-300">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && editing && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-cyber-card border border-white/10 rounded-2xl w-full max-w-lg">
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">{editing.id ? 'Edit' : 'New'} Feature</h2>
                            <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-gray-400 hover:text-white" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Title *</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white"
                                    value={editing.title || ''}
                                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Description *</label>
                                <textarea
                                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white h-20"
                                    value={editing.description || ''}
                                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Icon</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {iconOptions.map((icon) => (
                                        <button
                                            key={icon}
                                            onClick={() => setEditing({ ...editing, icon })}
                                            className={`p-3 rounded-lg border ${editing.icon === icon ? 'border-cyber-primary bg-cyber-primary/20 text-cyber-neon' : 'border-white/10 text-gray-400 hover:text-white'}`}
                                        >
                                            {getIcon(icon)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-white/10">
                            <Button className="w-full" onClick={handleSave}><Save size={18} className="mr-2" /> Save</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeaturesPage;
