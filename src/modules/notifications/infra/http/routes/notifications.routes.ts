import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import NotificationsController from '../controllers/NotificationsController';

const notificationsRouter = Router();
const notificationsController = new NotificationsController();

notificationsRouter.use(ensureAuthenticated);

notificationsRouter.get('/', notificationsController.index);
notificationsRouter.patch('/', notificationsController.update);
notificationsRouter.delete('/', notificationsController.delete);

export default notificationsRouter;
