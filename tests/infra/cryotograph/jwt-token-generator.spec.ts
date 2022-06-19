import jwt from 'jsonwebtoken';

import { TokenGenerator } from '@/data/contracts/cryptograph';

jest.mock('jsonwebtoken');

class JwtTokenGenerator {
  private readonly secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  async generateToken(params: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const expirationInSeconds = params.expirationInMs / 1000;
    const token = jwt.sign(
      { key: params.key },
      this.secret,
      { expiresIn: expirationInSeconds },
    );
    return token;
  }
}

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
});
