import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(async () => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it("should be able to list the provider's appointments in a given day", async () => {
    const hours = [10, 12, 14];

    hours.forEach(hour => {
      fakeAppointmentsRepository.create({
        provider_id: 'providerID',
        user_id: 'userID',
        date: new Date(2021, 4, 20, hour, 0, 0),
      });
    });

    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date(2021, 4, 20, 11).getTime());

    const availability = await listDayAvailability.execute({
      provider_id: 'providerID',
      day: 20,
      month: 5,
      year: 2021,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 12, available: false },
        { hour: 13, available: true },
        { hour: 14, available: false },
      ]),
    );
  });
});
