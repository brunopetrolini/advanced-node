/* eslint-disable no-unused-vars */
type FacebookUserData = {
  facebookId: string;
  name: string;
  email: string;
}

export namespace LoadFacebookUserApi {
  export type Params = {
    token: string;
  }
  export type Result = FacebookUserData | undefined
}

export interface LoadFacebookUserApi {
  loadUser(params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result>;
}
