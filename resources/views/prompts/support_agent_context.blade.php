# Context

The following documents from our knowledge base may be relevant to the user's question:



@foreach($documents as $index => $doc)
    ## Document {{ $index + 1 }}: {{ $doc['payload']['title'] ?? 'Untitled' }}

    {{ $doc['payload']['content'] ?? '' }}

    ---
@endforeach


Use this context to answer the user's question accurately. If the context doesn't contain relevant information, let the
user know.