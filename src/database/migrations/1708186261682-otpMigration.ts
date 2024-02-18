import { MigrationInterface, QueryRunner } from 'typeorm';

export class OtpMigration1708186261682 implements MigrationInterface {
  name = 'OtpMigration1708186261682';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."otp_otp_type_enum" AS ENUM('Forgot Password')`,
    );
    await queryRunner.query(
      `CREATE TABLE "otp" ("email" character varying NOT NULL, "otp" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT '"2024-02-17T16:11:02.983Z"', "otp_type" "public"."otp_otp_type_enum" NOT NULL, CONSTRAINT "PK_f77fabee8ceb16458c9cac2db1f" PRIMARY KEY ("email", "otp"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "otp"`);
    await queryRunner.query(`DROP TYPE "public"."otp_otp_type_enum"`);
  }
}
