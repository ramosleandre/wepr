import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface TokenData {
    token: string;
    entropy: number;
    risk_level?: 'high' | 'medium' | 'low';
}

interface ChatInterfaceProps {
    messages: Message[];
    onSendMessage: (message: string) => void;
    isLoading: boolean;
    latestTokens?: TokenData[];
}

export function ChatInterface({ messages, onSendMessage, isLoading, latestTokens }: ChatInterfaceProps) {
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSendMessage(input);
            setInput('');
        }
    };

    return (
        <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((msg, i) => {
                        const isLastAssistantMessage = i === messages.length - 1 && msg.role === 'assistant';

                        return (
                            <div
                                key={i}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                            >
                                <Card
                                    className={`max-w-[80%] p-3 ${msg.role === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted'
                                        }`}
                                >
                                    {isLastAssistantMessage && latestTokens && latestTokens.length > 0 ? (
                                        <div className="text-sm whitespace-pre-wrap">
                                            {latestTokens.map((t, idx) => {
                                                // Use backend-provided risk level for highlighting
                                                const bgColor = t.risk_level === 'high'
                                                    ? 'bg-red-500/30'
                                                    : t.risk_level === 'medium'
                                                        ? 'bg-yellow-500/30'
                                                        : 'transparent';

                                                return (
                                                    <span key={idx} className={`${bgColor} rounded px-0.5 transition-colors duration-200`} title={`Entropy: ${t.entropy.toFixed(2)}`}>
                                                        {t.token}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                    )}
                                </Card>
                            </div>
                        )
                    })}
                    {isLoading && (
                        <div className="flex justify-start">
                            <Card className="bg-muted p-3">
                                <div className="flex space-x-2">
                                    <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce delay-75" />
                                    <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce delay-150" />
                                </div>
                            </Card>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>
            <div className="p-4 border-t">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question..."
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()}>
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
