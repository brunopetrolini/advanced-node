import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';
import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { LoadUserAccountRepository } from '@/data/contracts/apis/repositories';

export class FacebookAuthenticationUseCase implements FacebookAuthentication {
  private readonly loadFacebookUserApi: LoadFacebookUserApi;
  private readonly loadUserAccountRepository: LoadUserAccountRepository;

  constructor(
    loadFacebookUserApi: LoadFacebookUserApi,
    loadUserAccountRepository: LoadUserAccountRepository,
  ) {
    this.loadFacebookUserApi = loadFacebookUserApi;
    this.loadUserAccountRepository = loadUserAccountRepository;
  }

  async perform(params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const loadUserFacebookResult = await this.loadFacebookUserApi.loadUser(params);
    if (loadUserFacebookResult !== undefined) {
      await this.loadUserAccountRepository.load({ email: loadUserFacebookResult.email });
    }
    return new AuthenticationError();
  }
}
