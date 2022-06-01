/* eslint-disable no-unused-vars */
import { AuthenticationError } from '@/domain/errors';
import { AccessToken } from '@/domain/entities';

export namespace FacebookAuthentication {
  export type Params = {
    token: string
  }
  export type Result = AccessToken | AuthenticationError
}

export interface FacebookAuthentication {
  perform(params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result>;
}
