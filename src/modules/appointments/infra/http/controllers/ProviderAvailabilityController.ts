import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderMonthAvailabilityService from '@appointments/services/ListProviderMonthAvailabilityService';
import ListProviderDayAvailabilityService from '@appointments/services/ListProviderDayAvailabilityService';

export default class ProviderMonthAvailabilityController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { day, month, year } = request.body;

    if (!day) {
      const monthAvailability = container.resolve(
        ListProviderMonthAvailabilityService,
      );

      const availability = await monthAvailability.execute({
        provider_id,
        month,
        year,
      });
      return response.json(availability);
    }

    const dayAvailability = container.resolve(
      ListProviderDayAvailabilityService,
    );

    try {
      const availability = await dayAvailability.execute({
        provider_id,
        day,
        month,
        year,
      });

      return response.json(availability);
    } catch (err) {
      console.log(err);
    }

    return response.json({});
  }
}
