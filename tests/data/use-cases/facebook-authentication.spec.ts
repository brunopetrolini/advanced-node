/* eslint-disable no-unused-vars */
/* eslint-disable max-classes-per-file */
import { FacebookAuthentication } from '@/domain/features';

namespace LoadFacebookUserApi {
  export type Params = {
    token: string;
  }
}

interface LoadFacebookUserApi {
  loadUser(params: LoadFacebookUserApi.Params): Promise<void>;
}

class FacebookAuthenticationUseCase implements FacebookAuthentication {
  private readonly loadFacebookUserApi: LoadFacebookUserApi;

  constructor(loadFacebookUserApi: LoadFacebookUserApi) {
    this.loadFacebookUserApi = loadFacebookUserApi;
  }

  async perform(params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    await this.loadFacebookUserApi.loadUser(params);
    return { accessToken: 'any_token' };
  }
}

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  public token: string = '';

  async loadUser({ token }: LoadFacebookUserApi.Params): Promise<void> {
    this.token = token;
  }
}

describe('FacebookAuthenticationUseCase', () => {
  it('should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy();
    const sut = new FacebookAuthenticationUseCase(loadFacebookUserApi);

    await sut.perform({ token: 'any_token' });

    expect(loadFacebookUserApi.token).toBe('any_token');
  });
});
