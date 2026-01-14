import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send } from 'lucide-react';

export default function ChatbotPage() {
  return (
    <div className="p-4 h-full flex flex-col">
      <header className="flex items-center gap-3 pb-4 border-b">
        <MessageCircle className="w-8 h-8 text-primary" />
        <div>
            <h1 className="font-headline text-xl font-semibold">Support Chatbot</h1>
            <p className="text-sm text-muted-foreground">How can I help you today?</p>
        </div>
      </header>
      <div className="flex-1 py-4 space-y-4 overflow-y-auto">
        {/* Placeholder for chat messages */}
        <Card className="p-3 rounded-lg bg-muted max-w-[80%]">
            <p className="text-sm">Welcome to eBikeNow support! Ask me anything about our services.</p>
        </Card>
        <Card className="p-3 rounded-lg bg-primary text-primary-foreground max-w-[80%] ml-auto">
            <p className="text-sm">How much does a 30 minute ride cost?</p>
        </Card>
         <Card className="p-3 rounded-lg bg-muted max-w-[80%]">
            <p className="text-sm">A 30-minute ride typically costs around $5, but you can get a more accurate number from our cost estimator.</p>
        </Card>
      </div>
      <footer className="pt-4 border-t">
        <div className="relative">
            <Textarea placeholder="Type your message..." className="pr-16" rows={1} />
            <Button type="submit" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2">
                <Send className="w-4 h-4" />
                <span className="sr-only">Send</span>
            </Button>
        </div>
      </footer>
    </div>
  );
}
