import axios from 'axios';

import { AxiosHttpClient } from '@/infra/http';

jest.mock('axios');

describe('Axios Http Client', () => {
  let sut: AxiosHttpClient;
  let fakeAxios: jest.Mocked<typeof axios>;

  const url = 'any_url';
  const params = { any: 'any' };

  beforeAll(() => {
    fakeAxios = axios as jest.Mocked<typeof axios>;
    fakeAxios.get.mockResolvedValue({ status: 200, data: 'any_data' });
  });

  beforeEach(() => {
    sut = new AxiosHttpClient();
  });

  it('should call get with correct params', async () => {
    await sut.get({ url, params });

    expect(fakeAxios.get).toHaveBeenCalledWith(url, { params });
    expect(fakeAxios.get).toHaveBeenCalledTimes(1);
  });

  it('should return data on success', async () => {
    const result = await sut.get({ url, params });

    expect(result).toEqual('any_data');
  });

  it('should rethrow if get throws', async () => {
    fakeAxios.get.mockRejectedValueOnce(new Error('http_error'));

    const promise = sut.get({ url, params });

    await expect(promise).rejects.toThrowError('http_error');
  });
});
