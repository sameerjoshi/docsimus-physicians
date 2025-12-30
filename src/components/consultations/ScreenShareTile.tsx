'use client';

import { DailyVideo, useScreenShare, useParticipantIds, useParticipantProperty } from '@daily-co/daily-react';
import { MonitorUp, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '@/src/components/ui/button';

interface ScreenShareTileProps {
    className?: string;
    onStopSharing?: () => void;
}

export function ScreenShareTile({ className, onStopSharing }: ScreenShareTileProps) {
    const { screens } = useScreenShare();

    // Get all participant IDs to find who's sharing
    const allParticipantIds = useParticipantIds();

    // Find a participant who is screen sharing
    const screenSharerId = allParticipantIds.find((id) => {
        // We need to check the screens array to see who's sharing
        return screens.some((screen) => screen.session_id === id);
    });

    // Get the screen share session ID from the screens array
    const screenShare = screens[0];
    const screenSessionId = screenShare?.session_id;

    // Get the name of the person sharing
    const sharerName = useParticipantProperty(screenSessionId ?? '', 'user_name');

    if (!screenSessionId || screens.length === 0) {
        return null;
    }

    const isLocalSharing = screenShare?.local;

    return (
        <div className={cn(
            'relative rounded-xl overflow-hidden bg-muted border-2 border-primary/50',
            className
        )}>
            <DailyVideo
                sessionId={screenSessionId}
                type="screenVideo"
                className="w-full h-full object-contain bg-black"
            />

            {/* Screen share label */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-medium flex items-center gap-1.5">
                    <MonitorUp className="w-3 h-3" />
                    {isLocalSharing ? 'You are sharing' : `${sharerName || 'Screen'} is sharing`}
                </span>
            </div>

            {/* Stop sharing button for local screen share */}
            {isLocalSharing && onStopSharing && (
                <div className="absolute top-3 right-3">
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={onStopSharing}
                        className="h-8 px-2 gap-1.5"
                    >
                        <X className="w-3 h-3" />
                        Stop Sharing
                    </Button>
                </div>
            )}
        </div>
    );
}
