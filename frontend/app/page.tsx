import api from '@/lib/api';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  content: string;
  slug: string;
  created_at: string;
}

async function getPosts() {
  try {
    const response = await api.get('/posts');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
}

export default async function Home() {
  const posts: Post[] = await getPosts();

  return (
    <main className="min-h-screen p-8 text-gray-200">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-12 border-b border-gray-800 pb-8 flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-bold text-white tracking-tighter">
              ANDY_DEV<span className="text-green-500">.LOG</span>
            </h1>
            <p className="mt-2 text-gray-500">Cyber Security | Tech</p>
          </div>
          <Link href="/login" className="px-4 py-2 border border-gray-700 hover:border-green-500 hover:text-green-500 transition rounded text-sm">
            ADMIN_ACCESS
          </Link>
        </header>
        
        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <div key={post.id} className="group relative bg-gray-900/50 border border-gray-800 p-6 rounded-xl hover:border-green-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.1)]">
              
              {/* Date Badge */}
              <div className="text-xs font-mono text-green-500 mb-3">
                {new Date(post.created_at).toLocaleDateString()}
              </div>

              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                {post.title}
              </h2>
              
              <p className="text-gray-400 mb-6 line-clamp-3 font-sans text-sm leading-relaxed">
                {post.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
              </p>
              
              <Link 
                href={`/posts/${post.slug}`}
                className="inline-flex items-center text-sm font-bold text-white group-hover:underline decoration-green-500 underline-offset-4"
              >
                READ_EXECUTE &rarr;
              </Link>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20 border border-dashed border-gray-800 rounded-xl">
            <p className="text-gray-600 font-mono">System Empty. Initialize new data.</p>
          </div>
        )}
      </div>
    </main>
  );
}