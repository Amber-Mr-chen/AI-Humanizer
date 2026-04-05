import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getUserHistory } from '@/lib/db';

export const metadata: Metadata = {
  title: 'History - AI Humanizer',
};

export default async function HistoryPage() {
  const session = await getServerSession();
  if (!session?.user) redirect('/');

  let history: any[] = [];
  try {
    const { env } = await getCloudflareContext();
    const db = env.DB as D1Database;
    history = await getUserHistory(db, (session.user as any).id ?? session.user.email!);
  } catch {
    // dev environment fallback
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">History</h1>

        {history.length === 0 ? (
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
          </div>
        )}
      </div>
    </div>
  );
}
