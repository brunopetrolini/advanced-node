/* eslint-disable no-unused-vars */
import type { LoadFacebookUserApi } from '@/data/contracts/apis';
import type { HttpGetClient } from '@/infra/http';

type GetDebugTokenParams = {
  clientToken: string;
  appToken: string;
}

type GetUserInfoParams = {
  clientToken: string;
  debugToken: string;
}

type GetUserInfoResult = {
  id: string;
  name: string;
  email: string;
}

export class FacebookApi implements LoadFacebookUserApi {
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

  private async getAppToken(): Promise<string> {
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

  private async getDebugToken({ clientToken, appToken }: GetDebugTokenParams): Promise<string> {
    const response = await this.httpGetClient.get({
      url: `${this.baseUrl}/debug_token`,
      params: {
        access_token: appToken,
        input_token: clientToken,
      },
    });
    return response.data.user_id;
  }

  private async getUserInfo({ debugToken, clientToken }: GetUserInfoParams): Promise<GetUserInfoResult> {
    const response = await this.httpGetClient.get({
      url: `${this.baseUrl}/${debugToken}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: clientToken,
      },
    });
    return response;
  }

  public async loadUser({ token }: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    const appToken = await this.getAppToken();
    const debugToken = await this.getDebugToken({ clientToken: token, appToken });
    const userInfo = await this.getUserInfo({ debugToken, clientToken: token });
    return {
      facebookId: userInfo.id,
      name: userInfo.name,
      email: userInfo.email,
    };
  }
}
