import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { INTERVIEWS, ROOM } from 'constants/routes';
import { Interviews } from 'routes/interviews';
import { Room } from 'routes/room';

const AuthenticatedApp = (): ReactElement<typeof Routes> => {
  return (
    <Routes>
      <Route element={<Interviews />} path={INTERVIEWS} />
      <Route element={<Room />} path={`${ROOM}/:slug`} />
      <Route element={<Navigate to={INTERVIEWS} />} path="*" />
    </Routes>
  );
};

// Using default export to support lazy imports
export default AuthenticatedApp;
