import type { LoadFacebookUserApi } from '@/data/contracts/apis';
import type {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from '@/data/contracts/repositories';

import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';

export class FacebookAuthenticationUseCase implements FacebookAuthentication {
  private readonly userAccountRepository: LoadUserAccountRepository & SaveFacebookAccountRepository;

  private readonly facebookApi: LoadFacebookUserApi;

  constructor(
    facebookApi: LoadFacebookUserApi,
    userAccountRepository: LoadUserAccountRepository & SaveFacebookAccountRepository,
  ) {
    this.facebookApi = facebookApi;
    this.userAccountRepository = userAccountRepository;
  }

  async perform(params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const facebookUserData = await this.facebookApi.loadUser(params);
    if (facebookUserData !== undefined) {
      const accountData = await this.userAccountRepository.load({ email: facebookUserData.email });
      await this.userAccountRepository.saveWithFacebook({
        id: accountData?.id,
        name: accountData?.name ?? facebookUserData.name,
        email: facebookUserData.email,
        facebookId: facebookUserData.facebookId,
      });
    }
    return new AuthenticationError();
  }
}
