import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import {
  ADD_QUESTION,
  INTERVIEWS,
  QUESTIONS,
  ROOM,
  TASKS,
} from 'constants/routes';
import { Interviews } from 'routes/interviews';
import { AddQuestion, Questions } from 'routes/questions';
import { Room } from 'routes/room';
import { Tasks } from 'routes/tasks';

const AuthenticatedApp = (): ReactElement<typeof Routes> => {
  return (
    <Routes>
      <Route element={<Questions />} path={QUESTIONS} />
      <Route element={<AddQuestion />} path={ADD_QUESTION} />
      <Route element={<Interviews />} path={INTERVIEWS} />
      <Route element={<Tasks />} path={TASKS} />
      <Route element={<Room />} path={`${ROOM}/:slug`} />
      <Route element={<Navigate to={QUESTIONS} />} path="*" />
    </Routes>
  );
};

// Using default export to support lazy imports
export default AuthenticatedApp;
