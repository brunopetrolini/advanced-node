/* eslint-disable no-unused-vars */
import type { LoadFacebookUserApi } from '@/data/contracts/apis';
import type { HttpGetClient } from '@/infra/http';

export class FacebookApi {
  private readonly baseUrl = 'https://graph.facebook.com';

  private readonly httpGetClient: HttpGetClient;

  private readonly clientId: string;

  private readonly clientSecret: string;

  constructor(
    httpGetClient: HttpGetClient,
    clientId: string,
    clientSecret: string,
  ) {
    this.httpGetClient = httpGetClient;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  async loadUser(params: LoadFacebookUserApi.Params): Promise<void> {
    await this.httpGetClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials',
      },
    });
  }
}
