<?php

declare(strict_types=1);

namespace App\Neuron;

use App\Models\ChatMessage;
use NeuronAI\Agent;
use NeuronAI\Chat\History\ChatHistoryInterface;
use NeuronAI\Chat\History\EloquentChatHistory;
use NeuronAI\Providers\AIProviderInterface;
use NeuronAI\Providers\Gemini\Gemini;
use NeuronAI\Providers\HttpClientOptions;
use NeuronAI\RAG\Embeddings\EmbeddingsProviderInterface;
use NeuronAI\RAG\Embeddings\GeminiEmbeddingsProvider;
use NeuronAI\RAG\VectorStore\PineconeVectorStore;
use NeuronAI\RAG\VectorStore\VectorStoreInterface;
use NeuronAI\SystemPrompt;
use NeuronAI\Tools\ToolInterface;
use NeuronAI\Tools\Toolkits\ToolkitInterface;

class MyAgent extends Agent
{
    protected function provider(): AIProviderInterface
    {
        return new Gemini(
            key: 'AIzaSyCw7l8ZOZOWvkQhi1hLTxH90a6CJo5ZzaI',
            model: 'gemini-3-flash-preview',
             parameters: [
                'generationConfig' => [
                    'temperature' => 0,
                ],
            ],
        );
    }

    public function instructions(): string
    {
        return (string) new SystemPrompt(
             background: [
            "You are a friendly AI assistant created by Digital Crop IT Agency.",
            "You must always respond in ONE short, clear sentence.",
            "Do not give explanations, lists, or extra details.",
            "Keep responses concise and message-style."
        ],
        );
    }
     protected function embeddings(): EmbeddingsProviderInterface
    {
        return new GeminiEmbeddingsProvider(
            key: 'AIzaSyCw7l8ZOZOWvkQhi1hLTxH90a6CJo5ZzaI',
            model: 'gemini-embedding-001'
        );
    }
     protected function vectorStore(): VectorStoreInterface
    {
        return  new PineconeVectorStore(
            key: 'pcsk_e7Quv_AeQaRrttNQxWStW9KJGquWFQNLjoneyb7x4G7MKv8xFiNVjFaYbysx4Cz3xH5RY',
            indexUrl: 'https://digital-crop-cmzbu6b.svc.aped-4627-b74a.pinecone.io'
        );
    }
    protected function chatHistory():ChatHistoryInterface
    {
        return new EloquentChatHistory(
            threadId: 'THREAD_ID',
            modelClass: ChatMessage::class,
            contextWindow: 50000
        );
    }

    /**
     * @return ToolInterface[]|ToolkitInterface[]
     */
    protected function tools(): array
    {
        return [];
    }
}
