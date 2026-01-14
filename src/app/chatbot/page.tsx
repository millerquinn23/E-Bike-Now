import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

export default function ChatbotPage() {
  return (
    <div className="p-4 h-full flex items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center justify-center gap-2">
            <MessageCircle className="text-primary" />
            Support Chatbot
          </CardTitle>
          <CardDescription>
            This is a placeholder for the future chatbot.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The chatbot functionality will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
