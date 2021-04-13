import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';
import ProviderAvailabilityController from '../controllers/ProviderAvailabilityController';

const providersRouter = Router();
const providersController = new ProvidersController();
const providerAvailability = new ProviderAvailabilityController();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersController.create);
providersRouter.get('/:provider_id/availability', providerAvailability.create);

export default providersRouter;
