import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HardDrive, Box, LayoutDashboard, Info, LogOut } from 'lucide-react';
import ConnectionInfoModal from '../common/ConnectionInfoModal';

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [connectionInfoOpen, setConnectionInfoOpen] = useState(false);

    const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <aside className="w-64 bg-sidebar border-r border-sidebar-border min-h-screen flex flex-col">
            <div className="p-6 flex items-center gap-3 border-b border-sidebar-border h-16">
                <div className="w-8 h-8 bg-sidebar-primary rounded-md flex items-center justify-center">
                    <Box className="w-5 h-5 text-sidebar-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-sidebar-foreground tracking-tight">MC Web UI</span>
            </div>

            <ScrollArea className="flex-1 py-4">
                <nav className="px-2 space-y-1">
                    <Button
                        variant={isActive('/') ? "secondary" : "ghost"}
                        className={cn(
                            "w-full justify-start gap-3 mb-1",
                            isActive('/') && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        )}
                        asChild
                    >
                        <Link to="/">
                            <HardDrive className="w-4 h-4" />
                            Buckets
                        </Link>
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 mb-1"
                        onClick={() => setConnectionInfoOpen(true)}
                    >
                        <Info className="w-4 h-4" />
                        Connection Info
                    </Button>
                </nav>
            </ScrollArea>

            <div className="p-4 border-t border-sidebar-border">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </Button>
                <div className="mt-4 text-xs text-muted-foreground text-center">
                    v0.1.0
                </div>
            </div>

            <ConnectionInfoModal open={connectionInfoOpen} onOpenChange={setConnectionInfoOpen} />
        </aside>
    );
}
