<?php

namespace Database\Seeders;

use App\Services\QdrantSearchService;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Smalot\PdfParser\Parser;

class PdfSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pdfFiles = glob(storage_path('pdfs/*.pdf'));

        $parser = new Parser();
        $searchService = new QdrantSearchService();

        foreach ($pdfFiles as $index => $file) {
            $pdf = $parser->parseFile($file);
            $text = $pdf->getText();

            $document = [
                'id' => 'pdf_' . ($index + 1),
                'title' => pathinfo($file, PATHINFO_FILENAME),
                'content' => $text,
            ];

            $searchService->importDocumentToCollection($document, 'pdf_collection');
        }

        $this->command->info('PDFs seeded to Pinecone successfully!');
    }
}
