import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const UPLOAD_LIMIT = 1024 * 1024 * 1024; // 1GB dalam bytes

export default function CDNUpload() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');
  const [totalUploaded, setTotalUploaded] = useState(0);

  const handleUserClick = () => {
    // Implementasi logika untuk mengarahkan ke halaman login/register
    alert('Arahkan ke halaman login/register');
  };

  const handleHomeClick = () => {
    // Implementasi logika untuk kembali ke halaman utama
    router.push('/');
  };

  useEffect(() => {
    // Cek apakah halaman baru saja di-refresh
    const isPageFreshlyLoaded = !sessionStorage.getItem('app_loaded');

    if (isPageFreshlyLoaded) {
      // Reset semua state
      setFile(null);
      setUploading(false);
      setUploadedFileUrl('');
      setTotalUploaded(0);

      // Set flag bahwa halaman sudah dimuat
      sessionStorage.setItem('app_loaded', 'true');
    } else {
      // Jika bukan refresh, gunakan nilai acak seperti sebelumnya
      setTotalUploaded(Math.floor(Math.random() * UPLOAD_LIMIT));
    }

    // Cleanup function untuk menghapus flag saat komponen unmount
    return () => {
      sessionStorage.removeItem('app_loaded');
    };
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Silakan pilih file terlebih dahulu');
      return;
    }

    if (totalUploaded + file.size > UPLOAD_LIMIT) {
      alert('Ukuran file melebihi batas upload yang tersisa');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadedFileUrl(response.data.fileUrl);
      setTotalUploaded(prevTotal => prevTotal + file.size);
      alert('File berhasil diunggah!');
    } catch (error) {
      console.error('Kesalahan saat mengunggah file:', error);
      alert('Terjadi kesalahan saat mengunggah file');
    } finally {
      setUploading(false);
    }
  };

  const uploadPercentage = (totalUploaded / UPLOAD_LIMIT) * 100;

  return (
    <div className="cdn-upload-container">
      <div className="button-container">
        <button className="home-button" onClick={handleHomeClick}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </button>
        <button className="user-button" onClick={handleUserClick}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
        </button>
      </div>
      <div className="cdn-upload-form">
        <h1 className="cdn-upload-title">Unggah File ke CDN</h1>
        <div>
          <label className="file-input-label">
            <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
            </svg>
            <span>Pilih file</span>
            <input type='file' style={{ display: 'none' }} onChange={handleFileChange} />
          </label>
          {file && (
            <div className="file-info">
              <p>Nama file: {file.name}</p>
              <p>Ukuran: {formatFileSize(file.size)}</p>
            </div>
          )}
          <div className="upload-limit-bar">
            <div className="upload-limit-progress" style={{ width: `${uploadPercentage}%` }}></div>
          </div>
          <p className="upload-limit-text">
            {formatFileSize(totalUploaded)} / {formatFileSize(UPLOAD_LIMIT)} terpakai
          </p>
          <button
            onClick={handleUpload}
            disabled={uploading || !file || totalUploaded + (file?.size || 0) > UPLOAD_LIMIT}
            className="upload-button"
          >
            {uploading ? 'Mengunggah...' : 'Unggah'}
          </button>
        </div>
        {uploadedFileUrl && (
          <div className="uploaded-file-info">
            <p>File berhasil diunggah. URL:</p>
            <a href={uploadedFileUrl} target="_blank" rel="noopener noreferrer">
              {uploadedFileUrl}
            </a>
          </div>
        )}
      </div>

      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          overflow-x: hidden;
        }
      `}</style>

      <style jsx>{`
        .cdn-upload-container {
          min-height: 100vh;
          width: 100vw;
          background: linear-gradient(to bottom right, #e6f2ff, #e6e6ff);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          margin: 0;
          box-sizing: border-box;
          position: relative;
        }

        .cdn-upload-form {
          max-width: 28rem;
          width: 100%;
          background-color: white;
          padding: 2.5rem;
          border-radius: 0.75rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .cdn-upload-title {
          font-size: 1.875rem;
          font-weight: 800;
          text-align: center;
          color: #4f46e5;
          margin-bottom: 2rem;
        }

        .upload-limit-bar {
          width: 100%;
          height: 0.5rem;
          background-color: #e5e7eb;
          border-radius: 0.25rem;
          overflow: hidden;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }

        .upload-limit-progress {
          height: 100%;
          background-color: #4f46e5;
          transition: width 0.3s ease;
        }

        .upload-limit-text {
          text-align: center;
          font-size: 0.875rem;
          color: #4b5563;
          margin-bottom: 1rem;
        }

        .file-input-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1.5rem 1rem;
          background-color: white;
          color: #4f46e5;
          border: 2px solid #4f46e5;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .file-input-label:hover {
          background-color: #4f46e5;
          color: white;
        }

        .file-input-label svg {
          width: 1.5rem;
          height: 1.5rem;
        }

        .file-input-label span {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          text-transform: uppercase;
        }

        .file-info {
          margin-top: 1rem;
          text-align: center;
          font-size: 0.875rem;
          color: #4b5563;
        }

        .file-info p {
          margin: 0.25rem 0;
        }

        .upload-button {
          width: 100%;
          padding: 0.5rem 1rem;
          margin-top: 1rem;
          background-color: #4f46e5;
          color: white;
          border: none;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .upload-button:hover:not(:disabled) {
          background-color: #4338ca;
        }

        .upload-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .uploaded-file-info {
          margin-top: 2rem;
          text-align: center;
        }

        .uploaded-file-info p {
          font-size: 1.125rem;
          font-weight: 600;
          color: #4b5563;
        }

        .uploaded-file-info a {
          color: #4f46e5;
          word-break: break-all;
        }

        .uploaded-file-info a:hover {
          color: #4338ca;
        }

        .button-container {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: flex;
          gap: 0.5rem;
        }

        .home-button,
        .user-button {
          background: none;
          border: 2px solid #4f46e5;
          border-radius: 10px;
          cursor: pointer;
          color: #4f46e5;
          transition: all 0.3s ease;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .home-button:hover,
        .user-button:hover {
          color: white;
          background-color: #4f46e5;
        }

        .home-button svg,
        .user-button svg {
          width: 1.5rem;
          height: 1.5rem;
        }
      `}</style>
    </div>
  );
}