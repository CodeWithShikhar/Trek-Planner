import React, { useState } from 'react';
import api from '../api';
import { toast } from 'react-toastify';

const ImageUploader = ({ images, onChange }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = (e.target.files || [])[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/uploads/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const newUrl = res.data.url;
      onChange(newUrl ? [newUrl] : []);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Image upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const currentImage = images && images[0];

  return (
    <div className="image-uploader">
      <label>
        Trek Image
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>
      {uploading && <p>Uploading...</p>}
      {currentImage && (
        <div className="single-image-preview">
          <img src={currentImage} alt="trek" width={120} />
          <button
            type="button"
            className="image-remove-button"
            onClick={() => onChange([])}
          >
            Change / Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
