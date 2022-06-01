import type { LoadFacebookUserApi } from '@/data/contracts/apis';
import type {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from '@/data/contracts/repositories';

import { FacebookAuthentication } from '@/domain/features';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAccount } from '@/domain/entities';

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
    const facebookData = await this.facebookApi.loadUser(params);
    if (facebookData !== undefined) {
      const accountData = await this.userAccountRepository.load({ email: facebookData.email });
      const facebookAccount = new FacebookAccount(facebookData, accountData);
      await this.userAccountRepository.saveWithFacebook(facebookAccount);
    }
    return new AuthenticationError();
  }
}
