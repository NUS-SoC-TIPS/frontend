import { ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Landing } from 'routes/landing';

const UnauthenticatedApp = (): ReactElement<typeof Routes> => {
  return (
    <Routes>
      <Route element={<Landing />} path="/" />
    </Routes>
  );
};

// Using default export to support lazy imports
export default UnauthenticatedApp;
