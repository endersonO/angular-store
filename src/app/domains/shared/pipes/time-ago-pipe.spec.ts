import { TimeAgoPipe } from './time-ago-pipe';
import { formatDistance } from 'date-fns';

describe('TimeAgoPipe', () => {
  let pipe: TimeAgoPipe;

  beforeEach(() => {
    pipe = new TimeAgoPipe();
  });

  it('should be created successfully', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the correct time distance for a past date', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5); // 5 days ago
    const expected = formatDistance(new Date(), pastDate);

    const result = pipe.transform(pastDate.toISOString());

    expect(result).toBe(expected);
  });

  it('should return the correct time distance for a future date', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 2); // 2 days ahead
    const expected = formatDistance(new Date(), futureDate);

    const result = pipe.transform(futureDate.toISOString());

    expect(result).toBe(expected);
  });

  it('should handle invalid date strings gracefully', () => {
    const invalidDate = 'not-a-date';
    const result = () => pipe.transform(invalidDate);

    expect(result).toThrow();
  });
});
