import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Button } from '../../components/UI';
import { Upload, Trash2, Copy, Check, Image as ImageIcon, File, Search } from 'lucide-react';

interface MediaFile {
    name: string;
    url: string;
    size: number;
    created_at: string;
    type: 'image' | 'file';
}

const MediaPage: React.FC = () => {
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        setLoading(true);
        const { data, error } = await supabase.storage.from('product-files').list('', {
            limit: 100,
            sortBy: { column: 'created_at', order: 'desc' },
        });

        if (data) {
            const mediaFiles: MediaFile[] = data
                .filter(f => f.name !== '.emptyFolderPlaceholder')
                .map(f => {
                    const { data: urlData } = supabase.storage.from('product-files').getPublicUrl(f.name);
                    const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f.name);
                    return {
                        name: f.name,
                        url: urlData.publicUrl,
                        size: f.metadata?.size || 0,
                        created_at: f.created_at || '',
                        type: isImage ? 'image' : 'file',
                    };
                });
            setFiles(mediaFiles);
        }
        setLoading(false);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setUploading(true);

        const uploadPromises = Array.from(e.target.files).map(async (file) => {
            const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
            await supabase.storage.from('product-files').upload(fileName, file);
        });

        await Promise.all(uploadPromises);
        setUploading(false);
        fetchFiles();
    };

    const handleDelete = async (name: string) => {
        if (!confirm('Delete this file?')) return;
        await supabase.storage.from('product-files').remove([name]);
        fetchFiles();
    };

    const copyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        setCopiedUrl(url);
        setTimeout(() => setCopiedUrl(null), 2000);
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const filteredFiles = files.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Media Library</h1>
                    <p className="text-gray-400">Manage uploaded images and files</p>
                </div>
                <label className="cursor-pointer">
                    <Button as="span" disabled={uploading}>
                        <Upload size={18} className="mr-2" />
                        {uploading ? 'Uploading...' : 'Upload Files'}
                    </Button>
                    <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                </label>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                    type="text"
                    placeholder="Search files..."
                    className="w-full bg-cyber-card border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-cyber-primary focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Files Grid */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin w-8 h-8 border-2 border-cyber-primary border-t-transparent rounded-full" />
                </div>
            ) : filteredFiles.length === 0 ? (
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center">
                    <ImageIcon size={48} className="mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-400">No files uploaded yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {filteredFiles.map((file) => (
                        <div
                            key={file.name}
                            className="bg-cyber-card border border-white/5 rounded-xl overflow-hidden group hover:border-white/10 transition-colors"
                        >
                            <div className="aspect-square bg-black/50 flex items-center justify-center relative overflow-hidden">
                                {file.type === 'image' ? (
                                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                                ) : (
                                    <File size={32} className="text-gray-600" />
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => copyUrl(file.url)}
                                        className="p-2 bg-cyber-primary rounded-lg hover:bg-cyber-primary/80"
                                        title="Copy URL"
                                    >
                                        {copiedUrl === file.url ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(file.name)}
                                        className="p-2 bg-red-500 rounded-lg hover:bg-red-600"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-2">
                                <p className="text-xs text-gray-400 truncate">{file.name}</p>
                                <p className="text-xs text-gray-600">{formatSize(file.size)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MediaPage;
