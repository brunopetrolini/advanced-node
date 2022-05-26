/* eslint-disable no-unused-vars */
/* eslint-disable max-classes-per-file */
import { mock, MockProxy } from 'jest-mock-extended';

import type { LoadFacebookUserApi } from '@/data/contracts/apis';
import type {
  CreateFacebookAccountRepository,
  LoadUserAccountRepository,
  UpdateFacebookAccountRepository,
} from '@/data/contracts/repositories';

import { FacebookAuthenticationUseCase } from '@/data/use-cases';
import { AuthenticationError } from '@/domain/errors';

describe('FacebookAuthenticationUseCase', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>;

  let userAccountRepository: MockProxy<
    LoadUserAccountRepository &
    CreateFacebookAccountRepository &
    UpdateFacebookAccountRepository
  >;

  let sut: FacebookAuthenticationUseCase;

  const token = 'any_token';

  beforeEach(() => {
    facebookApi = mock();
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

  it('should call CreateFacebookAccountRepository when LoadUserByEmailRepository returns undefined', async () => {
    userAccountRepository.load.mockResolvedValueOnce(undefined);

    await sut.perform({ token });

    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledWith({
      facebookId: 'any_facebook_id',
      name: 'any_facebook_name',
      email: 'any_facebook_email',
    });
    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledTimes(1);
  });

  it('should call UpdateFacebookAccountRepository when LoadUserByEmailRepository returns data', async () => {
    userAccountRepository.load.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name',
    });

    await sut.perform({ token });

    expect(userAccountRepository.updateWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_name',
      facebookId: 'any_facebook_id',
    });
    expect(userAccountRepository.updateWithFacebook).toHaveBeenCalledTimes(1);
  });

  it('should update account name', async () => {
    userAccountRepository.load.mockResolvedValueOnce({ id: 'any_id' });

    await sut.perform({ token });

    expect(userAccountRepository.updateWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_facebook_name',
      facebookId: 'any_facebook_id',
    });
  });
});
