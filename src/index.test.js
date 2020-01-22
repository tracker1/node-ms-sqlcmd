import sit from './index';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('index - Default method', () => {
  it('will export a function', async () => {
    expect.assertions(1);
    await delay(100);
    expect(sit).toBeInstanceOf(Function);
  });
});
