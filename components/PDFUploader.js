import React, { useState } from "react";
import styles from './PDFUploader.module.css';

const PDFUploader = () => {
    const [pdfUrl, setPdfUrl] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [fileUrl, setFileUrl] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      setUploadSuccess(false);
  
      try {
        if (!pdfUrl) {
          throw new Error('Please provide a PDF URL.');
        }
  
        if (!isValidUrl(pdfUrl)) {
          throw new Error('Please enter a valid URL.');
        }
  
        const response = await fetch('/api/downloadPDF', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pdfUrl }),
        });
        
        console.log("Response: ", response);
        if (!response.ok) {
          throw new Error('Failed to upload PDF. Please try again.');
        }
  
        const data = await response.json();
        setFileUrl(data.fileUrl);
        setUploadSuccess(true);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    const isValidUrl = (url) => {
      return url.startsWith('http://') || url.startsWith('https://');
    };
  
    return (
      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="pdfUrl" className={styles.label}>PDF URL:</label>
          <input
            type="text"
            id="pdfUrl"
            value={pdfUrl}
            onChange={(e) => setPdfUrl(e.target.value)}
            required
            className={styles.input}
          />
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Uploading...' : 'Upload PDF'}
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
        {uploadSuccess && (
          <p className={styles.success}>
            PDF successfully uploaded. Download link:{' '}
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
              {fileUrl}
            </a>
          </p>
        )}
      </div>
    );
  };
  
export default PDFUploader;
