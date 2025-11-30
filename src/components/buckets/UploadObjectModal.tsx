import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDropzone } from 'react-dropzone';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, CloudUpload, File as FileIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const uploadSchema = z.object({
    file: z.any().refine((files) => files?.length > 0, 'File is required'),
});

interface UploadObjectModalProps {
    bucketName: string;
    onUpload: () => void;
}

export default function UploadObjectModal({ bucketName, onUpload }: UploadObjectModalProps) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');

    const form = useForm<z.infer<typeof uploadSchema>>({
        resolver: zodResolver(uploadSchema),
    });

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            form.setValue('file', acceptedFiles, { shouldValidate: true });
            form.clearErrors('file');
        }
    }, [form]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
    });

    const selectedFile = form.watch('file')?.[0];

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            form.reset();
        }
    };

    const onSubmit = async (values: z.infer<typeof uploadSchema>) => {
        setError('');
        const file = values.file[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`/api/buckets/${bucketName}/objects`, {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                handleOpenChange(false);
                onUpload();
            } else {
                setError(data.error || 'Failed to upload object');
            }
        } catch (err) {
            setError('Failed to connect to server');
        }
    };

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        form.setValue('file', null);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Object
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Object</DialogTitle>
                    <DialogDescription>
                        Upload a file to <strong>{bucketName}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="file"
                            render={() => (
                                <FormItem>
                                    <FormLabel>File</FormLabel>
                                    <FormControl>
                                        <div
                                            {...getRootProps()}
                                            className={cn(
                                                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors hover:bg-muted/50",
                                                isDragActive ? "border-primary bg-muted" : "border-muted-foreground/25",
                                                error ? "border-destructive/50" : ""
                                            )}
                                        >
                                            <input {...getInputProps()} />
                                            {selectedFile ? (
                                                <div className="flex items-center justify-center gap-4">
                                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <FileIcon className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-sm font-medium">{selectedFile.name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {(selectedFile.size / 1024).toFixed(2)} KB
                                                        </p>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="ml-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                                                        onClick={removeFile}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                                        <CloudUpload className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Any file up to 10MB
                                                    </p>
                                                </div>
                                            )}
                                        </div>
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
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={form.formState.isSubmitting || !selectedFile}>
                                {form.formState.isSubmitting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Upload
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
