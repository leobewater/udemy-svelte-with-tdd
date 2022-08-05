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
      const { container } = render(SignUpPage);
      const input = container.querySelector('input');
      expect(input).toBeInTheDocument();
    });

    it('has email input', () => {
      const { container } = render(SignUpPage);
      const input = container.querySelector('input');
      expect(input).toBeInTheDocument();
    });
  });
});
