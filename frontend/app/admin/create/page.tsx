'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  // Protect the route
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await api.post('/posts/', 
        { 
          title, 
          content, 
          slug: '', // Let backend generate it
          published: true 
        }, 
        {
          headers: { Authorization: `Bearer ${token}` } // Attach the Key Card
        }
      );
      
      alert('Post created!');
      router.push('/'); // Go back to home ppage,
    } catch (error) {
      alert('Failed to create post');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Write New Post</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-bold">Title</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-bold">Content (HTML allowed)</label>
            <textarea 
              className="w-full p-2 border rounded h-64"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Tip: You can use &lt;p&gt;, &lt;b&gt;, etc.</p>
          </div>

          <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            Publish
          </button>
        </form>
      </div>
    </div>
  );
}