import SignUpPage from './SignUpPage.svelte';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const server = setupServer();
beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

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

    it('disables the button initially', () => {
      render(SignUpPage);
      const button = screen.getByRole('button', { name: 'Sign Up' });
      expect(button).toBeDisabled();
    });
  });

  describe('Interactions', () => {
    let requestBody;
    let counter = 0;

    beforeEach(() => {
      counter = 0;
      server.use(
        // use msw and set up mocked api endpoint(s)
        rest.post('/api/1.0/users', (req, res, ctx) => {
          requestBody = req.body;
          counter += 1;
          return res(ctx.status(200));
        })
      );
    });

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

    it('sends username, email and password to backend after clicking the button', async () => {
      await setup();
      await userEvent.click(button);

      await screen.findByText(
        'Please check your e-mail to activate your account'
      );

      // check the mocked api requestBody
      expect(requestBody).toEqual({
        email: 'user1@mail.com',
        password: 'P4ssword',
        username: 'user1',
      });
    });

    it('disables button when there is an ongoing api call', async () => {
      await setup();

      await userEvent.click(button);
      await userEvent.click(button);

      await screen.findByText(
        'Please check your e-mail to activate your account'
      );

      expect(counter).toBe(1);
    });

    it.skip('displays spinner while the api request in progress', async () => {
      await setup();
      await userEvent.click(button);

      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
    });

    it('does not display spinner when there is no api request', async () => {
      await setup();
      const spinner = screen.queryByRole('status');
      expect(spinner).not.toBeInTheDocument();
    });

    it('displays account activation information after successful sign up request', async () => {
      await setup();
      await userEvent.click(button);

      // findBy has await which waits for 1 sec otherwise throw error
      const text = await screen.findByText(
        'Please check your e-mail to activate your account'
      );
      expect(text).toBeInTheDocument();
    });

    it('does not display account activation message before sign up request', async () => {
      await setup();
      const text = screen.queryByText(
        'Please check your e-mail to activate your account'
      );
      expect(text).not.toBeInTheDocument();
    });

    it('does not display account activation information after failing sign up request', async () => {
      server.use(
        rest.post('/api/1.0/users', (req, res, ctx) => {
          return res(ctx.status(400));
        })
      );

      await setup();
      await userEvent.click(button);

      // findBy has await which waits for 1 sec otherwise throw error
      const text = screen.queryByText(
        'Please check your e-mail to activate your account'
      );
      expect(text).not.toBeInTheDocument();
    });

    it('hides sign up form after successful sign up request', async () => {
      await setup();
      // at first the form appears by using data-testid
      const form = screen.getByTestId('form-sign-up');
      await userEvent.click(button);

      // waitFor by default wait 1 second
      await waitFor(() => {
        expect(form).not.toBeInTheDocument();
      });
    });
  });
});
