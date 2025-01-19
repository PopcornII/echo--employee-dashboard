'use client';

import React, { useState } from 'react';
import { message } from 'antd';

interface DocumentFormProps {
  token: string; // JWT token for authenticated requests
  onDocumentUpload: (newDoc:any) => void; // Callback to update document list
  onClose: () => void; // Callback to close the form
  onSuccess: () => void; // Callback after successful upload
}


const DocumentPostForm: React.FC<DocumentFormProps> = ({ token, onDocumentUpload, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null as File | null,
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const selectedFile = files[0];

      // Validate file size (e.g., max 10MB for documents, 5MB for images)
      if ((name === 'file' && selectedFile.size > 10 * 1024 * 1024) || (name === 'image' && selectedFile.size > 5 * 1024 * 1024)) {
        message.error('File size exceeds the limit.');
        return;
      }

      setFormData((prev) => ({ ...prev, [name]: selectedFile }));

      // Generate a preview for image file
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
    formDataObj.append('file', formData.file!);

    if (formData.image) {
      formDataObj.append('image', formData.image);
    }

    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataObj,
      });

      if (response.ok) {
        const result = await response.json();
        onDocumentUpload(result.document);
        onSuccess();
        onClose();
      } else {
        const errorResponse = await response.json();
        console.log(errorResponse.message)
      }
    } catch (error) {
      console.error('Upload failed:', error);

      
    }
  };

  return (
    <form
      className="bg-white p-6 rounded shadow-md w-full"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <h2 className="text-2xl font-bold mb-4">📄 Post Document</h2>

      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          maxLength={25}
          required
          className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-200 sm:text-sm"
        />
        <p className="text-xs text-gray-500">Max 25 characters.</p>
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          maxLength={255}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
        <p className="text-xs text-gray-500">Max 255 characters.</p>
      </div>

      <div className="mb-4">
        <label htmlFor="file" className="block text-sm font-medium text-gray-700">
          Document (PDF)
        </label>
        <input
          type="file"
          id="file"
          name="file"
          onChange={handleFileChange}
          accept="application/pdf"
          required
          className="mt-1 block w-full text-gray-500"
        />
        {formData.file && <p className="text-xs text-gray-500">Selected file: {formData.file.name}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
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
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg mr-2"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-indigo-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-600"
        >
          Post
        </button>
      </div>
    </form>
  );
};

export default DocumentPostForm;
