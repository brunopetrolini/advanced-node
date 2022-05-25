/* eslint-disable no-unused-vars */
/* eslint-disable max-classes-per-file */
import { mock, MockProxy } from 'jest-mock-extended';

import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { FacebookAuthenticationUseCase } from '@/data/use-cases';
import { AuthenticationError } from '@/domain/errors';
import { LoadUserAccountRepository } from '@/data/contracts/apis/repositories';

describe('FacebookAuthenticationUseCase', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>;
  let loadUserAccountRepository: MockProxy<LoadUserAccountRepository>;
  let sut: FacebookAuthenticationUseCase;

  const token = { token: 'any_token' };
  const facebookUser = {
    facebookId: 'any_facebook_id',
    name: 'any_facebook_name',
    email: 'any_facebook_email',
  };

  beforeAll(() => {
    loadFacebookUserApi = mock<LoadFacebookUserApi>();
    loadFacebookUserApi.loadUser.mockResolvedValue(facebookUser);

    loadUserAccountRepository = mock<LoadUserAccountRepository>();

    sut = new FacebookAuthenticationUseCase(loadFacebookUserApi, loadUserAccountRepository);
  });

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform(token);

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith(token);
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await sut.perform(token);

    expect(authResult).toEqual(new AuthenticationError());
  });

  it('should call LoadUserByEmailRepository when LoadFacebookUserApi returns data', async () => {
    await sut.perform(token);

    expect(loadUserAccountRepository.load).toHaveBeenCalledWith({ email: facebookUser.email });
    expect(loadUserAccountRepository.load).toHaveBeenCalledTimes(1);
  });
});
