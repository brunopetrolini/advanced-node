/* eslint-disable max-classes-per-file */
import {
  Column, Entity, getConnection, getRepository, PrimaryGeneratedColumn, Repository,
} from 'typeorm';
import { newDb } from 'pg-mem';

import { LoadUserAccountRepository } from '@/data/contracts/repositories';

@Entity({ name: 'usuarios' })
class PgUser {
  @PrimaryGeneratedColumn('increment')
    id!: number;

  @Column({ name: 'nome', nullable: true })
    name?: string;

  @Column()
    email!: string;

  @Column({ name: 'id_facebook', nullable: true })
    facebookId?: string;
}

class PgUserAccountRepository implements LoadUserAccountRepository {
  async load({ email }: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepository = getRepository(PgUser);
    const user = await pgUserRepository.findOne({ where: { email } });
    if (user !== undefined) {
      return {
        id: user.id.toString(),
        name: user.name ?? undefined,
      };
    }
    return undefined;
  }
}

const makeFakeDatabase = (): void => {

};

describe('PgUserAccountRepository', () => {
  describe('load', () => {
    let sut: PgUserAccountRepository;
    let pgUserRepository: Repository<PgUser>;

    beforeEach(async () => {
      const db = newDb();
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser],
      });
      await connection.synchronize();

      pgUserRepository = getRepository(PgUser);
      sut = new PgUserAccountRepository();
    });

    afterEach(async () => {
      await getConnection().close();
    });

    it('should return an account if email exists', async () => {
      await pgUserRepository.save({ email: 'existing_email' });

      const account = await sut.load({ email: 'existing_email' });

      expect(account).toEqual({ id: '1' });
    });

    it('should return undefined if email does not exists', async () => {
      const account = await sut.load({ email: 'new_email' });

      expect(account).toBeUndefined();
    });
  });
});
