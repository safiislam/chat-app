<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use NeuronAI\RAG\DataLoader\FileDataLoader;
use NeuronAI\RAG\Splitter\SentenceTextSplitter;
use App\Neuron\MyRAG;

class PdfSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $path = database_path('seeders/book.pdf');

        MyRAG::make()->addDocuments(
        $documents = FileDataLoader::for($path)
    ->addReader('pdf', new \NeuronAI\RAG\DataLoader\PdfReader())
    ->getDocuments()
    );
    dd($documents);
    

        $this->command->info('PDF Loaded: ' . count($documents) . ' documents found.');
    }
}
