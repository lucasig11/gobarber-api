import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderMonthAvailabilityService from '@appointments/services/ListProviderMonthAvailabilityService';
import ListProviderDayAvailabilityService from '@appointments/services/ListProviderDayAvailabilityService';

export default class ProviderMonthAvailabilityController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { day, month, year } = request.query;

    if (!day) {
      const monthAvailability = container.resolve(
        ListProviderMonthAvailabilityService,
      );

      const availability = await monthAvailability.execute({
        provider_id,
        month: Number(month),
        year: Number(year),
      });
      return response.json(availability);
    }

    const dayAvailability = container.resolve(
      ListProviderDayAvailabilityService,
    );

    const availability = await dayAvailability.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    return response.json(availability);
  }
}
