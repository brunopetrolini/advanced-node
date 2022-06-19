import jwt from 'jsonwebtoken';

import { JwtTokenGenerator } from '@/infra/cryptograph';

jest.mock('jsonwebtoken');

describe('Jwt Token Generator', () => {
  let fakeJwt: jest.Mocked<typeof jwt>;
  let sut: JwtTokenGenerator;

  const secret = 'any_secret';
  const key = 'any_key';
  const expirationInMs = 1000;

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>;
    fakeJwt.sign.mockImplementation(() => 'any_token');
  });

  beforeEach(() => {
    sut = new JwtTokenGenerator(secret);
  });

  it('should call jwt.sign with correct params', async () => {
    await sut.generateToken({ key, expirationInMs });

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1 });
    expect(fakeJwt.sign).toHaveBeenCalledTimes(1);
  });

  it('should return a token', async () => {
    const token = await sut.generateToken({ key, expirationInMs });

    expect(token).toBe('any_token');
  });

  it('should rethrow if jwt.sign throws', async () => {
    fakeJwt.sign.mockImplementationOnce(() => {
      throw new Error('token_error');
    });

    const promise = sut.generateToken({ key, expirationInMs });

    await expect(promise).rejects.toThrowError('token_error');
  });
});
