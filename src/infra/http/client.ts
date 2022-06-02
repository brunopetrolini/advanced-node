/* eslint-disable no-unused-vars */
export namespace HttpGetClient {
  export type Params = {
    url: string
    params: Object
  }
  export type Result = any
}

export interface HttpGetClient {
  get(params: HttpGetClient.Params): Promise<HttpGetClient.Result>
}
