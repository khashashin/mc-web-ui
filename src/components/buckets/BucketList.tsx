import { Bucket } from '../../hooks/useBuckets';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, HardDrive } from 'lucide-react';

interface BucketListProps {
    buckets: Bucket[];
    onDelete: (name: string) => void;
}

export default function BucketList({ buckets, onDelete }: BucketListProps) {
    if (buckets.length === 0) {
        return (
            <div className="text-center py-12 bg-muted/10 rounded-lg border border-border border-dashed">
                <div className="flex justify-center mb-4">
                    <div className="p-4 bg-background rounded-full border border-border">
                        <HardDrive className="w-8 h-8 text-muted-foreground" />
                    </div>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-1">No buckets found</h3>
                <p className="text-muted-foreground">Create a new bucket to get started.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buckets.map((bucket) => (
                <Card key={bucket.name} className="group hover:border-primary/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">
                            <Link to={`/buckets/${bucket.name}`} className="hover:text-primary transition-colors flex items-center gap-2">
                                <HardDrive className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                {bucket.name}
                            </Link>
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(bucket.name)}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mr-2"
                            title="Delete Bucket"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground space-y-1">
                            <div className="flex justify-between">
                                <span>Created</span>
                                <span>{new Date(bucket.creationDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Size</span>
                                <span>{bucket.size} B</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
