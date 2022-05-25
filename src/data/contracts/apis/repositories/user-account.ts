/* eslint-disable no-unused-vars */
export namespace LoadUserByEmailRepository {
  export type Params = {
    email: string
  }
}

export interface LoadUserAccountRepository {
  load(params: LoadUserByEmailRepository.Params): Promise<void>;
}
