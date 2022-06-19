import jwt from 'jsonwebtoken';

import { TokenGenerator } from '@/data/contracts/cryptograph';

jest.mock('jsonwebtoken');

class JwtTokenGenerator {
  private readonly secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  async generateToken({ key, expirationInMs }: TokenGenerator.Params): Promise<void> {
    const expirationInSeconds = expirationInMs / 1000;
    jwt.sign({ key }, this.secret, { expiresIn: expirationInSeconds });
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
  });

  beforeEach(() => {
    sut = new JwtTokenGenerator(secret);
  });

  it('should call jwt.sign with correct params', async () => {
    await sut.generateToken({ key, expirationInMs });

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1 });
    expect(fakeJwt.sign).toHaveBeenCalledTimes(1);
  });
});
