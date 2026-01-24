<?php

namespace App\Http\Controllers;

use App\AiAgents\SupportAgent;
use App\AiAgents\WeatherAgent;
use Illuminate\Http\Request;
use \Probots\Pinecone\Client as Pinecone;

class AgentAiController
{
    /**
     * Display a listing of the resource.
     */
    public function chat()
    {
        $agent = SupportAgent::for('user-123');
        $response = $agent->respond("who is  Adobe InDesign CS6 (Macintosh) author ");
        return response()->json([
            'response' => $response
        ]);
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
