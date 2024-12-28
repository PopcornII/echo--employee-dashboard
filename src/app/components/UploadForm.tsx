'use client';

export default function UploadForm() {
  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const response = await fetch('/api/documents/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    console.log(result);
  };

  return (
    <form onSubmit={handleUpload}>
      <input type="file" name="file" accept="image/png, image/jpeg, application/pdf" />
      <button type="submit">Upload</button>
    </form>
  );
}
