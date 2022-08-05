import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/svelte';
import SignUpPage from './SignUpPage.svelte';

it('has sign up header', () => {
  render(SignUpPage);

  const header = screen.getByRole('heading', { name: 'Sign Up' });
  expect(header).toBeInTheDocument();
});
