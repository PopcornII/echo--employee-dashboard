
'use client';


// components/Upload.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

interface UploadForm {
  file: React.FormEvent<HTMLInputElement>;
}

interface UploadFormValues {
  file: File | null;
}

const Upload: React.FC = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<UploadFormValues>();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: UploadFormValues) => {
    try {
      const formData = new FormData();
      formData.append('file', data.file as File);

      const res = await fetch('/api/test-upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      router.push('/success'); // Redirect on success
    } catch (err) {
      setError('Upload failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="file" {...register('file', { required: true })} />
      <button type="submit">Upload</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default Upload;