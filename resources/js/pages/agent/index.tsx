import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { MessageCircle, X } from "lucide-react";

type Chat = {
    user: string;
    ai: string;
};

type TChatData = {
    content: string;
    role: "user" | "assistant";
};

export default function ManageChat({ chatData }: { chatData: TChatData[] }) {
    const chat = formatChatHistory(chatData);

    const [messages, setMessages] = useState<Chat[]>(chat || []);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false); // 🔥 toggle chat window

    const handleChat = async () => {
        if (!input.trim()) return;

        const userMessage = input;

        setMessages(prev => [...prev, { user: userMessage, ai: "..." }]);
        setInput("");
        setLoading(true);

        try {
            const res = await axios.post("/chat", { message: userMessage });
            const data = res.data;

            setMessages(prev =>
                prev.map((msg, index) =>
                    index === prev.length - 1
                        ? { user: data.user, ai: data.ai }
                        : msg
                )
            );
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-5 right-5 z-40 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-xl transition"
            >
                {open ? <X size={22} /> : <MessageCircle size={22} />}
            </button>

            {open && (
                <div
                    className="
        fixed z-40 bg-white shadow-2xl flex flex-col overflow-hidden border
        bottom-20 right-5 w-[360px] h-[420px] rounded-2xl

        sm:w-[380px] sm:h-[440px]

        max-sm:bottom-0 max-sm:right-0 max-sm:w-full max-sm:h-full max-sm:rounded-none
        "
                >
                    {/* Header */}
                    <div className="bg-blue-600 text-white p-4 font-semibold flex justify-between items-center">
                        <span>AI Assistant</span>
                        <button onClick={() => setOpen(false)} className="sm:hidden">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
                        {messages.length === 0 && (
                            <p className="text-gray-400 text-sm text-center">
                                Ask me anything 👋
                            </p>
                        )}

                        {messages.map((msg, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-end">
                                    <div className="bg-blue-600 text-white px-3 py-2 rounded-2xl max-w-[80%] text-sm wrap-break-word">
                                        {msg.user}
                                    </div>
                                </div>
                                <div className="flex justify-start">
                                    <div className="bg-gray-200 text-gray-900 px-3 py-2 rounded-2xl max-w-[80%] text-sm wrap-break-word">
                                        {msg.ai}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="text-xs text-gray-400">AI is typing...</div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t flex gap-2 bg-white">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleChat()}
                            placeholder="Type a message..."
                            className="text-sm"
                        />
                        <Button onClick={handleChat} disabled={loading}>
                            Send
                        </Button>
                    </div>
                </div>
            )}

        </>
    );
}

/* Convert backend history to UI format */
function formatChatHistory(data: TChatData[]) {
    const chats: Chat[] = [];
    let lastUserMessage: string | null = null;

    data.forEach(msg => {
        if (msg.role === "user") {
            lastUserMessage = msg.content;
        } else if (msg.role === "assistant" && lastUserMessage) {
            chats.push({
                user: lastUserMessage,
                ai: msg.content,
            });
            lastUserMessage = null;
        }
    });

    return chats;
}
