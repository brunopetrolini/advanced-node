import axios from 'axios';

import { HttpGetClient } from './client';

export class AxiosHttpClient {
  async get<ResponseType = any>(args: HttpGetClient.Params): Promise<ResponseType> {
    const result = await axios.get(args.url, { params: args.params });
    return result.data;
  }
}
