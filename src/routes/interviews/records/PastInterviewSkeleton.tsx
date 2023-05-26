import { ReactElement } from 'react';

import { PastInterviewPage } from './PastInterviewPage';

export const PastInterviewSkeleton = (): ReactElement<
  void,
  typeof PastInterviewPage
> => {
  // TODO: Do a proper skeleton loading page (OR just wait for rewrite)
  return <PastInterviewPage />;
};
