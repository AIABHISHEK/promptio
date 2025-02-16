import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { PromptCard } from './PromptCard';
import { CreatePromptForm } from './CreatePromptForm';
import { Modal } from './Modal';
import { Toaster } from 'react-hot-toast';

interface Prompt {
    id: string;
    title: string;
    content: string;
    tags: string[];
    created_at: string;
    likes_count: number;
    bookmarks_count: number;
}

export function PromptsPage() {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [expandedPromptId, setExpandedPromptId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const PROMPTS_PER_PAGE = 10;

    useEffect(() => {
        if (!searchQuery) {
            fetchPrompts();
            return;
        }
        const debounceFetch = setTimeout(() => {
            fetchPrompts();
        }, 1000); // 500ms debounce time
        return () => clearTimeout(debounceFetch);
    }, [page, searchQuery]);

    const fetchPrompts = async () => {
        try {
            setLoading(true);
            let query = supabase
                .from('prompts')
                .select('*')
                .range((page - 1) * PROMPTS_PER_PAGE, page * PROMPTS_PER_PAGE - 1)
                .order('created_at', { ascending: false });

            if (searchQuery) {
                query = query.or(`title.ilike.%${searchQuery}%,tags.ilike.%${searchQuery}%`);
            }
            const { data, error } = await query;
            if (error) throw error;
            setPrompts(data || []);
        } catch (error) {
            console.error('Error fetching prompts:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Toaster position="top-center" />
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Create Prompt
                </button>
                <input
                    type="text"
                    placeholder="Search prompts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 border rounded-md"
                />
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <CreatePromptForm
                    onPromptCreated={() => {
                        fetchPrompts();
                        setIsModalOpen(false);
                    }}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    <div className="space-y-6">
                        {prompts.map((prompt) => (
                            <PromptCard
                                key={prompt.id}
                                prompt={prompt}
                                isExpanded={expandedPromptId === prompt.id}
                                onToggleExpand={() => setExpandedPromptId(
                                    expandedPromptId === prompt.id ? null : prompt.id
                                )}
                            />
                        ))}
                    </div>

                    <div className="mt-8 flex justify-center space-x-4">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 z-0 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={prompts.length < PROMPTS_PER_PAGE}
                            className="px-4 z-0 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </main>
    );
}