"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
  showAlert: (title: string, message: string) => void;
  showConfirm: (title: string, message: string) => Promise<boolean>;
  showPrompt: (title: string, message: string) => Promise<string | null>;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [modalType, setModalType] = useState<'alert' | 'confirm' | 'prompt' | null>(null);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const [promptInput, setPromptInput] = useState('');
  
  const [resolvePromise, setResolvePromise] = useState<((val: any) => void) | null>(null);

  const showAlert = (title: string, message: string) => {
    setModalContent({ title, message });
    setModalType('alert');
  };

  const showConfirm = (title: string, message: string): Promise<boolean> => {
    setModalContent({ title, message });
    setModalType('confirm');
    return new Promise((resolve) => {
      setResolvePromise(() => resolve);
    });
  };

  const showPrompt = (title: string, message: string): Promise<string | null> => {
    setPromptInput('');
    setModalContent({ title, message });
    setModalType('prompt');
    return new Promise((resolve) => {
      setResolvePromise(() => resolve);
    });
  };

  const handleClose = (value: any = null) => {
    setModalType(null);
    if (resolvePromise) {
      resolvePromise(value);
      setResolvePromise(null);
    }
  };

  return (
    <UIContext.Provider value={{ showAlert, showConfirm, showPrompt }}>
      {children}
      {modalType && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full border border-gray-100 animate-scaleIn">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{modalContent.title}</h3>
            <p className="text-gray-600 mb-6">{modalContent.message}</p>
            
            {modalType === 'prompt' && (
              <input
                type="text"
                autoFocus
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl mb-6 focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
              />
            )}
            
            <div className="flex justify-end gap-3">
              {(modalType === 'confirm' || modalType === 'prompt') && (
                <button 
                  onClick={() => handleClose(modalType === 'confirm' ? false : null)} 
                  className="px-5 py-2.5 rounded-xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              )}
              
              {modalType === 'alert' && (
                <button 
                  onClick={() => handleClose()} 
                  className="px-5 py-2.5 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition"
                >
                  OK
                </button>
              )}
              
              {modalType === 'confirm' && (
                <button 
                  onClick={() => handleClose(true)} 
                  className="px-5 py-2.5 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition"
                >
                  Confirm
                </button>
              )}
              
              {modalType === 'prompt' && (
                <button 
                  onClick={() => handleClose(promptInput)} 
                  className="px-5 py-2.5 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </UIContext.Provider>
  );
}

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within UIProvider');
  return context;
};
