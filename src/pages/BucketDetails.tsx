import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, File, Folder } from 'lucide-react';

interface BucketObject {
    name: string;
    lastModified: string;
    size: number;
    etag: string;
}

export default function BucketDetails() {
    const { bucketName } = useParams<{ bucketName: string }>();
    const [objects, setObjects] = useState<BucketObject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchObjects = async () => {
            try {
                const res = await fetch(`/api/buckets/${bucketName}/objects`);
                const data = await res.json();
                if (res.ok) {
                    setObjects(data.objects || []);
                } else {
                    setError(data.error || 'Failed to fetch objects');
                }
            } catch (err) {
                setError('Failed to connect to server');
            } finally {
                setLoading(false);
            }
        };

        if (bucketName) {
            fetchObjects();
        }
    }, [bucketName]);

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground">Loading objects...</div>;
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-2 rounded mb-4">
                    {error}
                </div>
                <Button asChild variant="outline">
                    <Link to="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Buckets
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center gap-4">
                <Button asChild variant="ghost" size="icon">
                    <Link to="/">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold text-foreground">{bucketName}</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Objects</CardTitle>
                </CardHeader>
                <CardContent>
                    {objects.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            This bucket is empty.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]"></TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Last Modified</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {objects.map((obj) => (
                                    <TableRow key={obj.name}>
                                        <TableCell>
                                            {obj.name.endsWith('/') ? (
                                                <Folder className="h-4 w-4 text-blue-400" />
                                            ) : (
                                                <File className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{obj.name}</TableCell>
                                        <TableCell>{obj.size} B</TableCell>
                                        <TableCell>{new Date(obj.lastModified).toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
