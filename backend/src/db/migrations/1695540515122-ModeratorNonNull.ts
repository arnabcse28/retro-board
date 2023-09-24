import { MigrationInterface, QueryRunner } from "typeorm";

export class ModeratorNonNull1695540515122 implements MigrationInterface {
    name = 'ModeratorNonNull1695540515122'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_7127e358f4f0bf8686d77af14cd"`);
        await queryRunner.query(`ALTER TABLE "sessions" ALTER COLUMN "moderator_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD CONSTRAINT "FK_7127e358f4f0bf8686d77af14cd" FOREIGN KEY ("moderator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_7127e358f4f0bf8686d77af14cd"`);
        await queryRunner.query(`ALTER TABLE "sessions" ALTER COLUMN "moderator_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD CONSTRAINT "FK_7127e358f4f0bf8686d77af14cd" FOREIGN KEY ("moderator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
