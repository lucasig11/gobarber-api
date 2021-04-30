import { Router } from 'express';

import appointmentsRouter from '@appointments/infra/http/routes/appointments.routes';
import providersRouter from '@appointments/infra/http/routes/providers.routes';

import usersRouter from '@users/infra/http/routes/users.routes';
import profileRouter from '@users/infra/http/routes/profile.routes';
import sessionsRouter from '@users/infra/http/routes/sessions.routes';
import passwordRouter from '@users/infra/http/routes/password.routes';

import notificationsRouter from '@modules/notifications/infra/http/routes/notifications.routes';

const routes = Router();

routes.use('/appointments', appointmentsRouter);
routes.use('/providers', providersRouter);
routes.use('/users', usersRouter);
routes.use('/profile', profileRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/notifications', notificationsRouter);

export default routes;
