/* eslint-disable no-unused-vars */
export namespace LoadUserAccountRepository {
  export type Params = {
    email: string
  }
  export type Result = undefined
}

export interface LoadUserAccountRepository {
  load(params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result>;
}

export namespace CreateFacebookAccountRepository {
  export type Params = {
    facebookId: string
    name: string
    email: string
  }
}

export interface CreateFacebookAccountRepository {
  createFromFacebook(params: CreateFacebookAccountRepository.Params): Promise<void>;
}
