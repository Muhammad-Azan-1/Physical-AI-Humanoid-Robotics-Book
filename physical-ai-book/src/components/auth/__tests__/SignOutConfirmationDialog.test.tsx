import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SignOutConfirmationDialog from '../SignOutConfirmationDialog';

describe('SignOutConfirmationDialog', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the dialog when isOpen is true', () => {
    render(<SignOutConfirmationDialog {...defaultProps} />);

    expect(screen.getByRole('heading', { name: 'Sign Out' })).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to sign out? You will need to sign in again to access your account.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Out' })).toBeInTheDocument();
  });

  it('should not render when isOpen is false', () => {
    render(<SignOutConfirmationDialog {...defaultProps} isOpen={false} />);

    expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();
  });

  it('should call onClose when Cancel button is clicked', () => {
    render(<SignOutConfirmationDialog {...defaultProps} />);

    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when backdrop is clicked', () => {
    render(<SignOutConfirmationDialog {...defaultProps} />);

    // Find the backdrop element (the first div with the fixed inset-0 class)
    const backdrop = screen.getByTestId('backdrop');
    fireEvent.click(backdrop);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onConfirm when Sign Out button is clicked', () => {
    render(<SignOutConfirmationDialog {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'Sign Out' }));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should disable buttons when loading', () => {
    render(<SignOutConfirmationDialog {...defaultProps} loading={true} />);

    const signOutButton = screen.getByText('Signing Out...');
    expect(signOutButton).toBeDisabled();

    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toBeDisabled();
  });

  it('should show loading text on sign out button when loading', () => {
    render(<SignOutConfirmationDialog {...defaultProps} loading={true} />);

    expect(screen.getByText('Signing Out...')).toBeInTheDocument();
  });

  it('should show regular text on sign out button when not loading', () => {
    render(<SignOutConfirmationDialog {...defaultProps} loading={false} />);

    expect(screen.getByRole('button', { name: 'Sign Out' })).toBeInTheDocument();
    expect(screen.queryByText('Signing Out...')).not.toBeInTheDocument();
  });
});