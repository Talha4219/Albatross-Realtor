
'use client';

import React, { useState, useRef, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Send, X, Loader2 } from 'lucide-react';
import { chat, type ChatInput } from '@/ai/flows/chat-flow';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const WELCOME_MESSAGE = {
  role: 'model' as const,
  content: "Hello! I'm Albatross, your AI real estate assistant. How can I help you find a property or navigate the site today?",
};

export default function AIChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    const userInput = input;
    setInput('');

    startTransition(async () => {
      try {
        const chatInput: ChatInput = {
          history: newMessages.map(m => ({ role: m.role, content: m.content })),
        };
        const response = await chat(chatInput);
        setMessages(prev => [...prev, { role: 'model', content: response }]);
      } catch (error) {
        console.error('AI chat error:', error);
        setMessages(prev => [...prev, { role: 'model', content: 'Sorry, I encountered an error. Please try again.' }]);
      }
    });
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="icon"
          className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle AI Chat"
        >
          {isOpen ? <X className="w-7 h-7 text-primary-foreground" /> : <MessageSquare className="w-7 h-7 text-primary-foreground" />}
        </Button>
      </div>
      
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-full max-w-sm h-[60vh] flex flex-col shadow-2xl animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300">
          <CardHeader className="flex-shrink-0">
            <CardTitle>AI Assistant</CardTitle>
            <CardDescription>Ask me about properties, financing, or how to use the site.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden p-0">
            <ScrollArea className="h-full">
              <div className="p-6 space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={cn('flex items-end gap-2', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                    {message.role === 'model' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn('max-w-[75%] rounded-lg px-3 py-2 text-sm', message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}
                    >
                      {message.content}
                    </div>
                     {message.role === 'user' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isPending && (
                   <div className="flex items-end gap-2 justify-start">
                      <Avatar className="h-8 w-8"><AvatarFallback>AI</AvatarFallback></Avatar>
                      <div className="bg-muted rounded-lg px-3 py-2 text-sm flex items-center gap-1">
                        <span className="w-2 h-2 bg-foreground/50 rounded-full animate-pulse delay-0"></span>
                        <span className="w-2 h-2 bg-foreground/50 rounded-full animate-pulse delay-150"></span>
                        <span className="w-2 h-2 bg-foreground/50 rounded-full animate-pulse delay-300"></span>
                      </div>
                   </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex-shrink-0 border-t pt-4">
            <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type a message..."
                disabled={isPending}
                autoComplete="off"
              />
              <Button type="submit" size="icon" disabled={isPending || !input.trim()}>
                {isPending ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4" />}
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
