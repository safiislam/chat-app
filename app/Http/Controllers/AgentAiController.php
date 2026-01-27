<?php

namespace App\Http\Controllers;

use App\AiAgents\SupportAgent;
use App\AiAgents\WeatherAgent;
use Illuminate\Http\Request;
use NeuronAI\RAG\DataLoader\FileDataLoader;
use NeuronAI\RAG\Embeddings\GeminiEmbeddingsProvider;
use NeuronAI\RAG\Splitter\DelimiterTextSplitter;
use \Probots\Pinecone\Client as Pinecone;

class AgentAiController
{
    /**
     * Display a listing of the resource.
     */
    public function chat()
    {
        // $agent = SupportAgent::for('user-123');
        // $response = $agent->respond("who is  Adobe InDesign CS6 (Macintosh) author ");
        // return response()->json([
        //     'response' => $response
        // ]);
        // $pinecone = new Pinecone('pcsk_e7Quv_AeQaRrttNQxWStW9KJGquWFQNLjoneyb7x4G7MKv8xFiNVjFaYbysx4Cz3xH5RY', 'https://rag-project-cmzbu6b.svc.aped-4627-b74a.pinecone.io');
        // $response = $pinecone->control()->index('Safi')->createServerless(
        //     dimension: 768,
        //     metric: 'cosine',
        //     cloud: 'aws',
        //     region: 'us-east-1'
        //     // ... more options    
        // );
        // return response()->json([
        //     'response' => $response
        // ]);
        $embedder = new GeminiEmbeddingsProvider(
            key: 'AIzaSyC02_3q2QQBA61DtBVQRv-DU8iXQpehmjs',
            model: 'gemini-embedding-001'
        );

        $path = database_path('seeders/my-article.md');

        $documents = FileDataLoader::for($path)
        // ->addReader('pdf', new \NeuronAI\RAG\DataLoader\PdfReader())
          ->withSplitter(
        new DelimiterTextSplitter(
            maxLength: 400,
            separator: '.',
            wordOverlap: 0
        )
    )
    ->getDocuments();
    foreach($documents as $document) {
    $document->addMetadata('user_id', 1234);
}
 $db= $embedder->embedDocuments($documents);

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
