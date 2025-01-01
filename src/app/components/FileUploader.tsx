import React, { useState } from 'react';

const FileUploader = ({ uploadUrl }) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const allowedMimeTypes = ['image/png', 'image/jpeg', 'application/pdf'];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        if (!selectedFile) {
            setError('No file selected');
            return;
        }

        // Validate file type
        if (!allowedMimeTypes.includes(selectedFile.type)) {
            setError(`Invalid file type. Allowed: PNG, JPEG, PDF`);
            return;
        }

        // Validate file size
        if (selectedFile.size > maxFileSize) {
            setError('File size exceeds 5MB');
            return;
        }

        setError(null);
        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) {
            setError('No file selected for upload');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Upload failed');
            }

            setSuccessMessage('File uploaded successfully');
            setFile(null);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <button onClick={handleUpload} disabled={!file}>
                Upload
            </button>
        </div>
    );
};

export default FileUploader;
