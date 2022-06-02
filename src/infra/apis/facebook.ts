/* eslint-disable no-unused-vars */
import type { LoadFacebookUserApi } from '@/data/contracts/apis';
import type { HttpGetClient } from '@/infra/http';

type AppTokenResponse = {
  access_token: string
}

type DebugTokenResponse = {
  data: {
    user_id: string
  }
}

type UserInfoResponse = {
  id: string,
  name: string,
  email: string
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

  private async getAppToken(): Promise<AppTokenResponse> {
    return this.httpGetClient.get<AppTokenResponse>({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials',
      },
    });
  }

  private async getDebugToken(clientToken: string): Promise<DebugTokenResponse> {
    const appToken = await this.getAppToken();
    return this.httpGetClient.get<DebugTokenResponse>({
      url: `${this.baseUrl}/debug_token`,
      params: {
        access_token: appToken.access_token,
        input_token: clientToken,
      },
    });
  }

  private async getUserInfo(clientToken: string): Promise<UserInfoResponse> {
    const debugToken = await this.getDebugToken(clientToken);
    return this.httpGetClient.get<UserInfoResponse>({
      url: `${this.baseUrl}/${debugToken.data.user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: clientToken,
      },
    });
  }

  public async loadUser({ token }: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    const userInfo = await this.getUserInfo(token);
    return {
      facebookId: userInfo.id,
      name: userInfo.name,
      email: userInfo.email,
    };
  }
}
