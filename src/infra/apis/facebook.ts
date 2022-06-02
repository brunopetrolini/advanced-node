/* eslint-disable no-unused-vars */
import type { LoadFacebookUserApi } from '@/data/contracts/apis';
import type { HttpGetClient } from '@/infra/http';

type GetDebugTokenParams = {
  clientToken: string,
  appToken: string
}

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

  async getAppToken(): Promise<string> {
    const response = await this.httpGetClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials',
      },
    });
    return response.access_token;
  }

  async getDebugToken({ clientToken, appToken }: GetDebugTokenParams): Promise<void> {
    await this.httpGetClient.get({
      url: `${this.baseUrl}/debug_token`,
      params: {
        access_token: appToken,
        input_token: clientToken,
      },
    });
  }

  async loadUser({ token }: LoadFacebookUserApi.Params): Promise<void> {
    const appToken = await this.getAppToken();
    await this.getDebugToken({ clientToken: token, appToken });
  }
}
