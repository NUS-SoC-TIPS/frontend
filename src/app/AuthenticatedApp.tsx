import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { INTERVIEWS } from 'constants/routes';
import { Interviews } from 'routes/interviews';

const AuthenticatedApp = (): ReactElement<typeof Routes> => {
  return (
    <Routes>
      <Route element={<Interviews />} path={INTERVIEWS} />
      <Route element={<Navigate to={INTERVIEWS} />} path="*" />
    </Routes>
  );
};

// Using default export to support lazy imports
export default AuthenticatedApp;
