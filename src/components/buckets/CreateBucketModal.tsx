import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const createBucketSchema = z.object({
    name: z.string()
        .min(3, 'Bucket name must be at least 3 characters')
        .max(63, 'Bucket name must be at most 63 characters')
        .regex(/^[a-z0-9][a-z0-9.-]*[a-z0-9]$/, 'Invalid bucket name format (lowercase, numbers, dots, hyphens)'),
});

type CreateBucketFormValues = z.infer<typeof createBucketSchema>;

interface CreateBucketModalProps {
    onClose: () => void;
    onCreate: (name: string) => Promise<void>;
}

export default function CreateBucketModal({ onClose, onCreate }: CreateBucketModalProps) {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const form = useForm<CreateBucketFormValues>({
        resolver: zodResolver(createBucketSchema),
        defaultValues: {
            name: '',
        },
    });

    const onSubmit = async (values: CreateBucketFormValues) => {
        setLoading(true);
        setError('');
        try {
            await onCreate(values.name);
        } catch (err: any) {
            setError(err.message || 'Failed to create bucket');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Create Bucket</CardTitle>
                    <CardDescription>Enter a name for your new bucket.</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-2 rounded mb-4 text-sm">
                            {error}
                        </div>
                    )}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bucket Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="my-bucket" autoFocus {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="ghost" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Creating...' : 'Create'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

