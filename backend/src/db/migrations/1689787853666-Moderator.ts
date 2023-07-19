import { MigrationInterface, QueryRunner } from "typeorm";

export class Moderator1689787853666 implements MigrationInterface {
    name = 'Moderator1689787853666'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" ADD "moderator_id" character varying`);
        await queryRunner.query(`CREATE INDEX "IDX_7127e358f4f0bf8686d77af14c" ON "sessions" ("moderator_id") `);
        await queryRunner.query(`ALTER TABLE "sessions" ADD CONSTRAINT "FK_7127e358f4f0bf8686d77af14cd" FOREIGN KEY ("moderator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`UPDATE "sessions" SET "moderator_id" = "created_by_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_7127e358f4f0bf8686d77af14cd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7127e358f4f0bf8686d77af14c"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "moderator_id"`);
    }

}
