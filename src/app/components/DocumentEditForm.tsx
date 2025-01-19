'use client';

import React, { useEffect, useState } from 'react';
import { message } from 'antd';

interface DocumentEditFormProps {
  documentId: number; 
  onDocumentUpload: (newDoc:any) => void;
  onClose: () => void;
  onSuccess: () => void; // Callback after successful update
  selectedDocument: {
    title: string;
    description: string;
    file_url: string;
    img_url: string | null;
  } | null;

}

const DocumentEditForm: React.FC<DocumentEditFormProps> = ({ documentId, onDocumentUpload, selectedDocument, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null as File | null,
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (selectedDocument) {
      setFormData({
        title: selectedDocument.title || '',
        description: selectedDocument.description || '',
        file: null,
        image: null,
      });
      setImagePreview(selectedDocument.img_url || null);
    }
  }, [selectedDocument]);
  
  //console.log('Form Data:', formData);
   
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFormData((prev) => ({ ...prev, [name]: selectedFile }));

      if (name === 'image') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataObj = new FormData();
    formDataObj.append('title', formData.title);
    formDataObj.append('description', formData.description);

    if (formData.file) {
      formDataObj.append('file', formData.file);
    }
    if (formData.image) {
      formDataObj.append('image', formData.image);
    }

    try {
      const response = await fetch(`api/documents/id?id=${documentId}`, {
        method: 'PUT',
        body: formDataObj,
      });

      if (response.ok) {
        const result = await response.json();
        onDocumentUpload(result.document);
        onSuccess();
        onClose();
      }
      
    } catch (error) {
      console.error('Update failed:', error);
     
    }
  };

  return (
    <>
      <form
        className="bg-white p-6 rounded shadow-md mb-6 w-full"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <span className="text-2xl font-bold mb-4">✏️ Edit Document</span>
        <div className="mb-4">
          <label className="block text-m text-gray-700" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            maxLength={25}
            required
            className="mt-2 block w-full border-gray-300 rounded-mg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-0 bg-gray-200 sm:text-sm/6"
          />
          <p className="text-xs text-gray-500">Max 25 characters.</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            maxLength={255}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="text-xs text-gray-500">Max 255 characters.</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="file">
            Document (PDF)
          </label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleFileChange}
            accept="application/pdf"
            className="mt-1 block w-full text-gray-500"
          />
          {formData.file && <p className="text-xs text-gray-500">Selected file: {formData.file.name}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="image">
            Image (PNG/JPEG)
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleFileChange}
            accept="image/png, image/jpeg"
            className="mt-1 block w-full text-gray-500"
          />
          {formData.image && (
            <>
              <p className="text-xs text-gray-500">Selected image: {formData.image.name}</p>
              <img
                src={imagePreview!}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover border rounded-md"
              />
            </>
          )}
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg mr-2 w-24"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-24 bg-indigo-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-600"
          >
            Update
          </button>
        </div>
      </form>
    </>
  );
};

export default DocumentEditForm;
