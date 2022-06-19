import axios from 'axios';

import { HttpGetClient } from '@/infra/http';

jest.mock('axios');

class AxiosHttpClient {
  async get<ResponseType = any>(args: HttpGetClient.Params): Promise<ResponseType> {
    const result = await axios.get(args.url, { params: args.params });
    return result.data;
  }
}

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
});
