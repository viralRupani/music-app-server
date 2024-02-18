import { MigrationInterface, QueryRunner } from 'typeorm';

export class AuthOtpChagnes1708234472899 implements MigrationInterface {
  name = 'AuthOtpChagnes1708234472899';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "otp" ADD "is_active" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "otp" ALTER COLUMN "created_at" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "otp" ALTER COLUMN "created_at" SET DEFAULT '2024-02-17 16:35:10.996'`,
    );
    await queryRunner.query(`ALTER TABLE "otp" DROP COLUMN "is_active"`);
  }
}
