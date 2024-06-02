import { screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { emptyFunction } from '@/utils/functionUtils';
import { render } from '@/utils/testUtils';

import { Hero } from './Hero';

test('renders page title', () => {
  render(
    <Hero
      isGettingStarted={false}
      onDevelopmentLogin={emptyFunction}
      onGetStarted={emptyFunction}
    />,
  );
  const titleElement = screen.getByText(
    /Tech interview preparation made easier/i,
  );
  // @ts-expect-error This can run, just that there's some error with finding the type
  expect(titleElement).toBeInTheDocument();
});
