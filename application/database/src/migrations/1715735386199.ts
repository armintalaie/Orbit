import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  const defaultAvatar =
    'https://vzbnqbrfobqivmismxxj.supabase.co/storage/v1/object/public/profile_photos/default/av4.png';

  await db
    .withSchema('public')
    .schema.createTable('account')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().references('auth.users.id').notNull()
    )
    .addColumn('avatar', 'text', (col) =>
      col.notNull().defaultTo(defaultAvatar)
    )
    .addColumn('first_name', 'text', (col) => col.notNull().defaultTo(''))
    .addColumn('last_name', 'text', (col) => col.notNull().defaultTo(''))
    .addColumn('pronouns', 'text', (col) => col.notNull().defaultTo(''))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.withSchema('public').schema.dropTable('account').execute();
}
