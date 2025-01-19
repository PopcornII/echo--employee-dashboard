import React from 'react';
import DocumentCard from './DocumentCard';


interface Document {
  id: number;
  title: string;
  description: string;
  img_url: string | null;
  file_url: string;
  created_at: string | null;
}

interface DocumentGridProps {
  documents: Document[];
  userId: number;
}

const DocumentGrid: React.FC<DocumentGridProps> = ({ documents, userId }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 no-scrollbar">
      {documents.map((doc) => (
        <DocumentCard key={doc.id} document={doc} userId={userId}/>
      ))}
    </div>
  );
};

export default DocumentGrid;
