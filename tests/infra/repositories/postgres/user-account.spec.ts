/* eslint-disable max-classes-per-file */
import {
  Column, Entity, getRepository, PrimaryGeneratedColumn,
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

describe('PgUserAccountRepository', () => {
  describe('load', () => {
    it('should return an account if email exists', async () => {
      const db = newDb();
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser],
      });
      await connection.synchronize();

      const pgUserRepository = getRepository(PgUser);
      await pgUserRepository.save({ email: 'existing_email' });
      const sut = new PgUserAccountRepository();

      const account = await sut.load({ email: 'existing_email' });

      expect(account).toEqual({ id: '1' });
    });
  });
});
