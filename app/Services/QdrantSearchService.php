<?php

declare(strict_types=1);

namespace App\Services;

use GuzzleHttp\Client;

class QdrantSearchService
{
    protected Client $pinecone;
    protected string $pineconeIndex;
    protected string $pineconeApiKey;
    protected string $pineconeEnv;
    protected string $geminiApiKey;

    public function __construct()
    {
        // Pinecone API Key and Index Host
        $pineconeApiKey = 'pcsk_e7Quv_AeQaRrttNQxWStW9KJGquWFQNLjoneyb7x4G7MKv8xFiNVjFaYbysx4Cz3xH5RY';
        $pineconeIndexHost = 'web-data-cmzbu6b.svc.aped-4627-b74a.pinecone.io';

        $this->pinecone = new Client([
            'base_uri' => "https://{$pineconeIndexHost}/",
            'headers' => [
                'Api-Key' => $pineconeApiKey,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                'X-Pinecone-Api-Version' => '2025-10',
            ],
            'timeout' => 30,
            'connect_timeout' => 10,
        ]);
    }

    public function convertToEmbeddings(string $text): array
    {
        // Create HTTP client pointing to the correct Gemini API base
        $http = new Client([
            'base_uri' => 'https://generativelanguage.googleapis.com/v1beta/',
            'headers' => [
                'x-goog-api-key' => 'AIzaSyAmZI0CqpZM3695f4V7bZ5gb9uJbP2hKjI',
                'Content-Type' => 'application/json',
            ],
        ]);

        // Call the embedContent endpoint
        $response = $http->post("models/gemini-embedding-001:embedContent", [
            'json' => [
                'content' => [
                    'parts' => [
                        ['text' => $text],
                    ],
                ],
                'outputDimensionality' => 768,
            ],
        ]);

        $data = json_decode($response->getBody()->getContents(), true);

        // Return the vector (array of floats)
        return $data['embedding']['values'] ?? [];
    }


    public function importDocumentToCollection(array $document, string $collectionName): bool
    {
        $vector = $this->convertToEmbeddings($document['content']);

        $body = [
            'vectors' => [
                [
                    'id' => $document['id'],
                    'values' => $vector,
                    'metadata' => [
                        'title' => $document['title'],
                        'content' => $document['content'],
                    ],
                ],
            ],
        ];

        $this->pinecone->post("/vectors/upsert", ['json' => $body]);

        return true;
    }

    public function search(string $query, int $limit = 10): array
    {
        $queryVector = $this->convertToEmbeddings($query);

        $body = [
            'vector' => $queryVector,
            'topK' => $limit,
        ];

        $response = $this->pinecone->post("/query", ['json' => $body]);
        $results = json_decode($response->getBody()->getContents(), true);
        $documents = [];

        foreach ($results['matches'] ?? [] as $match) {
            $documents[] = [
                'id' => $match['id'],
                'score' => $match['score'],
                'payload' => $match['metadata'] ?? [],
            ];
        }

        return $documents;
    }
}
