import api from '@/lib/api';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getPost(slug: string) {
  try {
    const response = await api.get(`/posts/${slug}`);
    return response.data;
  } catch (error) {
    return null;
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black p-8 text-gray-200 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation */}
        <Link href="/" className="group inline-flex items-center text-sm text-gray-500 hover:text-green-500 mb-8 transition-colors">
          <span className="mr-2 group-hover:-translate-x-1 transition-transform">&larr;</span> 
          RETURN_ROOT
        </Link>

        {/* Article Header */}
        <div className="mb-10 border-l-4 border-green-500 pl-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            {post.title}
          </h1>
          <div className="flex items-center space-x-4 text-sm font-mono text-gray-500">
            <span>USER: admin</span>
            <span>|</span>
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Content Area - Styled for dark mode readability */}
        <article 
          className="prose prose-invert prose-lg max-w-none 
          prose-headings:text-white prose-p:text-gray-300 prose-a:text-green-400 
          prose-strong:text-white prose-code:text-green-300 prose-code:bg-gray-900 prose-code:p-1 prose-code:rounded"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </main>
  );
}