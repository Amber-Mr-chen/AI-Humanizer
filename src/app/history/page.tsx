import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getUserHistory } from '@/lib/db';

export const metadata: Metadata = {
  title: 'History - AI Humanizer',
};

export default async function HistoryPage({ searchParams }: { searchParams: { page?: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/');

  const page = parseInt(searchParams.page || '1');
  const limit = 10;
  const offset = (page - 1) * limit;

  let history: any[] = [];
  try {
    const { env } = await getCloudflareContext();
    const db = env.DB as D1Database;
    // 需要适配 getUserHistory 支持分页
    history = await getUserHistory(db, (session.user as any).id ?? session.user.email!, limit, offset);
  } catch {
    // dev environment fallback
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">History</h1>

        {history.length === 0 && page === 1 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No history yet.</p>
            <p className="text-sm mt-2">Start humanizing text to see your history here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-full capitalize font-medium">
                    {item.mode}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(item.created_at * 1000).toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Input</p>
                    <p className="text-sm text-gray-600 line-clamp-3">{item.input_text}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Output</p>
                    <p className="text-sm text-gray-600 line-clamp-3">{item.output_text}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* 分页导航 */}
            <div className="flex justify-between pt-6">
               <a 
                 href={`/history?page=${Math.max(1, page - 1)}`} 
                 className={`px-4 py-2 rounded-lg text-sm border ${page === 1 ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'border-gray-200 hover:bg-gray-50'}`}
               >
                 Previous
               </a>
               <span className="text-sm text-gray-500 py-2">Page {page}</span>
               <a 
                 href={`/history?page=${page + 1}`} 
                 className={`px-4 py-2 rounded-lg text-sm border ${history.length < limit ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'border-gray-200 hover:bg-gray-50'}`}
               >
                 Next
               </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
