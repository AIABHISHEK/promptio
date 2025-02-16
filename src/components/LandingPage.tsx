import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate('/prompts');
      }
    };
    checkUser();
  }, [navigate]);

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) console.error('Error signing in:', error);
  };

  const handleEmailSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) console.error('Error signing in:', error);
  };

  const handleEmailSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) console.error('Error signing up:', error);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <Sparkles className="h-16 w-16 text-blue-500 mb-4" />
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Welcome to PromptShare</h1>
      <button
        onClick={handleSignIn}
        className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-4 w-full max-w-xs"
      >
        Sign In with Google
      </button>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xs">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 border rounded-md mb-2 w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 border rounded-md mb-4 w-full"
        />
        {isSignUp ? (
          <button
            onClick={handleEmailSignUp}
            className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 mb-2 w-full"
          >
            Sign Up with Email
          </button>
        ) : (
          <button
            onClick={handleEmailSignIn}
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-2 w-full"
          >
            Sign In with Email
          </button>
        )}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-blue-500 hover:underline w-full text-center"
        >
          {isSignUp ? 'Already have an account? Sign In' : 'Don\'t have an account? Sign Up'}
        </button>
      </div>
    </div>
  );
}
