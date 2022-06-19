import jwt from 'jsonwebtoken';

import { TokenGenerator } from '@/data/contracts/cryptograph';

export class JwtTokenGenerator implements TokenGenerator {
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
