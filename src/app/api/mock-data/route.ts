export async function GET(request) {
    const documents = [
      { id: 1, title: 'Document 1', description: 'Description of Document 1' },
      { id: 2, title: 'Document 2', description: 'Description of Document 2' },
      { id: 3, title: 'Document 3', description: 'Description of Document 3' },
      { id: 4, title: 'Document 4', description: 'Description of Document 4' },
      { id: 5, title: 'Document 5', description: 'Description of Document 5' },
      { id: 6, title: 'Document 6', description: 'Description of Document 6' },
    ];
  
    return new Response(JSON.stringify({ status: "success", data: { documents } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  