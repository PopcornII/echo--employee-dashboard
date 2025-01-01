
'use client';

import React, {useState, useEffect} from 'react';
import Layout from './components/Layout';
import Hero from './components/Hero';
import Card from './components/Card';

const HomePage = () => {
  const [documents, setDocuments] = useState([]); // List of documents from the API
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search query
  const [filteredDocuments, setFilteredDocuments] = useState<any[]>([]); // Filtered documents


   // Fetch data from an API
   useEffect(() => {
    const fetchDocuments = async () => {
      const response = await fetch('/api/mock-data');
      const data = await response.json();
      setDocuments(data.data.documents);
    };

    fetchDocuments();
  }, []);

   // Handle search
   const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter documents based on the search query
    const filtered = documents.filter((doc) =>
      doc.title.toLowerCase().includes(query)
    );
    setFilteredDocuments(filtered);
  };



  return (
    <Layout>
    <Hero title="Documents" subtitle="Read as Your Effort" />
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Documents</h2>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search documents..."
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div
          className="border border-gray-300 rounded overflow-auto"
          style={{ maxHeight: '500px' }} // Scrollable frame
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} title={doc.title} description={doc.description} />
            ))}
            {filteredDocuments.length === 0 && (
              <p className="text-gray-500 text-center w-full">No documents found.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  </Layout>
  );
};

export default HomePage;
