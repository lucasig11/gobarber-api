import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddIsProviderFieldToUsers1619873296876
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'isProvider',
        type: 'boolean',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'isProvider');
  }
}
