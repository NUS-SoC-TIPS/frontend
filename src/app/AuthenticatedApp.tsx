import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import {
  ADD_QUESTION,
  ADMIN,
  INTERVIEWS,
  QUESTIONS,
  ROOM,
  SETTINGS,
  TASKS,
} from 'constants/routes';
import { useUser } from 'contexts/UserContext';
import { Admin } from 'routes/admin';
import { Interviews } from 'routes/interviews';
import { AddQuestion, Questions } from 'routes/questions';
import { Room } from 'routes/room';
import { Settings } from 'routes/settings';
import { Tasks } from 'routes/tasks';
import { UserRole } from 'types/models/user';

const AuthenticatedApp = (): ReactElement<typeof Routes> => {
  const user = useUser();
  return (
    <Routes>
      <Route element={<Questions />} path={QUESTIONS} />
      <Route element={<AddQuestion />} path={ADD_QUESTION} />
      <Route element={<Interviews />} path={INTERVIEWS} />
      <Route element={<Tasks />} path={TASKS} />
      <Route element={<Settings />} path={SETTINGS} />
      <Route element={<Room />} path={`${ROOM}/:slug`} />
      {user?.role === UserRole.ADMIN && (
        <Route element={<Admin />} path={ADMIN} />
      )}
      <Route element={<Navigate to={QUESTIONS} />} path="*" />
    </Routes>
  );
};

// Using default export to support lazy imports
export default AuthenticatedApp;
