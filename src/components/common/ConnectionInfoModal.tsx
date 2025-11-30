import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Eye, EyeOff, Check } from 'lucide-react';

interface ConnectionInfo {
    endpoint: string;
    accessKey: string;
    secretKey: string;
    region: string;
}

interface ConnectionInfoModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    bucketName?: string;
}

export default function ConnectionInfoModal({ open, onOpenChange, bucketName }: ConnectionInfoModalProps) {
    const [info, setInfo] = useState<ConnectionInfo | null>(null);
    const [showSecret, setShowSecret] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            fetch('/api/auth/connection-info')
                .then(res => res.json())
                .then(data => setInfo(data))
                .catch(err => console.error('Failed to fetch connection info', err));
        }
    }, [open]);

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    if (!info) return null;

    if (!info) return null;

    const jsSnippet = `const S3 = require('aws-sdk/clients/s3');

const s3 = new S3({
    endpoint: '${info.endpoint}',
    accessKeyId: '${info.accessKey}',
    secretAccessKey: '${info.secretKey}',
    s3ForcePathStyle: true,
    signatureVersion: 'v4'
});${bucketName ? `

// List objects in '${bucketName}'
s3.listObjectsV2({ Bucket: '${bucketName}' }, (err, data) => {
    if (err) console.log(err);
    else console.log(data);
});` : ''}`;

    const pythonSnippet = `import boto3

s3 = boto3.client('s3',
    endpoint_url='${info.endpoint}',
    aws_access_key_id='${info.accessKey}',
    aws_secret_access_key='${info.secretKey}'
)${bucketName ? `

# List objects in '${bucketName}'
response = s3.list_objects_v2(Bucket='${bucketName}')
print(response.get('Contents', []))` : ''}`;

    const cliSnippet = `mc alias set myminio ${info.endpoint} ${info.accessKey} ${info.secretKey}${bucketName ? `

# List objects in '${bucketName}'
mc ls myminio/${bucketName}` : ''}`;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Connection Information</DialogTitle>
                    <DialogDescription>
                        Use these details to connect your applications to this MinIO instance.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Endpoint</Label>
                            <div className="flex gap-2">
                                <Input value={info.endpoint} readOnly />
                                <Button size="icon" variant="outline" onClick={() => copyToClipboard(info.endpoint, 'endpoint')}>
                                    {copiedField === 'endpoint' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Region</Label>
                            <div className="flex gap-2">
                                <Input value={info.region} readOnly />
                                <Button size="icon" variant="outline" onClick={() => copyToClipboard(info.region, 'region')}>
                                    {copiedField === 'region' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Access Key</Label>
                        <div className="flex gap-2">
                            <Input value={info.accessKey} readOnly />
                            <Button size="icon" variant="outline" onClick={() => copyToClipboard(info.accessKey, 'accessKey')}>
                                {copiedField === 'accessKey' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Secret Key</Label>
                        <div className="flex gap-2">
                            <Input type={showSecret ? 'text' : 'password'} value={info.secretKey} readOnly />
                            <Button size="icon" variant="outline" onClick={() => setShowSecret(!showSecret)}>
                                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button size="icon" variant="outline" onClick={() => copyToClipboard(info.secretKey, 'secretKey')}>
                                {copiedField === 'secretKey' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    <Tabs defaultValue="js" className="mt-4">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="js">JavaScript</TabsTrigger>
                            <TabsTrigger value="python">Python</TabsTrigger>
                            <TabsTrigger value="cli">CLI</TabsTrigger>
                        </TabsList>
                        <TabsContent value="js">
                            <div className="relative">
                                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                                    <code>{jsSnippet}</code>
                                </pre>
                                <Button size="icon" variant="ghost" className="absolute top-2 right-2" onClick={() => copyToClipboard(jsSnippet, 'js')}>
                                    {copiedField === 'js' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </TabsContent>
                        <TabsContent value="python">
                            <div className="relative">
                                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                                    <code>{pythonSnippet}</code>
                                </pre>
                                <Button size="icon" variant="ghost" className="absolute top-2 right-2" onClick={() => copyToClipboard(pythonSnippet, 'python')}>
                                    {copiedField === 'python' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </TabsContent>
                        <TabsContent value="cli">
                            <div className="relative">
                                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                                    <code>{cliSnippet}</code>
                                </pre>
                                <Button size="icon" variant="ghost" className="absolute top-2 right-2" onClick={() => copyToClipboard(cliSnippet, 'cli')}>
                                    {copiedField === 'cli' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}
