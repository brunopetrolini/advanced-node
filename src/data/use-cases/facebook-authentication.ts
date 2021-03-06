import type { LoadFacebookUserApi } from '@/data/contracts/apis';
import type { TokenGenerator } from '../contracts/cryptograph';
import type {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from '@/data/contracts/repositories';

import { AccessToken, FacebookAccount } from '@/domain/entities';
import { FacebookAuthentication } from '@/domain/features';
import { AuthenticationError } from '@/domain/errors';

export class FacebookAuthenticationUseCase implements FacebookAuthentication {
  private readonly userAccountRepository: LoadUserAccountRepository & SaveFacebookAccountRepository;

  private readonly facebookApi: LoadFacebookUserApi;

  private readonly cryptograph: TokenGenerator;

  constructor(
    facebookApi: LoadFacebookUserApi,
    userAccountRepository: LoadUserAccountRepository & SaveFacebookAccountRepository,
    cryptograph: TokenGenerator,
  ) {
    this.facebookApi = facebookApi;
    this.userAccountRepository = userAccountRepository;
    this.cryptograph = cryptograph;
  }

  async perform(params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const facebookData = await this.facebookApi.loadUser(params);
    if (facebookData !== undefined) {
      const accountData = await this.userAccountRepository.load({ email: facebookData.email });
      const facebookAccount = new FacebookAccount(facebookData, accountData);
      const { id } = await this.userAccountRepository.saveWithFacebook(facebookAccount);
      const token = await this.cryptograph.generateToken({
        key: id,
        expirationInMs: AccessToken.expirationInMs,
      });
      return new AccessToken(token);
    }
    return new AuthenticationError();
  }
}
