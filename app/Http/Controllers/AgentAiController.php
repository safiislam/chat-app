<?php

namespace App\Http\Controllers;

use App\AiAgents\SupportAgent;
use App\AiAgents\WeatherAgent;
use App\Neuron\MyAgent;
use Illuminate\Http\Request;
use NeuronAI\Chat\Messages\UserMessage;
use NeuronAI\RAG\DataLoader\FileDataLoader;
use NeuronAI\RAG\Embeddings\GeminiEmbeddingsProvider;
use NeuronAI\RAG\Splitter\DelimiterTextSplitter;
use NeuronAI\RAG\VectorStore\PineconeVectorStore;
use NeuronAI\RAG\VectorStore\VectorStoreInterface;
use \Probots\Pinecone\Client as Pinecone;

class AgentAiController
{
    protected array $vectorStoreFilters = [];
    /**
     * Display a listing of the resource.
     */
    public function chat(Request $request)
    {
        $message = $request->input('message');

        $reply = MyAgent::make()->chat(
            new UserMessage($message),
        );

        return response([
            'user' => $message,
            'ai' => $reply->getContent()
        ]);
    }
    protected function vectorStore(): VectorStoreInterface
    {
        $store = new PineconeVectorStore(
            key: 'pcsk_e7Quv_AeQaRrttNQxWStW9KJGquWFQNLjoneyb7x4G7MKv8xFiNVjFaYbysx4Cz3xH5RY',
            indexUrl: 'https://web-data-cmzbu6b.svc.aped-4627-b74a.pinecone.io'
        );

        return $store->withFilters($this->vectorStoreFilters);
    }
    public function addVectorStoreFilters(array $filters): self
    {
        $this->vectorStoreFilters = $filters;
        return $this;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
