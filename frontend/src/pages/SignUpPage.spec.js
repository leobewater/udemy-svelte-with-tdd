import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import SignUpPage from './SignUpPage.svelte';
import axios from 'axios';

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

    it('Sign Up button disabled initially', () => {
      render(SignUpPage);
      const button = screen.getByRole('button', { name: 'Sign Up' });
      expect(button).toBeDisabled();
    });
  });

  describe('Interactions', () => {
    it('enables the submit button when password fields matched', async () => {
      render(SignUpPage);
      const passwordInput = screen.getByLabelText('Password');
      const passwordRepeatInput = screen.getByLabelText('Password Repeat');
      await userEvent.type(passwordInput, 'P4ssword');
      await userEvent.type(passwordRepeatInput, 'P4ssword');
      const button = screen.getByRole('button', { name: 'Sign Up' });
      expect(button).toBeEnabled();
    });
    it('sends username, email, password to the backend after clicking the submit button', async () => {
      render(SignUpPage);

      const usernameInput = screen.getByLabelText('Username');
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const passwordRepeatInput = screen.getByLabelText('Password Repeat');

      await userEvent.type(usernameInput, 'user1');
      await userEvent.type(emailInput, 'user1@mail.com');
      await userEvent.type(passwordInput, 'P4ssword');
      await userEvent.type(passwordRepeatInput, 'P4ssword');

      const button = screen.getByRole('button', { name: 'Sign Up' });

      // replace axios.post with mock function for posting the form to the api
      const mockFn = jest.fn();
      axios.post = mockFn;

      await userEvent.click(button);

      const firstCall = mockFn.mock.calls[0];
      const body = firstCall[1];

      expect(body).toEqual({
        username: 'user1',
        email: 'user1@mail.com',
        password: 'P4ssword',
      });
    });
  });
});
