import { MigrationInterface, QueryRunner } from "typeorm";

export class ModeratorNonNull1689787951867 implements MigrationInterface {
    name = 'ModeratorNonNull1689787951867'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_1ccf045da14e5350b26ee882592"`);
        await queryRunner.query(`ALTER TABLE "sessions" ALTER COLUMN "created_by_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD CONSTRAINT "FK_1ccf045da14e5350b26ee882592" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_1ccf045da14e5350b26ee882592"`);
        await queryRunner.query(`ALTER TABLE "sessions" ALTER COLUMN "created_by_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD CONSTRAINT "FK_1ccf045da14e5350b26ee882592" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
