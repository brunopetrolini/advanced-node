/* eslint-disable no-unused-vars */
/* eslint-disable max-classes-per-file */
import { mock, MockProxy } from 'jest-mock-extended';

import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/apis/repositories';
import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { FacebookAuthenticationUseCase } from '@/data/use-cases';
import { AuthenticationError } from '@/domain/errors';

describe('FacebookAuthenticationUseCase', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>;
  let loadUserAccountRepository: MockProxy<LoadUserAccountRepository>;
  let createFacebookAccountRepository: MockProxy<CreateFacebookAccountRepository>;
  let sut: FacebookAuthenticationUseCase;

  const token = 'any_token';

  beforeEach(() => {
    loadFacebookUserApi = mock<LoadFacebookUserApi>();
    loadFacebookUserApi.loadUser.mockResolvedValue({
      facebookId: 'any_facebook_id',
      name: 'any_facebook_name',
      email: 'any_facebook_email',
    });

    loadUserAccountRepository = mock<LoadUserAccountRepository>();

    createFacebookAccountRepository = mock<CreateFacebookAccountRepository>();

    sut = new FacebookAuthenticationUseCase(
      loadFacebookUserApi,
      loadUserAccountRepository,
      createFacebookAccountRepository,
    );
  });

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token });

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AuthenticationError());
  });

  it('should call LoadUserByEmailRepository when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token });

    expect(loadUserAccountRepository.load).toHaveBeenCalledWith({ email: 'any_facebook_email' });
    expect(loadUserAccountRepository.load).toHaveBeenCalledTimes(1);
  });

  it('should call CreateUserAccountRepository when LoadUserByEmailRepository returns undefined', async () => {
    loadUserAccountRepository.load.mockResolvedValueOnce(undefined);

    await sut.perform({ token });

    expect(createFacebookAccountRepository.createFromFacebook).toHaveBeenCalledWith({
      facebookId: 'any_facebook_id',
      name: 'any_facebook_name',
      email: 'any_facebook_email',
    });
    expect(createFacebookAccountRepository.createFromFacebook).toHaveBeenCalledTimes(1);
  });
});
