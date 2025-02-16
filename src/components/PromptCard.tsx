import React, { useState } from 'react';
import { Bookmark, Heart, Tag, Clipboard } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface PromptCardProps {
  prompt: {
    id: string;
    title: string;
    content: string;
    tags: string[];
    created_at: string;
    likes_count: number;
    bookmarks_count: number;
  };
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export function PromptCard({ prompt, isExpanded = false, onToggleExpand }: PromptCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(prompt.likes_count);
  const [bookmarksCount, setBookmarksCount] = useState(prompt.bookmarks_count);

  const handleLike = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to like prompts');
        return;
      }

      if (!isLiked) {
        await supabase.from('likes').insert({
          prompt_id: prompt.id,
          user_id: user.id
        });
        setLikesCount(prev => prev + 1);
      } else {
        await supabase.from('likes')
          .delete()
          .match({ prompt_id: prompt.id, user_id: user.id });
        setLikesCount(prev => prev - 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleBookmark = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to bookmark prompts');
        return;
      }

      if (!isBookmarked) {
        await supabase.from('bookmarks').insert({
          prompt_id: prompt.id,
          user_id: user.id
        });
        setBookmarksCount(prev => prev + 1);
      } else {
        await supabase.from('bookmarks')
          .delete()
          .match({ prompt_id: prompt.id, user_id: user.id });
        setBookmarksCount(prev => prev - 1);
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.log(error)
      toast.error('Something went wrong');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content);
    toast.success('Prompt content copied to clipboard');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 relative">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{prompt.title}</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleLike}
            className={`p-2 rounded-full hover:bg-gray-100 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
          >
            <Heart className="w-5 h-5" />
            <span className="text-sm ml-1">{likesCount}</span>
          </button>
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-full hover:bg-gray-100 ${isBookmarked ? 'text-blue-500' : 'text-gray-500'}`}
          >
            <Bookmark className="w-5 h-5" />
            <span className="text-sm ml-1">{bookmarksCount}</span>
          </button>
        </div>
      </div>

      <p className="text-gray-600 mb-4">
        {isExpanded ? prompt.content : `${prompt.content.slice(0, 200)}...`}
      </p>

      {!isExpanded && prompt.content.length > 200 && (
        <button
          onClick={onToggleExpand}
          className="text-blue-500 hover:text-blue-600 font-medium"
        >
          Read more
        </button>
      )}

      <div className="flex flex-wrap gap-2 mt-4">
        {prompt.tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
          >
            <Tag className="w-4 h-4 mr-1" />
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        {formatDistanceToNow(new Date(prompt.created_at), { addSuffix: true })}
      </div>

      <button
        onClick={handleCopy}
        className="absolute bottom-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500"
      >
        <Clipboard className="w-5 h-5" />
      </button>
    </div>
  );
}
