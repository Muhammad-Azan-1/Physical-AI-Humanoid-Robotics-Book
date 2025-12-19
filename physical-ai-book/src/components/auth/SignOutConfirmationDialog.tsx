import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface SignOutConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const SignOutConfirmationDialog: React.FC<SignOutConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  const modalContent = (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--ifm-background-surface-color, #ffffff)',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
          maxWidth: '380px',
          width: '100%',
          padding: '32px',
          border: '1px solid var(--ifm-border-color, #e5e7eb)',
          textAlign: 'center' as const,
        }}
      >
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>
          👋
        </div>

        <h3 style={{
          fontSize: '22px',
          fontWeight: 700,
          color: 'var(--ifm-heading-color, #1f2937)',
          margin: '0 0 12px 0',
        }}>
          Sign Out?
        </h3>

        <p style={{
          fontSize: '15px',
          color: 'var(--ifm-font-color-secondary, #6b7280)',
          margin: '0 0 28px 0',
          lineHeight: 1.6,
        }}>
          Are you sure you want to sign out? You'll need to sign in again to access your account.
        </p>

        <div style={{
          display: 'flex',
          gap: '12px',
        }}>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1,
              padding: '14px 20px',
              borderRadius: '12px',
              border: '1px solid var(--ifm-border-color, #e5e7eb)',
              backgroundColor: 'transparent',
              color: 'var(--ifm-font-color-base, #374151)',
              fontSize: '15px',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              fontFamily: 'inherit',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1,
              padding: '14px 20px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              fontSize: '15px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              fontFamily: 'inherit',
            }}
          >
            {loading ? 'Signing Out...' : 'Sign Out'}
          </button>
        </div>
      </div>
    </div>
  );

  // Use portal to render at document body level
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return null;
};

export default SignOutConfirmationDialog;