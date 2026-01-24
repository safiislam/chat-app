<?php

namespace App\AiAgents;

use LarAgent\Agent;
use App\Services\QdrantSearchService;
use LarAgent\Messages\DeveloperMessage;

class SupportAgent extends Agent
{
    protected $model = 'gemini-3-flash-preview';

    protected $history = 'in_memory';

    protected $provider = 'gemini_native';

    protected $tools = [];

    public function instructions()
    {
        return view('prompts.support_agent_instructions', [
            'date' => now()->format('F j, Y'),
            'user' => auth()->user(),
        ])->render();
    }

    public function prompt($message)
    {
        $searchService = new QdrantSearchService();
        $documents = $searchService->search($message, limit: 3);
        if (!empty($documents)) {
            $context = view('prompts.support_agent_context', [
                'documents' => $documents,
            ])->render();

            // Add context as a developer message
            $devMsg = new DeveloperMessage($context);
            $this->chatHistory()->addMessage($devMsg);
        }
        return $message;
    }
}
