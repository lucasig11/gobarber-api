import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProfileController from '../controllers/ProfileController';

const profileRouter = Router();

const profileController = new ProfileController();

profileRouter.use(ensureAuthenticated); // Authentication middleware

profileRouter.put('/', profileController.update);
profileRouter.get('/', profileController.show);

export default profileRouter;
