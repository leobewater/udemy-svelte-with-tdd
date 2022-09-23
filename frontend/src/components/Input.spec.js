import { render, screen, waitFor } from '@testing-library/svelte';
import Input from './Input.svelte';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';

it('has is-invalid class for input when help is set', () => {
  // render component with option
  const { container } = render(Input, { help: 'Error Message' });
  const input = container.querySelector('input');
  //expect(input.classList).toContain('is-invalid');
  expect(input).toHaveClass("is-invalid");
});

it('has invalid-feedback class for span when help is set', () => {
    // render component with option
    const { container } = render(Input, { help: 'Error Message' });
    const span = container.querySelector('span');
    expect(span).toHaveClass("invalid-feedback");
  });
  