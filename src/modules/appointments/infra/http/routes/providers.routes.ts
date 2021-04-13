import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';
import ProviderAvailabilityController from '../controllers/ProviderAvailabilityController';

const providersRouter = Router();
const providersController = new ProvidersController();
const providerAvailability = new ProviderAvailabilityController();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersController.create);
providersRouter.get(
  '/:provider_id/availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providerAvailability.create,
);

export default providersRouter;
