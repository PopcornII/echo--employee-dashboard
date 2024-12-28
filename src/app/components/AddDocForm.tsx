import React, { useState } from 'react';

interface DocumentFormProps {
  token: string; // Token passed as a prop
}

const DocumentUploadForm: React.FC<DocumentFormProps> = ({ token }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null as File | null,
    image: null as File | null,
    uploaderId: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
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
    formDataObj.append('uploader_id', formData.uploaderId);

    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataObj,
      });

      const result = await response.json();

      if (response.ok) {
        alert('Document uploaded successfully');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload the document');
    }
  };

  return (
    <form
      className="max-w-md mx-auto bg-white p-6 rounded shadow-md"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <h2 className="text-2xl font-bold mb-4">Upload Document</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700" htmlFor="title">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
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
          required
          className="mt-1 block w-full text-gray-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700" htmlFor="image">
          Image (Optional, PNG/JPEG)
        </label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleFileChange}
          accept="image/png, image/jpeg"
          className="mt-1 block w-full text-gray-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700" htmlFor="uploaderId">
          Uploader ID
        </label>
        <input
          type="text"
          id="uploaderId"
          name="uploaderId"
          value={formData.uploaderId}
          onChange={handleChange}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-600"
      >
        Upload
      </button>
    </form>
  );
};

export default DocumentUploadForm;
