import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { ROOT } from 'constants/routes';
import { Landing } from 'routes/landing';

const UnauthenticatedApp = (): ReactElement<typeof Routes> => {
  return (
    <Routes>
      <Route element={<Landing />} path={ROOT} />
      <Route element={<Navigate to={ROOT} />} path="*" />
    </Routes>
  );
};

// Using default export to support lazy imports
export default UnauthenticatedApp;
