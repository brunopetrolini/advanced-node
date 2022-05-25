import type { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/apis/repositories';
import type { LoadFacebookUserApi } from '@/data/contracts/apis';

import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';

export class FacebookAuthenticationUseCase implements FacebookAuthentication {
  private readonly userAccountRepository: LoadUserAccountRepository
    & CreateFacebookAccountRepository;

  private readonly facebookApi: LoadFacebookUserApi;

  constructor(
    facebookApi: LoadFacebookUserApi,
    userAccountRepository: LoadUserAccountRepository & CreateFacebookAccountRepository,
  ) {
    this.facebookApi = facebookApi;
    this.userAccountRepository = userAccountRepository;
  }

  async perform(params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const facebookUserData = await this.facebookApi.loadUser(params);
    if (facebookUserData !== undefined) {
      await this.userAccountRepository.load({ email: facebookUserData.email });
      await this.userAccountRepository.createFromFacebook(facebookUserData);
    }
    return new AuthenticationError();
  }
}
