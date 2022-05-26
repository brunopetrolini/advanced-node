/* eslint-disable no-unused-vars */
type LoadUserAccountResult = {
  id: string;
  name?: string;
}

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string
  }
  export type Result = LoadUserAccountResult | undefined
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

export namespace UpdateFacebookAccountRepository {
  export type Params = {
    id: string
    name: string
    facebookId: string
  }
}

export interface UpdateFacebookAccountRepository {
  updateWithFacebook(params: UpdateFacebookAccountRepository.Params): Promise<void>;
}

export namespace SaveFacebookAccountRepository {
  export type Params = {
    id?: string;
    name: string;
    email: string;
    facebookId: string;
  }
}

export interface SaveFacebookAccountRepository {
  saveWithFacebook(params: SaveFacebookAccountRepository.Params): Promise<void>;
}
