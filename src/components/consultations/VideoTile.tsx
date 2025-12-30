'use client';

import { DailyVideo, useParticipantProperty } from '@daily-co/daily-react';
import { User, MicOff } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface VideoTileProps {
    sessionId: string | null;
    isLocal?: boolean;
    label?: string;
    className?: string;
}

export function VideoTile({ sessionId, isLocal = false, label, className }: VideoTileProps) {
    const videoState = useParticipantProperty(sessionId ?? '', 'video');
    const audioState = useParticipantProperty(sessionId ?? '', 'audio');
    const userName = useParticipantProperty(sessionId ?? '', 'user_name');

    const hasVideo = videoState === true;
    const hasAudio = audioState === true;

    if (!sessionId) {
        return (
            <div className={cn(
                "relative rounded-xl overflow-hidden bg-muted",
                className
            )}>
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-10 h-10 sm:w-12 sm:h-12 text-primary/60" />
                    </div>
                </div>
                <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-1 bg-black/60 text-white rounded text-xs border-0">
                        {label || 'Waiting...'}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className={cn(
            "relative rounded-xl overflow-hidden bg-muted",
            className
        )}>
            {hasVideo ? (
                <DailyVideo
                    sessionId={sessionId}
                    type="video"
                    automirror
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center">
                        <User className="w-10 h-10 text-muted-foreground" />
                    </div>
                </div>
            )}

            {/* Participant label */}
            <div className="absolute bottom-2 left-2 flex items-center gap-2">
                <span className="px-2 py-1 bg-card/80 rounded text-foreground text-sm backdrop-blur-sm border border-border">
                    {label || userName || (isLocal ? 'You' : 'Patient')}
                </span>
                {!hasAudio && (
                    <span className="p-1 bg-destructive/80 rounded">
                        <MicOff className="w-3 h-3 text-destructive-foreground" />
                    </span>
                )}
            </div>

            {/* Connection indicator */}
            <div className="absolute top-2 right-2">
                <span className="flex items-center gap-1 px-2 py-1 bg-card/80 rounded text-xs text-green-500 backdrop-blur-sm border border-border">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Connected
                </span>
            </div>
        </div>
    );
}
