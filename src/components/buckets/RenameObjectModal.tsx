import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const renameSchema = z.object({
    newName: z.string().min(1, 'Name is required'),
});

interface RenameObjectModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    bucketName: string;
    objectName: string;
    onRename: () => void;
}

export default function RenameObjectModal({
    open,
    onOpenChange,
    bucketName,
    objectName,
    onRename,
}: RenameObjectModalProps) {
    const [error, setError] = useState('');

    const form = useForm<z.infer<typeof renameSchema>>({
        resolver: zodResolver(renameSchema),
        defaultValues: {
            newName: objectName,
        },
    });

    const onSubmit = async (values: z.infer<typeof renameSchema>) => {
        setError('');
        try {
            const res = await fetch(`/api/buckets/${bucketName}/objects/rename`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ oldName: objectName, newName: values.newName }),
            });

            const data = await res.json();

            if (res.ok) {
                onOpenChange(false);
                onRename();
            } else {
                setError(data.error || 'Failed to rename object');
            }
        } catch (err) {
            setError('Failed to connect to server');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Rename Object</DialogTitle>
                    <DialogDescription>
                        Rename <strong>{objectName}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="newName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {error && (
                            <div className="text-sm text-destructive font-medium">
                                {error}
                            </div>
                        )}

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Rename
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
