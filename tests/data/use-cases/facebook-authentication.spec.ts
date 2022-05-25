/* eslint-disable no-unused-vars */
/* eslint-disable max-classes-per-file */
import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  public token: string = '';
  public result: undefined = undefined;

  async loadUser({ token }: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    this.token = token;
    return this.result;
  }
}

class FacebookAuthenticationUseCase implements FacebookAuthentication {
  private readonly loadFacebookUserApi: LoadFacebookUserApi;

  constructor(loadFacebookUserApi: LoadFacebookUserApi) {
    this.loadFacebookUserApi = loadFacebookUserApi;
  }

  async perform(params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const loadUserResult = await this.loadFacebookUserApi.loadUser(params);
    if (loadUserResult === undefined) return new AuthenticationError();
    return { accessToken: 'any_token' };
  }
}

describe('FacebookAuthenticationUseCase', () => {
  it('should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy();
    const sut = new FacebookAuthenticationUseCase(loadFacebookUserApi);

    await sut.perform({ token: 'any_token' });

    expect(loadFacebookUserApi.token).toBe('any_token');
  });

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy();
    loadFacebookUserApi.result = undefined;
    const sut = new FacebookAuthenticationUseCase(loadFacebookUserApi);

    const authResult = await sut.perform({ token: 'any_token' });

    expect(authResult).toEqual(new AuthenticationError());
  });
});
