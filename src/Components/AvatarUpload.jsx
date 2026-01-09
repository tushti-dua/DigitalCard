import React from 'react';
import { Icons } from './Icons';

const AvatarUpload = ({ preview, onImageChange }) => (
  <div className="d-flex align-items-center mb-5 fade-up delay-1">
    <div className="position-relative me-4">
      <div className="avatar-frame">
        {preview ? (
          <img src={preview} alt="Profile" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        ) : (
          <Icons.User />
        )}
        <label htmlFor="avatar-upload" className="position-absolute bottom-0 end-0 bg-dark border border-secondary rounded-circle p-2 cursor-pointer shadow-sm" style={{cursor: 'pointer'}}>
          <Icons.Camera />
        </label>
      </div>
      <input id="avatar-upload" type="file" accept="image/*" onChange={onImageChange} hidden />
    </div>
    <div>
      <h5 className="text-white fw-bold mb-1">Profile Photo</h5>
      <p className="text-muted small mb-0">Recommended 400x400px</p>
    </div>
  </div>
);

export default AvatarUpload;