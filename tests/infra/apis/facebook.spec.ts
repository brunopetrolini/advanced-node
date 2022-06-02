/* eslint-disable no-unused-vars */
import { mock, MockProxy } from 'jest-mock-extended';

import type { HttpGetClient } from '@/infra/http';

import { FacebookApi } from '@/infra/apis';

describe('Facebook Api', () => {
  let httpGetClient: MockProxy<HttpGetClient>;
  let sut: FacebookApi;

  const clientId = 'any_client_id';
  const clientSecret = 'any_client_secret';

  beforeAll(() => {
    httpGetClient = mock();
  });

  beforeEach(() => {
    sut = new FacebookApi(httpGetClient, clientId, clientSecret);
  });

  it('should get app token', async () => {
    await sut.loadUser({ token: 'any_client_token' });

    expect(httpGetClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      },
    });
  });
});
