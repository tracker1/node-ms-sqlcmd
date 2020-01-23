import sit, { tempStatement } from './index';

describe('index - Default method', () => {
  it('will export a function', () => {
    expect(sit).toBeInstanceOf(Function);
  });

  it('will throw the expected statement when called', () => {
    expect.assertions(1);
    try {
      sit();
    } catch (error) {
      expect(error.message).toBe(tempStatement);
    }
  });
});
