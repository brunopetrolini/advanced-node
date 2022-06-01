import { AccessToken } from '@/domain/entities';

describe('Access Token Entity', () => {
  it('should create with a value', () => {
    const sut = new AccessToken('any_value');

    expect(sut).toEqual({ value: 'any_value' });
  });
});
