import { MigrationInterface, QueryRunner } from "typeorm";

export class MoreOptions1689628225524 implements MigrationInterface {
    name = 'MoreOptions1689628225524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "templates" ADD "options_restrict_title_edit_to_owner" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "templates" ADD "options_restrict_reordering_to_owner" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "templates" ADD "options_restrict_grouping_to_owner" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "options_restrict_title_edit_to_owner" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "options_restrict_reordering_to_owner" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "options_restrict_grouping_to_owner" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "options_restrict_grouping_to_owner"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "options_restrict_reordering_to_owner"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "options_restrict_title_edit_to_owner"`);
        await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "options_restrict_grouping_to_owner"`);
        await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "options_restrict_reordering_to_owner"`);
        await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "options_restrict_title_edit_to_owner"`);
    }

}
