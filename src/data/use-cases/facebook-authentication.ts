import type { LoadFacebookUserApi } from '@/data/contracts/apis';
import type {
  CreateFacebookAccountRepository,
  LoadUserAccountRepository,
  UpdateFacebookAccountRepository,
} from '@/data/contracts/repositories';

import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';

export class FacebookAuthenticationUseCase implements FacebookAuthentication {
  private readonly userAccountRepository: LoadUserAccountRepository
    & CreateFacebookAccountRepository
    & UpdateFacebookAccountRepository;

  private readonly facebookApi: LoadFacebookUserApi;

  constructor(
    facebookApi: LoadFacebookUserApi,
    userAccountRepository: LoadUserAccountRepository
      & CreateFacebookAccountRepository
      & UpdateFacebookAccountRepository,
  ) {
    this.facebookApi = facebookApi;
    this.userAccountRepository = userAccountRepository;
  }

  async perform(params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const facebookUserData = await this.facebookApi.loadUser(params);
    if (facebookUserData !== undefined) {
      const accountData = await this.userAccountRepository.load({ email: facebookUserData.email });
      if (accountData !== undefined) {
        await this.userAccountRepository.updateWithFacebook({
          id: accountData.id,
          name: accountData.name ?? facebookUserData.name,
          facebookId: facebookUserData.facebookId,
        });
      } else {
        await this.userAccountRepository.createFromFacebook(facebookUserData);
      }
    }
    return new AuthenticationError();
  }
}
