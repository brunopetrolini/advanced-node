import axios from 'axios';

import { HttpGetClient } from '@/infra/http';

jest.mock('axios');

class AxiosHttpClient {
  async get({ url, params }: HttpGetClient.Params): Promise<void> {
    await axios.get(url, { params });
  }
}

describe('Axios Http Client', () => {
  let sut: AxiosHttpClient;
  let fakeAxios: jest.Mocked<typeof axios>;

  const url = 'any_url';
  const params = { any: 'any' };

  beforeAll(() => {
    fakeAxios = axios as jest.Mocked<typeof axios>;
  });

  beforeEach(() => {
    sut = new AxiosHttpClient();
  });

  it('should call get with correct params', async () => {
    await sut.get({ url, params });

    expect(fakeAxios.get).toHaveBeenCalledWith(url, { params });
    expect(fakeAxios.get).toHaveBeenCalledTimes(1);
  });
});
