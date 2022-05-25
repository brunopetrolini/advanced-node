/* eslint-disable no-unused-vars */
/* eslint-disable max-classes-per-file */
import { mock, MockProxy } from 'jest-mock-extended';

import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { FacebookAuthenticationUseCase } from '@/data/use-cases';
import { AuthenticationError } from '@/domain/errors';

describe('FacebookAuthenticationUseCase', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>;
  let sut: FacebookAuthenticationUseCase;

  const token = { token: 'any_token' };

  beforeAll(() => {
    loadFacebookUserApi = mock<LoadFacebookUserApi>();
    sut = new FacebookAuthenticationUseCase(loadFacebookUserApi);
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
});
