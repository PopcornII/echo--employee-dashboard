import React from 'react';

const DownloadButton = ({ documentId }: { documentId: number }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/documents/${documentId}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `document${documentId}.pdf`; // Use the correct file name here
        link.click();
      } else {
        console.error('Error downloading document');
      }
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  return (
    <button onClick={handleDownload}>
      Download Document
    </button>
  );
};

export default DownloadButton;
