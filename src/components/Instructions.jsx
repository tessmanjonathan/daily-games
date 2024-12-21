import React from 'react';
import { X } from 'lucide-react';

const Instructions = ({ 
  isOpen, 
  onClose, 
  title = "How to Play",
  children 
}) => {
  const handleCloseInstructions = (dontShowAgain) => {
    if (dontShowAgain) {
      localStorage.setItem('gamesAlwaysShowInstructions', 'false');
    }
    localStorage.setItem('gamesShowInstructions', 'false');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
        <button 
          onClick={() => handleCloseInstructions(false)}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        
        <div className="space-y-4">
          {children}
          
          <div className="mt-6 flex items-center gap-2">
            <input
              type="checkbox"
              id="dontShowAgain"
              className="rounded"
              onChange={(e) => handleCloseInstructions(e.target.checked)}
            />
            <label htmlFor="dontShowAgain" className="text-sm text-gray-600">
              Don't show instructions by default
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructions;