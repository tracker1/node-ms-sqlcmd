jest.mock('fs', () => ({
  promises: {
    unlink: jest.fn().mockRejectedValue('will be swallowed'),
  },
}));

import { promises as fsp } from 'fs';

import deleteAll from './delete-all';

describe('utility/delete-all', () => {
  it('will try to unlink all items passed', async () => {
    const list = ['item1', 'item2'];
    await deleteAll(list);
    expect(fsp.unlink).toHaveBeenCalledTimes(2);
    expect(fsp.unlink).toHaveBeenNthCalledWith(1, list[0]);
    expect(fsp.unlink).toHaveBeenNthCalledWith(2, list[1]);
  });
});
