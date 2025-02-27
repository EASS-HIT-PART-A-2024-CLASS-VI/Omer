import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import About from './About';

test('renders about page content', () => {
  render(<About />);
  const titleElement = screen.getByRole('heading', { name: /about task manager/i });
  expect(titleElement).toBeInTheDocument();
}); 