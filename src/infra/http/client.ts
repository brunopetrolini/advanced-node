/* eslint-disable no-unused-vars */
export namespace HttpGetClient {
  export type Params = {
    url: string,
    params: Object
  }
}

export interface HttpGetClient {
  get<ResponseType = any>(params: HttpGetClient.Params): Promise<ResponseType>
}
