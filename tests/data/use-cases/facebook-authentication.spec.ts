/* eslint-disable no-unused-vars */
/* eslint-disable max-classes-per-file */
import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { FacebookAuthenticationUseCase } from '@/data/use-cases';
import { AuthenticationError } from '@/domain/errors';

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  public token: string = '';
  public result: undefined = undefined;
  public callsCount: number = 0;

  async loadUser({ token }: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    this.token = token;
    this.callsCount++;
    return this.result;
  }
}

type SutTypes = {
  sut: FacebookAuthenticationUseCase;
  loadFacebookUserApi: LoadFacebookUserApiSpy;
}

const makeSut = (): SutTypes => {
  const loadFacebookUserApi = new LoadFacebookUserApiSpy();
  const sut = new FacebookAuthenticationUseCase(loadFacebookUserApi);
  return { sut, loadFacebookUserApi };
};

describe('FacebookAuthenticationUseCase', () => {
  it('should call LoadFacebookUserApi with correct params', async () => {
    const { sut, loadFacebookUserApi } = makeSut();

    await sut.perform({ token: 'any_token' });

    expect(loadFacebookUserApi.token).toBe('any_token');
    expect(loadFacebookUserApi.callsCount).toBe(1);
  });

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const { sut, loadFacebookUserApi } = makeSut();
    loadFacebookUserApi.result = undefined;

    const authResult = await sut.perform({ token: 'any_token' });

    expect(authResult).toEqual(new AuthenticationError());
  });
});
