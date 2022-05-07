import { screen } from '@testing-library/react';

import { emptyFunction } from 'utils/functionUtils';
import { render } from 'utils/testUtils';

import { Hero } from './Hero';

test('renders page title', () => {
  render(<Hero isGettingStarted={false} onGetStarted={emptyFunction} />);
  const titleElement = screen.getByText(
    /Tech interview preparation made easier/i,
  );
  expect(titleElement).toBeInTheDocument();
});
