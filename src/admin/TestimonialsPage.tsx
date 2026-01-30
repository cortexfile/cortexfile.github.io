import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Button } from '../../components/UI';
import { Plus, Trash2, Edit2, Save, X, Star, User } from 'lucide-react';

interface Testimonial {
    id: string;
    name: string;
    role: string;
    content: string;
    avatar: string;
    rating: number;
    is_visible: boolean;
}

const TestimonialsPage: React.FC = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);

    const emptyTestimonial: Partial<Testimonial> = {
        name: '',
        role: '',
        content: '',
        avatar: 'https://picsum.photos/100/100?random=' + Math.floor(Math.random() * 100),
        rating: 5,
        is_visible: true,
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        setLoading(true);
        const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
        setTestimonials(data || []);
        setLoading(false);
    };

    const handleSave = async () => {
        if (!editing?.name || !editing?.content) {
            alert('Please fill in name and content');
            return;
        }

        let error;
        if (editing.id) {
            const result = await supabase.from('testimonials').update(editing).eq('id', editing.id);
            error = result.error;
        } else {
            const result = await supabase.from('testimonials').insert([editing]);
            error = result.error;
        }

        if (error) {
            alert('Error: ' + error.message);
        } else {
            setIsModalOpen(false);
            setEditing(null);
            fetchTestimonials();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this testimonial?')) return;
        await supabase.from('testimonials').delete().eq('id', id);
        fetchTestimonials();
    };

    const toggleVisibility = async (t: Testimonial) => {
        await supabase.from('testimonials').update({ is_visible: !t.is_visible }).eq('id', t.id);
        fetchTestimonials();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Testimonials</h1>
                    <p className="text-gray-400">Manage customer reviews</p>
                </div>
                <Button onClick={() => { setEditing({ ...emptyTestimonial }); setIsModalOpen(true); }}>
                    <Plus size={18} className="mr-2" /> Add Testimonial
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin w-8 h-8 border-2 border-cyber-primary border-t-transparent rounded-full" />
                </div>
            ) : testimonials.length === 0 ? (
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center">
                    <User size={48} className="mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-400">No testimonials yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t) => (
                        <div
                            key={t.id}
                            className={`bg-cyber-card border rounded-2xl p-6 ${t.is_visible ? 'border-white/5' : 'border-red-500/30 opacity-60'}`}
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-white truncate">{t.name}</h3>
                                    <p className="text-sm text-cyber-primary">{t.role}</p>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => { setEditing(t); setIsModalOpen(true); }}
                                        className="p-1 text-gray-400 hover:text-white"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(t.id)} className="p-1 text-red-400 hover:text-red-300">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-gray-300 text-sm italic line-clamp-3">"{t.content}"</p>
                            <div className="flex items-center justify-between mt-4">
                                <div className="flex gap-0.5 text-yellow-400">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} size={14} fill={i <= t.rating ? 'currentColor' : 'none'} />
                                    ))}
                                </div>
                                <button
                                    onClick={() => toggleVisibility(t)}
                                    className={`text-xs px-2 py-1 rounded ${t.is_visible ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                                >
                                    {t.is_visible ? 'Visible' : 'Hidden'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && editing && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-cyber-card border border-white/10 rounded-2xl w-full max-w-lg">
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">{editing.id ? 'Edit' : 'New'} Testimonial</h2>
                            <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-gray-400 hover:text-white" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Name *</label>
                                    <input
                                        type="text"
                                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white"
                                        value={editing.name || ''}
                                        onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Role</label>
                                    <input
                                        type="text"
                                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white"
                                        value={editing.role || ''}
                                        onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Content *</label>
                                <textarea
                                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white h-24"
                                    value={editing.content || ''}
                                    onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Avatar URL</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white"
                                    value={editing.avatar || ''}
                                    onChange={(e) => setEditing({ ...editing, avatar: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <button
                                            key={i}
                                            onClick={() => setEditing({ ...editing, rating: i })}
                                            className={`p-2 rounded ${i <= (editing.rating || 5) ? 'text-yellow-400' : 'text-gray-600'}`}
                                        >
                                            <Star size={20} fill={i <= (editing.rating || 5) ? 'currentColor' : 'none'} />
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

export default TestimonialsPage;
