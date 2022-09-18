import SignUpPage from './SignUpPage.svelte';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
//import axios from 'axios';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

describe('Sign Up Page', () => {
  describe('Layout', () => {
    it('has Sign Up header', () => {
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
      const input = screen.getByLabelText('E-mail');
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
    // shared setup form fields
    let button, usernameInput, emailInput, passwordInput, passwordRepeatInput;
    const setup = async () => {
      render(SignUpPage);

      usernameInput = screen.getByLabelText('Username');
      emailInput = screen.getByLabelText('E-mail');
      passwordInput = screen.getByLabelText('Password');
      passwordRepeatInput = screen.getByLabelText('Password Repeat');
      button = screen.getByRole('button', { name: 'Sign Up' });
      await userEvent.type(usernameInput, 'user1');
      await userEvent.type(emailInput, 'user1@mail.com');
      await userEvent.type(passwordInput, 'P4ssword');
      await userEvent.type(passwordRepeatInput, 'P4ssword');
    };

    it('enables the button when the password and password repeat fields have same value', async () => {
      await setup();
      expect(button).toBeEnabled();
    });

    it('sends username, email, password to the backend after clicking the submit button', async () => {
      // use msw and set up mocked api endpoint(s)
      let requestBody;
      const server = setupServer(
        rest.post('/api/1.0/users', (req, res, ctx) => {
          requestBody = req.body;
          console.log(requestBody);
          return res(ctx.status(200));
        })
      );

      server.listen();
      await setup(); // setup form fields

      await userEvent.click(button);

      await server.close();

      // check the mocked api requestBody
      expect(requestBody).toEqual({
        username: 'user1',
        email: 'user1@mail.com',
        password: 'P4ssword',
      });
    });

    it('disables button when there is an ongoing api call', async () => {
      let counter = 0;

      // use msw and set up mocked api endpoint(s)
      let requestBody;
      const server = setupServer(
        rest.post('/api/1.0/users', (req, res, ctx) => {
          requestBody = req.body;
          counter += 1;
          return res(ctx.status(200));
        })
      );

      server.listen();
      await setup(); // setup form fields

      await userEvent.click(button);
      await userEvent.click(button);

      await server.close();

      expect(counter).toBe(1);
    });

    it('displays spinner while the api request in progress', async () => {
      const server = setupServer(
        rest.post('/api/1.0/users', (req, res, ctx) => {
          return res(ctx.status(200));
        })
      );

      server.listen();
      await setup(); // setup form fields
      const button = screen.getByRole('button', { name: 'Sign Up' });

      await userEvent.click(button);

      // check bootstrap spinner is appearing or not
      const spinner = screen.getByRole('status');

      await server.close();

      expect(spinner).toBeInTheDocument();
    });
  });
});
