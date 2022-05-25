import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';
import { LoadFacebookUserApi } from '../contracts/apis';

export class FacebookAuthenticationUseCase implements FacebookAuthentication {
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
