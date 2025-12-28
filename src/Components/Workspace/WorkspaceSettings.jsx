import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Mail } from 'lucide-react';

export default function WorkspaceSettings({ shareModal, onClose, onShare }) {
  const [shareEmail, setShareEmail] = useState('');
  const [sharePermission, setSharePermission] = useState('view');
  const modalRef = useRef(null);

  const handleClose = useCallback(() => {
    setShareEmail('');
    setSharePermission('view');
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        handleClose();
      }
    };

    if (shareModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [shareModal, handleClose]); 

  const handleSubmit = () => {
    onShare(shareEmail, sharePermission);
    handleClose();
  };

  if (!shareModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-xl shadow-2xl w-96 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Share {shareModal.type}
          </h3>
          <button onClick={handleClose}>
            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border rounded-lg"
                placeholder="user@example.com"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Permission
            </label>
            <select
              value={sharePermission}
              onChange={(e) => setSharePermission(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="view">View only</option>
              <option value="edit">Can edit</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!shareEmail}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
