<?php

namespace App\AiAgents;

use LarAgent\Agent;

class WeatherAgent extends Agent
{
    protected $model = 'gemini-3-flash-preview';


    protected $history = 'in_memory';

    protected $provider = 'gemini_native';

    protected $tools = [];

    public function instructions()
    {
        return "Define your agent's instructions here.";
    }

    public function prompt($message)
    {
        return $message;
    }
}
