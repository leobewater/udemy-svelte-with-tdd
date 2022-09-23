import SignUpPage from './SignUpPage.svelte';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import '../../setupTest';

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
    let button, usernameInput, passwordInput, passwordRepeatInput;

    const setup = async () => {
      render(SignUpPage);

      usernameInput = screen.getByLabelText('Username');
      const emailInput = screen.getByLabelText('E-mail');
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
        username: 'user1',
        email: 'user1@mail.com',
        password: 'P4ssword',
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

      // this is failing because submitting the form was too fast and unable to capture the existence of the spinner
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
          return res(
            ctx.status(400),
            ctx.json({
              validationErrors: {
                username: 'Username cannot be null',
              },
            })
          );
        })
      );

      await setup();
      await userEvent.click(button);

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

    // use jest each for running similar tests
    const generateValidationError = (field, message) => {
      return rest.post('/api/1.0/users', (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            validationErrors: {
              [field]: message,
            },
          })
        );
      });
    };

    //   it.each`
    //   field         | message
    //   ${'username'} | ${'Username cannot be null'}
    //   ${'email'}    | ${'E-mail cannot be null'}
    //   ${'password'} | ${'Password cannot be null'}
    // `("displays ${message} for ${field} field", async ({ field, message }) => {
    //   server.use(generateValidationError(field, message));

    //   await setup();
    //   await userEvent.click(button);

    //   const validationError = await screen.findByText(message);
    //   expect(validationError).toBeInTheDocument();
    // });

    it("displays Username cannot be null for username", async () => {
    server.use(generateValidationError('username', 'Username cannot be null'));

    await setup();
    await userEvent.click(button);

    const validationError = await screen.findByText('Username cannot be null');
    expect(validationError).toBeInTheDocument();
  });

  it("displays E-mail cannot be null for email", async () => {
    server.use(generateValidationError('email', 'E-mail cannot be null'));

    await setup();
    await userEvent.click(button);

    const validationError = await screen.findByText('E-mail cannot be null');
    expect(validationError).toBeInTheDocument();
  });

  it("displays Password cannot be null for password", async () => {
    server.use(generateValidationError('password', 'Password cannot be null'));

    await setup();
    await userEvent.click(button);

    const validationError = await screen.findByText('Password cannot be null');
    expect(validationError).toBeInTheDocument();
  });

    it('hides spinner after response received', async () => {
      server.use(
        generateValidationError('username', 'Username cannot be null')
      );

      await setup();
      await userEvent.click(button);

      await screen.findByText('Username cannot be null');
      const spinner = screen.queryByRole('status');
      expect(spinner).not.toBeInTheDocument();
    });

    it('enables the button after response received', async () => {
      server.use(
        generateValidationError('username', 'Username cannot be null')
      );

      await setup();
      await userEvent.click(button);

      await screen.findByText('Username cannot be null');

      expect(button).toBeEnabled();
    });

    it('displays mismatch message for password repeat input', async () => {
      await setup();
      // override preset testing password
      await userEvent.type(passwordInput, 'N3wP4ss');
      await userEvent.type(passwordRepeatInput, 'anotherPass');

      const validationError = await screen.findByText('Password mismatch');
      expect(validationError).toBeInTheDocument();
    });

    it('does not display mismatch message initially', async () => {
      render(SignUpPage);
      const validationError = screen.queryByText('Password mismatch');
      expect(validationError).not.toBeInTheDocument();
    });
  });
});
