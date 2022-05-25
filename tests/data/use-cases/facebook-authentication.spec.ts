/* eslint-disable no-unused-vars */
/* eslint-disable max-classes-per-file */
import { mock, MockProxy } from 'jest-mock-extended';

import type { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repositories';
import type { LoadFacebookUserApi } from '@/data/contracts/apis';

import { FacebookAuthenticationUseCase } from '@/data/use-cases';
import { AuthenticationError } from '@/domain/errors';

describe('FacebookAuthenticationUseCase', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>;
  let userAccountRepository: MockProxy<LoadUserAccountRepository & CreateFacebookAccountRepository>;
  let sut: FacebookAuthenticationUseCase;

  const token = 'any_token';

  beforeEach(() => {
    facebookApi = mock<LoadFacebookUserApi>();
    facebookApi.loadUser.mockResolvedValue({
      facebookId: 'any_facebook_id',
      name: 'any_facebook_name',
      email: 'any_facebook_email',
    });

    userAccountRepository = mock();

    sut = new FacebookAuthenticationUseCase(facebookApi, userAccountRepository);
  });

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token });

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token });
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AuthenticationError());
  });

  it('should call LoadUserByEmailRepository when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token });

    expect(userAccountRepository.load).toHaveBeenCalledWith({ email: 'any_facebook_email' });
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1);
  });

  it('should call CreateUserAccountRepository when LoadUserByEmailRepository returns undefined', async () => {
    userAccountRepository.load.mockResolvedValueOnce(undefined);

    await sut.perform({ token });

    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledWith({
      facebookId: 'any_facebook_id',
      name: 'any_facebook_name',
      email: 'any_facebook_email',
    });
    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledTimes(1);
  });
});
