import { useState } from 'react';
import { useNavigate } from 'react-router';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const loginSchema = z.object({
    endpoint: z.string().url('Invalid URL format'),
    accessKey: z.string().min(1, 'Access Key is required'),
    secretKey: z.string().min(1, 'Secret Key is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            endpoint: 'http://minio:9000',
            accessKey: '',
            secretKey: '',
        },
    });

    const onSubmit = async (values: LoginFormValues) => {
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            const data = await res.json();

            if (res.ok) {
                navigate('/');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-primary">MinIO Client</CardTitle>
                    <CardDescription>Sign in to your MinIO server</CardDescription>
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
                                name="endpoint"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Endpoint</FormLabel>
                                        <FormControl>
                                            <Input placeholder="http://minio:9000" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="accessKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Access Key</FormLabel>
                                        <FormControl>
                                            <Input placeholder="minioadmin" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="secretKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Secret Key</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="minioadmin" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Connecting...' : 'Sign In'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
