import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/apis/repositories';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';
import { LoadFacebookUserApi } from '@/data/contracts/apis';

export class FacebookAuthenticationUseCase implements FacebookAuthentication {
  private readonly loadFacebookUserApi: LoadFacebookUserApi;
  private readonly loadUserAccountRepository: LoadUserAccountRepository;
  private readonly createFacebookAccountRepository: CreateFacebookAccountRepository;

  constructor(
    loadFacebookUserApi: LoadFacebookUserApi,
    loadUserAccountRepository: LoadUserAccountRepository,
    createFacebookAccountRepository: CreateFacebookAccountRepository,
  ) {
    this.loadFacebookUserApi = loadFacebookUserApi;
    this.loadUserAccountRepository = loadUserAccountRepository;
    this.createFacebookAccountRepository = createFacebookAccountRepository;
  }

  async perform(params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const facebookUserData = await this.loadFacebookUserApi.loadUser(params);
    if (facebookUserData !== undefined) {
      await this.loadUserAccountRepository.load({ email: facebookUserData.email });
      await this.createFacebookAccountRepository.createFromFacebook(facebookUserData);
    }
    return new AuthenticationError();
  }
}
