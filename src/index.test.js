// mocks
jest.mock('./execute-request/index', () => jest.fn());

// import mocks
import executeRequest from './execute-request/index';

// sit
import sit from './index';

describe('index - Default method', () => {
  it('will export a function', () => {
    expect(sit).toBeInstanceOf(Function);
  });

  it('will passthrough to executeRequest', async () => {
    const expected = Math.random();
    executeRequest.mockReset().mockReturnValue(Promise.resolve(expected));

    const cs = Math.random();
    const scr = Math.random();
    const vars = Math.random();
    const options = Math.random();

    const result = await sit(cs, scr, vars, options);
    expect(result).toEqual(expected);
    expect(executeRequest).toHaveBeenCalledTimes(1);
    expect(executeRequest).toHaveBeenCalledWith(cs, scr, vars, options);
  });
});
