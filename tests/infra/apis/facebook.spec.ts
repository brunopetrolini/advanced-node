/* eslint-disable no-unused-vars */
import { mock } from 'jest-mock-extended';
import { LoadFacebookUserApi } from '@/data/contracts/apis';

namespace HttpGetClient {
  export type Params = {
    url: string
  }
}

interface HttpGetClient {
  get(params: HttpGetClient.Params): Promise<void>
}

class FacebookApi {
  private readonly baseUrl = 'https://graph.facebook.com';

  private readonly httpGetClient: HttpGetClient;

  constructor(httpGetClient: HttpGetClient) {
    this.httpGetClient = httpGetClient;
  }

  async loadUser(params: LoadFacebookUserApi.Params): Promise<void> {
    await this.httpGetClient.get({ url: `${this.baseUrl}/oauth/access_token` });
  }
}

describe('Facebook Api', () => {
  it('should get app token', async () => {
    const httpClient = mock<HttpGetClient>();
    const sut = new FacebookApi(httpClient);

    await sut.loadUser({ token: 'any_client_token' });

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
    });
  });
});
