import React, { useEffect, useState } from 'react';

type Prompt = {
    id: string;
    title: string;
    content: string;
    user_id: string;
    tags: string[];
    created_at: string;
    likes_count: number;
    bookmarks_count: number;
};

import { supabase } from '../lib/supabase';
import { PromptCard } from './PromptCard';

export function ProfilePage() {
    const [createdPrompts, setCreatedPrompts] = useState<Prompt[]>([]);
    const [likedPrompts, setLikedPrompts] = useState<Prompt[]>([]);
    const [bookmarkedPrompts, setBookmarkedPrompts] = useState<Prompt[]>([]);
    const [activeTab, setActiveTab] = useState('created');
    const [expandedPromptId, setExpandedPromptId] = useState<string | null>(null);

    useEffect(() => {
        fetchPrompts();
    }, [activeTab]);

    const fetchPrompts = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        let { data, error }: { data: Prompt[] | null; error: Error | null } = { data: null, error: null };

        if (activeTab === 'created') {
            ({ data, error } = await supabase.from('prompts').select('*').eq('user_id', user.id));
        } else if (activeTab === 'liked') {
            ({ data, error } = await supabase
                .from('prompts')
                .select('*, likes!inner(user_id)')
                .eq('likes.user_id', user.id));
        } else if (activeTab === 'bookmarked') {
            ({ data, error } = await supabase
                .from('prompts')
                .select('*, bookmarks!inner(user_id)')
                .eq('bookmarks.user_id', user.id));
        }

        if (error) console.error('Error fetching prompts:', error);
        if (activeTab === 'created') setCreatedPrompts(data || []);
        if (activeTab === 'liked') setLikedPrompts(data || []);
        if (activeTab === 'bookmarked') setBookmarkedPrompts(data || []);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-center space-x-4 mb-8">
                    <button
                        onClick={() => setActiveTab('created')}
                        className={`px-4 py-2 ${activeTab === 'created' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} rounded-md`}
                    >
                        Created Prompts
                    </button>
                    <button
                        onClick={() => setActiveTab('liked')}
                        className={`px-4 py-2 ${activeTab === 'liked' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} rounded-md`}
                    >
                        Liked Prompts
                    </button>
                    <button
                        onClick={() => setActiveTab('bookmarked')}
                        className={`px-4 py-2 ${activeTab === 'bookmarked' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} rounded-md`}
                    >
                        Bookmarked Prompts
                    </button>
                </div>

                <div className="space-y-6">
                    {activeTab === 'created' && createdPrompts.map((prompt) => (
                        <PromptCard
                            key={prompt.id}
                            prompt={prompt}
                            isExpanded={expandedPromptId === prompt.id}
                            onToggleExpand={
                                () => setExpandedPromptId(
                                expandedPromptId === prompt.id ? null : prompt.id
                            )}
                        />
                    ))}
                    {activeTab === 'liked' && likedPrompts.map((prompt) => (
                        <PromptCard key={prompt.id} prompt={prompt} />
                    ))}
                    {activeTab === 'bookmarked' && bookmarkedPrompts.map((prompt) => (
                        <PromptCard key={prompt.id} prompt={prompt} />
                    ))}
                </div>
            </div>
        </div>
    );
}