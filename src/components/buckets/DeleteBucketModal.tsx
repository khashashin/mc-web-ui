import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface DeleteBucketModalProps {
    bucketName: string;
    onClose: () => void;
    onConfirm: (force: boolean) => Promise<void>;
}

export default function DeleteBucketModal({ bucketName, onClose, onConfirm }: DeleteBucketModalProps) {
    const [force, setForce] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleConfirm = async (e: React.MouseEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await onConfirm(force);
        } catch (err: any) {
            setError(err.message || 'Failed to delete bucket');
            setLoading(false);
        }
    };

    return (
        <AlertDialog open={true} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Bucket</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete <span className="font-mono font-bold text-foreground">{bucketName}</span>?
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="flex items-center space-x-2 py-4">
                    <Checkbox
                        id="force"
                        checked={force}
                        onCheckedChange={(checked) => setForce(checked as boolean)}
                    />
                    <Label htmlFor="force" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Force delete (delete all objects inside)
                    </Label>
                </div>

                {error && (
                    <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-2 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={loading}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {loading ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
