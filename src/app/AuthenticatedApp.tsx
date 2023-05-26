import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import {
  ADD_QUESTION,
  ADMIN,
  COHORT,
  INTERVIEWS,
  PAST_INTERVIEW,
  PAST_SUBMISSION,
  QUESTIONS,
  ROOM,
  SETTINGS,
  TASKS,
  TASKS_BREAKDOWN,
} from 'constants/routes';
import { useUser } from 'contexts/UserContext';
import { Admin } from 'routes/admin';
import { Interviews, PastInterview } from 'routes/interviews';
import { AddQuestion, PastSubmission, Questions } from 'routes/questions';
import { Room } from 'routes/room';
import { Settings } from 'routes/settings';
import { Tasks, TasksBreakdown } from 'routes/tasks';
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
      <Route element={<PastInterview />} path={`${PAST_INTERVIEW}/:id`} />
      <Route element={<Room />} path={`${ROOM}/:slug`} />

      {/* Tasks */}
      {(user?.isStudent || isAdmin) && (
        <>
          <Route element={<Tasks />} path={TASKS} />
          <Route element={<TasksBreakdown />} path={`${TASKS_BREAKDOWN}/:id`} />
        </>
      )}

      {/* Admin */}
      {isAdmin && (
        <>
          <Route element={<Admin />} path={ADMIN} />
          <Route element={<Admin />} path={`${COHORT}/:id`} />
        </>
      )}

      <Route element={<Settings />} path={SETTINGS} />
      <Route element={<Navigate to={QUESTIONS} />} path="*" />
    </Routes>
  );
};

// Using default export to support lazy imports
export default AuthenticatedApp;
