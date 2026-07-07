'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';
import Input from './Input';

const DialogContext = createContext(null);

export const useConfirmDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useConfirmDialog must be used within DialogProvider');
  }
  return context;
};

export const DialogProvider = ({ children }) => {
  const [dialog, setDialog] = useState(null);

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      setDialog({
        type: 'confirm',
        title: options.title || 'Confirm Action',
        message: options.message || 'Are you sure?',
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        variant: options.variant || 'danger',
        onConfirm: () => {
          setDialog(null);
          resolve(true);
        },
        onCancel: () => {
          setDialog(null);
          resolve(false);
        },
      });
    });
  }, []);

  const prompt = useCallback((options) => {
    return new Promise((resolve) => {
      setDialog({
        type: 'prompt',
        title: options.title || 'Enter Value',
        message: options.message || 'Please enter a value:',
        placeholder: options.placeholder || '',
        defaultValue: options.defaultValue || '',
        confirmText: options.confirmText || 'Submit',
        cancelText: options.cancelText || 'Cancel',
        onConfirm: (value) => {
          setDialog(null);
          resolve(value);
        },
        onCancel: () => {
          setDialog(null);
          resolve(null);
        },
      });
    });
  }, []);

  const close = useCallback(() => {
    setDialog(null);
  }, []);

  return (
    <DialogContext.Provider value={{ confirm, prompt, close }}>
      {children}
      {dialog && <DialogContainer dialog={dialog} />}
    </DialogContext.Provider>
  );
};

const DialogContainer = ({ dialog }) => {
  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {dialog.type === 'confirm' ? (
        <ConfirmDialogContent dialog={dialog} />
      ) : (
        <PromptDialogContent dialog={dialog} />
      )}
    </div>,
    document.body
  );
};

const ConfirmDialogContent = ({ dialog }) => {
  const variantStyles = {
    danger: {
      icon: 'bg-red-100 text-red-600',
      iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      button: 'primary',
    },
    warning: {
      icon: 'bg-yellow-100 text-yellow-600',
      iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      button: 'primary',
    },
    info: {
      icon: 'bg-blue-100 text-blue-600',
      iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      button: 'primary',
    },
  };

  const style = variantStyles[dialog.variant] || variantStyles.info;

  return (
    <div
      className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scaleIn"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-6">
        {/* Icon */}
        <div className={`w-16 h-16 ${style.icon} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={style.iconPath} />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-center text-[var(--color-brand-accent)] mb-3">
          {dialog.title}
        </h3>

        {/* Message */}
        <p className="text-center text-[var(--color-text-secondary)] mb-6 leading-relaxed">
          {dialog.message}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={dialog.onCancel}
          >
            {dialog.cancelText}
          </Button>
          <Button
            variant={style.button}
            size="lg"
            className="flex-1"
            onClick={dialog.onConfirm}
          >
            {dialog.confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

const PromptDialogContent = ({ dialog }) => {
  const [value, setValue] = useState(dialog.defaultValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      dialog.onConfirm(value.trim());
    }
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scaleIn"
      onClick={(e) => e.stopPropagation()}
    >
      <form onSubmit={handleSubmit} className="p-6">
        {/* Icon */}
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-center text-[var(--color-brand-accent)] mb-2">
          {dialog.title}
        </h3>

        {/* Message */}
        {dialog.message && (
          <p className="text-center text-[var(--color-text-secondary)] mb-4">
            {dialog.message}
          </p>
        )}

        {/* Input */}
        <div className="mb-6">
          <Input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={dialog.placeholder}
            required
            autoFocus
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={dialog.onCancel}
          >
            {dialog.cancelText}
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="flex-1"
            disabled={!value.trim()}
          >
            {dialog.confirmText}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DialogProvider;
