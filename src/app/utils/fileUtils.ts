/**
 * Get the extension of a file from its name.
 * @param {string} filename - The name of the file.
 * @returns {string} - The file extension.
 */
export const getFileExtension = (filename) => {
    if (!filename) return '';
    return filename.split('.').pop().toLowerCase();
};

/**
 * Check if the file type is valid.
 * @param {File} file - The file object.
 * @param {string[]} allowedTypes - An array of allowed MIME types.
 * @returns {boolean} - True if the file type is valid, otherwise false.
 */
export const isFileValid = (file, allowedTypes) => {
    return file && allowedTypes.includes(file.type);
};

/**
 * Format file size into a readable string.
 * @param {number} bytes - File size in bytes.
 * @param {number} decimals - Number of decimals to include.
 * @returns {string} - Formatted file size.
 */
export const formatFileSize = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

/**
 * Generate a unique file name for uploads to avoid conflicts.
 * @param {string} filename - The original file name.
 * @returns {string} - A unique file name.
 */
export const generateUniqueFileName = (filename) => {
    const extension = getFileExtension(filename);
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    return `${uniqueId}.${extension}`;
};
