import { MigrationInterface, QueryRunner } from 'typeorm';

export class OtpChanges1708187709715 implements MigrationInterface {
  name = 'OtpChanges1708187709715';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "otp" ALTER COLUMN "created_at" SET DEFAULT '"2024-02-17T16:35:10.996Z"'`,
    );
    await queryRunner.query(
      `ALTER TABLE "otp" ADD CONSTRAINT "FK_463cf01e0ea83ad57391fd4e1d7" FOREIGN KEY ("email") REFERENCES "user"("email") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "otp" DROP CONSTRAINT "FK_463cf01e0ea83ad57391fd4e1d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "otp" ALTER COLUMN "created_at" SET DEFAULT '2024-02-17 16:11:02.983'`,
    );
  }
}
