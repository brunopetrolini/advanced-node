/* eslint-disable no-unused-vars */
type RequestParams = {
  client_id: string
  client_secret: string
  grant_type: string
}

export namespace HttpGetClient {
  export type Params = {
    url: string
    params: RequestParams
  }
}

export interface HttpGetClient {
  get(params: HttpGetClient.Params): Promise<void>
}
