/* eslint-disable no-unused-vars */
export namespace TokenGenerator {
  export type Params = {
    key: string;
    expirationInMs: number;
  }
  export type Result = string;
}

export interface TokenGenerator {
  generateToken(params: TokenGenerator.Params): Promise<TokenGenerator.Result>;
}
