import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import {
  ADD_QUESTION,
  ADMIN,
  INTERVIEWS,
  PAST_INTERVIEWS,
  PAST_SUBMISSION,
  QUESTIONS,
  ROOM,
  SETTINGS,
  TASKS,
} from 'constants/routes';
import { useUser } from 'contexts/UserContext';
import { Admin } from 'routes/admin';
import { Interviews } from 'routes/interviews';
import { PastInterview } from 'routes/interviews/PastInterview';
import { Questions } from 'routes/questions';
import { AddQuestion } from 'routes/questions/AddQuestion';
import { PastSubmission } from 'routes/questions/PastSubmission';
import { Room } from 'routes/room';
import { Settings } from 'routes/settings';
import { Tasks } from 'routes/tasks';
import { UserRole } from 'types/models/user';

const AuthenticatedApp = (): ReactElement<typeof Routes> => {
  const user = useUser();
  const isAdmin = user?.role === UserRole.ADMIN;
  return (
    <Routes>
      {/* Questions */}
      <Route element={<Questions />} path={QUESTIONS} />
      <Route element={<AddQuestion />} path={ADD_QUESTION} />
      <Route element={<PastSubmission />} path={`${PAST_SUBMISSION}/:id`} />

      {/* Interviews */}
      <Route element={<Interviews />} path={INTERVIEWS} />
      <Route element={<PastInterview />} path={`${PAST_INTERVIEWS}/:id`} />
      <Route element={<Room />} path={`${ROOM}/:slug`} />

      <Route element={<Settings />} path={SETTINGS} />
      {(user?.isStudent || isAdmin) && (
        <Route element={<Tasks />} path={TASKS} />
      )}
      {isAdmin && <Route element={<Admin />} path={ADMIN} />}
      <Route element={<Navigate to={QUESTIONS} />} path="*" />
    </Routes>
  );
};

// Using default export to support lazy imports
export default AuthenticatedApp;
