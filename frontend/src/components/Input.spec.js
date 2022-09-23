import { render, screen, waitFor } from '@testing-library/svelte';
import Input from './Input.svelte';
import { describe, expect, it, vi } from 'vitest';
import '../../setupTest'

it('has is-invalid class for input when help is set', () => {
  // render component with option
  const { container } = render(Input, { help: 'Error Message' });
  const input = container.querySelector('input');
  //expect(input.classList).toContain('is-invalid');
  expect(input).toHaveClass('is-invalid');
});

it('has invalid-feedback class for span when help is set', () => {
  // render component with option
  const { container } = render(Input, { help: 'Error Message' });
  const span = container.querySelector('span');
  expect(span).toHaveClass('invalid-feedback');
});

it('does not have is-invalid class for input when help is not set', () => {
  const { container } = render(Input);
  const input = container.querySelector('input');
  expect(input).not.toHaveClass('is-invalid', { exact: true });
});

it('does not display validation message initially', () => {
  render(Input);
  const validationAlert = screen.queryByRole('alert');
  expect(validationAlert).not.toBeInTheDocument();
});
