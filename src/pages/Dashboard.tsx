import { useState } from 'react';
import { useBuckets } from '../hooks/useBuckets';
import BucketList from '../components/buckets/BucketList';
import CreateBucketModal from '../components/buckets/CreateBucketModal';
import DeleteBucketModal from '../components/buckets/DeleteBucketModal';

export default function Dashboard() {
    const { buckets, loading, error, createBucket, deleteBucket, refresh } = useBuckets();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [bucketToDelete, setBucketToDelete] = useState<string | null>(null);

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (error) return <div className="p-8 text-error">Error: {error}</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold text-primary">Buckets</h1>
                    <button
                        onClick={refresh}
                        className="text-text-muted hover:text-white transition-colors"
                        title="Refresh"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    </button>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded transition-colors"
                >
                    Create Bucket
                </button>
            </div>

            <BucketList
                buckets={buckets}
                onDelete={(name: string) => setBucketToDelete(name)}
            />

            {isCreateModalOpen && (
                <CreateBucketModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreate={async (name: string) => {
                        await createBucket(name);
                        setIsCreateModalOpen(false);
                    }}
                />
            )}

            {bucketToDelete && (
                <DeleteBucketModal
                    bucketName={bucketToDelete}
                    onClose={() => setBucketToDelete(null)}
                    onConfirm={async (force: boolean) => {
                        await deleteBucket(bucketToDelete, force);
                        setBucketToDelete(null);
                    }}
                />
            )}
        </div>
    );
}
