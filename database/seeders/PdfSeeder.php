<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use NeuronAI\RAG\DataLoader\FileDataLoader;
use NeuronAI\RAG\Embeddings\GeminiEmbeddingsProvider;
use NeuronAI\RAG\Splitter\DelimiterTextSplitter;
use NeuronAI\RAG\Splitter\SentenceTextSplitter;
use App\Neuron\MyRAG;
use NeuronAI\RAG\VectorStore\PineconeVectorStore;

class PdfSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $embedder = new GeminiEmbeddingsProvider(
            key: 'AIzaSyCw7l8ZOZOWvkQhi1hLTxH90a6CJo5ZzaI',
            model: 'gemini-embedding-001'
        );
        $store = new PineconeVectorStore(
            key: 'pcsk_e7Quv_AeQaRrttNQxWStW9KJGquWFQNLjoneyb7x4G7MKv8xFiNVjFaYbysx4Cz3xH5RY',
            indexUrl: 'https://digital-crop-cmzbu6b.svc.aped-4627-b74a.pinecone.io'
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
    $store->addDocuments($db);
    

        $this->command->info('PDF Loaded: ' . count($documents) . ' documents found.');
    }
}
