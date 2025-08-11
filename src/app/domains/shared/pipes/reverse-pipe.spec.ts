import { ReversePipe } from './reverse-pipe';

describe('ReversePipePipe', () => {
  let pipe: ReversePipe;

  beforeEach(() => {
    pipe = new ReversePipe();
  });
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('has to revert an string', () => {
    const result = pipe.transform('abcd');
    expect(result).toBe('dcba');
  });

  it('has to return and empty value if is empty', () => {
    const result = pipe.transform('');
    expect(result).toBe('');
  });

  it('has to revert string with spaces and special characters', () => {
    const result = pipe.transform('hello world!');
    expect(result).toBe('!ldrow olleh');
  });
});
