import { FacebookAccount } from '@/domain/entities';

describe('Facebook Account Entity', () => {
  const facebookData = {
    name: 'any_facebook_name',
    email: 'any_facebook_email',
    facebookId: 'any_facebook_id',
  };

  const accountData = {
    id: 'any_id',
    name: 'any_name',
  };

  it('should create with facebook data only', () => {
    const sut = new FacebookAccount(facebookData);

    expect(sut).toEqual(facebookData);
  });

  it('should update name if its empty', () => {
    const sut = new FacebookAccount(facebookData, { id: accountData.id });

    expect(sut).toEqual({ id: accountData.id, ...facebookData });
  });

  it('should not update name if its not empty', () => {
    const sut = new FacebookAccount(facebookData, accountData);

    expect(sut).toEqual({
      ...accountData,
      email: facebookData.email,
      facebookId: facebookData.facebookId,
    });
  });
});
