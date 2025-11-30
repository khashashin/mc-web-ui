import { Link, useLocation } from 'react-router';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HardDrive, Box } from 'lucide-react';

export default function Sidebar() {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

    const navItems = [
        {
            name: 'Buckets',
            path: '/',
            icon: HardDrive
        },
        // Add more items here later
    ];

    return (
        <aside className="w-64 bg-sidebar border-r border-sidebar-border min-h-screen flex flex-col">
            <div className="p-6 flex items-center gap-3 border-b border-sidebar-border h-16">
                <div className="w-8 h-8 bg-sidebar-primary rounded-md flex items-center justify-center">
                    <Box className="w-5 h-5 text-sidebar-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-sidebar-foreground tracking-tight">MinIO Client</span>
            </div>

            <ScrollArea className="flex-1 py-4">
                <nav className="px-2 space-y-1">
                    {navItems.map((item) => (
                        <Button
                            key={item.path}
                            variant={isActive(item.path) ? "secondary" : "ghost"}
                            className={cn(
                                "w-full justify-start gap-3 mb-1",
                                isActive(item.path) && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            )}
                            asChild
                        >
                            <Link to={item.path}>
                                <item.icon className="w-4 h-4" />
                                {item.name}
                            </Link>
                        </Button>
                    ))}
                </nav>
            </ScrollArea>

            <div className="p-4 border-t border-sidebar-border">
                <div className="text-xs text-muted-foreground text-center">
                    v0.1.0
                </div>
            </div>
        </aside>
    );
}
