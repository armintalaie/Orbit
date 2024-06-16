import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.withSchema('auth').alterTable('users').addUniqueConstraint('user_id_unique', ['id']).execute();
}

export async function down(db: Kysely<any>): Promise<void> {}
