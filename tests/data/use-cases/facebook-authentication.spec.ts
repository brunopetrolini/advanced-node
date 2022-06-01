/* eslint-disable no-unused-vars */
/* eslint-disable max-classes-per-file */
import { mock, MockProxy } from 'jest-mock-extended';

import type { TokenGenerator } from '@/data/contracts/cryptograph';
import type { LoadFacebookUserApi } from '@/data/contracts/apis';
import type {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from '@/data/contracts/repositories';

import { FacebookAuthenticationUseCase } from '@/data/use-cases';
import { AuthenticationError } from '@/domain/errors';
import { AccessToken, FacebookAccount } from '@/domain/entities';

jest.mock('@/domain/entities/facebook-account');

describe('FacebookAuthenticationUseCase', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>;

  let userAccountRepository: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>;

  let cryptograph: MockProxy<TokenGenerator>;

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
    userAccountRepository.saveWithFacebook.mockResolvedValue({ id: 'any_account_id' });

    cryptograph = mock();
    cryptograph.generateToken.mockResolvedValue('any_generated_token');

    sut = new FacebookAuthenticationUseCase(facebookApi, userAccountRepository, cryptograph);
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

  it('should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    const FacebookAccountStub = jest.fn().mockImplementation(() => ({ any: 'any' }));
    jest.mocked(FacebookAccount).mockImplementation(FacebookAccountStub);

    await sut.perform({ token });

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' });
  });

  it('should call TokenGenerator with correct params', async () => {
    await sut.perform({ token });

    expect(cryptograph.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs,
    });
    expect(cryptograph.generateToken).toHaveBeenCalledTimes(1);
  });

  it('should return an AccessToken on success', async () => {
    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AccessToken('any_generated_token'));
  });

  it('should rethrow if LoadFacebookUserApi throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('facebook_error'));

    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrowError('facebook_error');
  });

  it('should rethrow if LoadUserAccountRepository throws', async () => {
    userAccountRepository.load.mockRejectedValueOnce(new Error('load_error'));

    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrowError('load_error');
  });

  it('should rethrow if SaveFacebookAccountRepository throws', async () => {
    userAccountRepository.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'));

    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrowError('save_error');
  });

  it('should rethrow if TokenGenerator throws', async () => {
    cryptograph.generateToken.mockRejectedValueOnce(new Error('token_error'));

    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrowError('token_error');
  });
});
