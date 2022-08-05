import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/svelte';
import SignUpPage from './SignUpPage.svelte';

describe('Sign Up Page', () => {
  describe('Layout', () => {
    it('has sign up header', () => {
      render(SignUpPage);
      const header = screen.getByRole('heading', { name: 'Sign Up' });
      expect(header).toBeInTheDocument();
    });

    it('has username input', () => {
      render(SignUpPage);
      // const input = screen.getByPlaceholderText('username');
      const input = screen.getByLabelText('Username');
      expect(input).toBeInTheDocument();
    });

    it('has email input', () => {
      // const { container } = render(SignUpPage);
      // const input = container.querySelector('input');
      // expect(input).toBeInTheDocument();
      // expect(container.querySelectorAll('input').length).toBe(2);
      render(SignUpPage);
      // const input = screen.getByPlaceholderText('email');
      const input = screen.getByLabelText('Email');
      expect(input).toBeInTheDocument();
    });

    it('has password input', () => {
      render(SignUpPage);
      const input = screen.getByLabelText('Password');
      expect(input).toBeInTheDocument();
    });

    it('has password type for password input', () => {
      render(SignUpPage);
      const input = screen.getByLabelText('Password');
      expect(input.type).toBe('password');
    });

    it('has password repeat input', () => {
      render(SignUpPage);
      const input = screen.getByLabelText('Password Repeat');
      expect(input).toBeInTheDocument();
    });

    it('has password type for password repeat input', () => {
      render(SignUpPage);
      const input = screen.getByLabelText('Password Repeat');
      expect(input.type).toBe('password');
    });

    it('has Sign Up button', () => {
      render(SignUpPage);
      const button = screen.getByRole('button', { name: 'Sign Up' });
      expect(button).toBeInTheDocument();
    });
  });
});
