
"use client";

import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AIChatWidgetPlaceholder() {
  // In a real implementation, this would handle opening the chat window
  const handleOpenChat = () => {
    console.log("AI Chat widget clicked. Placeholder action.");
    // Here you would typically set a state to show the full chat interface
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 shadow-lg"
              onClick={handleOpenChat}
              aria-label="Open AI Chat"
            >
              <MessageSquare className="w-7 h-7 text-primary-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" sideOffset={10}>
            <p>Hi! I’m here to help you find your dream property or answer any questions!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

