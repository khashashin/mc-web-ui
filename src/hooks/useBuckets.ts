import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

export interface Bucket {
    name: string;
    creationDate: string;
    size: number; // This might need to be fetched separately or comes with list? mc ls --json returns size?
    // mc ls --json on root alias returns:
    // {"status":"success","type":"folder","lastModified":"2021-01-01T00:00:00.000Z","size":0,"key":"bucketname/","url":"..."}
    // Actually mc ls alias/ returns buckets.
}

export function useBuckets() {
    const [buckets, setBuckets] = useState<Bucket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const fetchBuckets = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/buckets');
            if (res.status === 401) {
                navigate('/login');
                return;
            }
            const data = await res.json();
            if (res.ok) {
                // The backend now returns a standardized format:
                // { name: string, creationDate: string, size: number }
                // We can use it directly or map if keys differ slightly.
                // Our Bucket interface matches the backend response now.
                setBuckets(data.buckets);
            } else {
                setError(data.error || 'Failed to fetch buckets');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBuckets();
    }, []);

    const createBucket = async (name: string) => {
        const res = await fetch('/api/buckets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        fetchBuckets();
    };

    const deleteBucket = async (name: string, force = false) => {
        const res = await fetch(`/api/buckets/${name}?force=${force}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        fetchBuckets();
    };

    return { buckets, loading, error, createBucket, deleteBucket, refresh: fetchBuckets };
}
