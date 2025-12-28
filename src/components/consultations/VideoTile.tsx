'use client';

import { DailyVideo, useParticipantProperty } from '@daily-co/daily-react';
import { User, MicOff } from 'lucide-react';

interface VideoTileProps {
    sessionId: string | null;
    isLocal?: boolean;
    label?: string;
}

export function VideoTile({ sessionId, isLocal = false, label }: VideoTileProps) {
    const videoState = useParticipantProperty(sessionId ?? '', 'video');
    const audioState = useParticipantProperty(sessionId ?? '', 'audio');
    const userName = useParticipantProperty(sessionId ?? '', 'user_name');

    const hasVideo = videoState === true;
    const hasAudio = audioState === true;

    if (!sessionId) {
        return (
            <div className="relative rounded-xl overflow-hidden bg-muted aspect-video">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center">
                        <User className="w-10 h-10 text-muted-foreground" />
                    </div>
                </div>
                <div className="absolute bottom-2 left-2">
                    <span className="px-2 py-1 bg-card/80 rounded text-foreground text-sm backdrop-blur-sm border border-border">
                        {label || 'Waiting...'}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="relative rounded-xl overflow-hidden bg-muted aspect-video">
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
