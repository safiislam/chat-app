import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AgentAiController from "@/actions/App/Http/Controllers/AgentAiController";

type Chat = {
    user: string;
    ai: string;
};

export default function ManageChat() {
    const { props } = usePage<{ flash: { chat?: Chat } }>();

    const [messages, setMessages] = useState<Chat[]>(
        props?.flash?.chat ? [props?.flash?.chat] : []
    );

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChat = () => {
        if (!input.trim()) return;

        setLoading(true);

        router.post(
            AgentAiController.chat().url,
            { message: input },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    const chat = page?.props?.flash?.chat as Chat;
                    if (chat) {
                        setMessages(prev => [...prev, chat]);
                    }
                    setInput("");
                    setLoading(false);
                },
            }
        );
    };

    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto p-4 space-y-4">
                {/* Chat Box */}
                <div className="border rounded-xl p-4 h-[500px] overflow-y-auto bg-white shadow">
                    {messages?.map((msg, i) => (
                        <div key={i} className="space-y-2 mb-4">
                            <div className="flex justify-end">
                                <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl max-w-[75%] text-sm">
                                    {msg.user}
                                </div>
                            </div>
                            <div className="flex justify-start">
                                <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-2xl max-w-[75%] text-sm">
                                    {msg.ai}
                                </div>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="text-sm text-gray-400">AI is thinking...</div>
                    )}
                </div>

                {/* Input */}
                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask something..."
                        onKeyDown={(e) => e.key === "Enter" && handleChat()}
                    />
                    <Button onClick={handleChat} disabled={loading}>
                        Send
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
