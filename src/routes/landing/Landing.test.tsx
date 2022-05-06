import { screen } from '@testing-library/react';

import { render } from '../../test-utils';

import { Landing } from './Landing';

test('renders page title', () => {
  render(<Landing />);
  const titleElement = screen.getByText(
    /Tech interview preparation made easier/i,
  );
  expect(titleElement).toBeInTheDocument();
});
