/* eslint-disable no-unused-vars */
import { mock, MockProxy } from 'jest-mock-extended';

import type { HttpGetClient } from '@/infra/http';

import { FacebookApi } from '@/infra/apis';

describe('Facebook Api', () => {
  let httpGetClient: MockProxy<HttpGetClient>;
  let sut: FacebookApi;

  const clientToken = 'any_client_token';
  const clientId = 'any_client_id';
  const clientSecret = 'any_client_secret';

  beforeAll(() => {
    httpGetClient = mock();
  });

  beforeEach(() => {
    httpGetClient.get.mockResolvedValueOnce({ access_token: 'any_app_token' });
    sut = new FacebookApi(httpGetClient, clientId, clientSecret);
  });

  it('should get app token', async () => {
    await sut.loadUser({ token: clientToken });

    expect(httpGetClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      },
    });
  });

  it('should get debug token', async () => {
    await sut.loadUser({ token: clientToken });

    expect(httpGetClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/debug_token',
      params: {
        access_token: 'any_app_token',
        input_token: clientToken,
      },
    });
  });
});
