'use client';

import React, {useEffect, useState} from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { formatDate } from '@/app/components/FormatDate';

interface DocumentItem {
  id: number;
  title: string;
  description: string;
  img_url: string | null;
  file_url: string;
  created_at: string;
}

interface DocumentTableProps {
  documents: DocumentItem[];
  onEdit: (id : number) => void;
  onDelete: (id: number) => void;
  onCreate: () => void;

}

const DocumentTable: React.FC<DocumentTableProps> = ({ documents, onEdit, onDelete, onCreate }) => {
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentItem[]>(documents);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    setFilteredDocuments(documents); 
  }, [documents]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredDocuments(documents);
    } else {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = documents.filter(
        (doc) =>
          doc.title.toLowerCase().includes(lowerCaseQuery) ||
          doc.description.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredDocuments(filtered);
    }
  };

  return (
    <div className="flex flex-col p-2 bg-white rounded-lg shadow-md justify-between">
      {/* Search Input */}
      <div className="mb-4 justify-between flex">
        <input
          type="text"
          placeholder="Search by title or description"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="p-2 ml-4 border border-gray-300 rounded-lg sm:w-64 lg:w-72"
        />
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mr-4 rounded-lg "
          onClick={onCreate}
          >
          New
        
          </button>
      </div>


      {/* Document Table */}
      <div className="max-h-[450px] overflow-y-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead className="sticky top-0 bg-white">
            <tr>
              <th className="border-b p-2 text-left">No</th>
              <th className="border-b p-2 text-left">Title</th>
              <th className="border-b p-2 text-left">Description</th>
              <th className="border-b p-2 text-left">Image</th>
              <th className="border-b p-2 text-left">File</th>
              <th className="border-b p-2 text-left">Public Date</th>
              <th className="border-b p-2 text-left">Operations</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((document, index) => (
                <tr key={document.id}>
                  <td className="border-b p-2">{index + 1}</td>
                  <td className="border-b p-2">{document.title}</td>
                  <td className="border-b p-2">{document.description}</td>
                  <td className="border-b p-2">
                    {document.img_url ? (
                      <img
                        src={document.img_url}
                        alt="Document"
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td className="border-b p-2">
                    <a href={document.file_url} download>
                      {document.file_url.split('/').pop() || 'Download File'}
                    </a>
                  </td>
                  <td className="border-b p-2">{formatDate(document.created_at)}</td>
                  <td className="border-b p-7 flex space-x-2">
                    <button
                      onClick={() => onEdit(document.id)}
                      className="text-blue-500 hover:underline"
                      aria-label={`Edit ${document.title}`}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => onDelete(document.id)}
                      className="text-red-500 hover:underline"
                      aria-label={`Delete ${document.title}`}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  No documents found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentTable;
