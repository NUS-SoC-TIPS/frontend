import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { ROOM, ROOT } from '@/constants/routes';
import { Landing } from '@/routes/landing';
import { UnauthenticatedRoom } from '@/routes/room';

const UnauthenticatedApp = (): ReactElement<typeof Routes> => {
  return (
    <Routes>
      <Route element={<Landing />} path={ROOT} />
      <Route element={<UnauthenticatedRoom />} path={`${ROOM}/:slug`} />
      <Route element={<Navigate to={ROOT} />} path="*" />
    </Routes>
  );
};

// Using default export to support lazy imports
export default UnauthenticatedApp;
