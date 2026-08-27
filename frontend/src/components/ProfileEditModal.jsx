import { useState, useRef } from 'react';
import { getAvatarGradient, getInitials, PRESET_AVATARS } from '../utils/avatar';
import { authAPI } from '../services/api';

function ProfileEditModal({ user, onClose, onUserUpdated }) {
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [showPresets, setShowPresets] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const fileInputRef = useRef(null);

  // Handle client-side compressed image upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Please choose an image under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 220;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setAvatar(compressedDataUrl);
        setShowPresets(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (emoji) => {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#1e1812"/><text x="50%" y="54%" font-size="52" text-anchor="middle" dominant-baseline="middle">${emoji}</text></svg>`;
    const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
    setAvatar(dataUri);
    setShowPresets(false);
  };

  const handleResetToAlphabet = () => {
    setAvatar('');
    setShowPresets(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const updatedUser = {
        ...(user || {}),
        name: name.trim() || user?.name || 'Guest Gourmet',
        avatar: avatar || '',
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));

      if (token) {
        try {
          await authAPI.updateProfile({ name: updatedUser.name, avatar: updatedUser.avatar }, token);
        } catch (apiErr) {
          console.warn('Profile cloud sync skipped:', apiErr.message);
        }
      }

      window.dispatchEvent(new Event('user-profile-updated'));
      if (onUserUpdated) onUserUpdated(updatedUser);

      setMsg('Profile picture updated successfully! ✨');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="custom-modal-overlay" onClick={onClose}>
      <div className="profile-edit-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="custom-modal-close" onClick={onClose}>
          &times;
        </button>

        <h3>Edit User Profile &amp; Picture</h3>
        <p className="modal-sub">Customize your profile photo or use your dynamic name initials.</p>

        {msg ? (
          <div className="review-success-box">{msg}</div>
        ) : (
          <form onSubmit={handleSave} className="profile-edit-form">
            {/* Live Profile Avatar Preview */}
            <div className="profile-avatar-customizer">
              <div className="customizer-avatar-wrap">
                {avatar ? (
                  <img src={avatar} alt="Profile Preview" className="customizer-avatar-img" />
                ) : (
                  <div
                    className="customizer-avatar-initials"
                    style={{ background: getAvatarGradient(name || user?.name || 'Guest') }}
                  >
                    {getInitials(name || user?.name || 'Guest')}
                  </div>
                )}
              </div>

              <div className="customizer-actions-col">
                <span className="customizer-status-txt">
                  {avatar
                    ? 'Custom photo/avatar active'
                    : `Alphabet initials (${getInitials(name || user?.name || 'Guest')})`}
                </span>

                <div className="customizer-btn-group">
                  <button
                    type="button"
                    className="avatar-btn upload"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    📷 Upload Photo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />

                  <button
                    type="button"
                    className="avatar-btn presets"
                    onClick={() => setShowPresets(!showPresets)}
                  >
                    🎨 Choose Icon
                  </button>

                  {avatar && (
                    <button
                      type="button"
                      className="avatar-btn reset"
                      onClick={handleResetToAlphabet}
                      title="Switch to alphabet initials badge"
                    >
                      🔤 Use Initials
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Presets Drawer */}
            {showPresets && (
              <div className="avatar-presets-drawer">
                <div className="presets-header">
                  <span>Choose an avatar:</span>
                  <button
                    type="button"
                    className="close-presets-btn"
                    onClick={() => setShowPresets(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className="presets-grid">
                  {PRESET_AVATARS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      className="preset-chip"
                      onClick={() => handleSelectPreset(p.emoji)}
                      title={p.label}
                    >
                      <span className="preset-emoji">{p.emoji}</span>
                      <span className="preset-name">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Name Input */}
            <div className="form-group">
              <label>Display Name</label>
              <input
                type="text"
                required
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <button type="submit" className="submit-review-btn" disabled={saving}>
              {saving ? 'Saving Profile...' : 'Save Profile Changes ✨'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ProfileEditModal;
