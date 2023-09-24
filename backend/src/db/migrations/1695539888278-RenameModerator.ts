import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameModerator1695539888278 implements MigrationInterface {
    name = 'RenameModerator1695539888278'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "templates" ADD "options_restrict_title_edit_to_moderator" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "templates" ADD "options_restrict_reordering_to_moderator" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "templates" ADD "options_restrict_grouping_to_moderator" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "options_restrict_title_edit_to_moderator" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "options_restrict_reordering_to_moderator" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "options_restrict_grouping_to_moderator" boolean NOT NULL DEFAULT false`);

        await queryRunner.query(`UPDATE "templates" SET 
            options_restrict_title_edit_to_moderator = options_restrict_title_edit_to_owner,
            options_restrict_reordering_to_moderator = options_restrict_reordering_to_owner,
            options_restrict_grouping_to_moderator = options_restrict_grouping_to_owner
        `);
        await queryRunner.query(`UPDATE "sessions" SET 
            options_restrict_title_edit_to_moderator = options_restrict_title_edit_to_owner,
            options_restrict_reordering_to_moderator = options_restrict_reordering_to_owner,
            options_restrict_grouping_to_moderator = options_restrict_grouping_to_owner
        `);
        await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "options_restrict_title_edit_to_owner"`);
        await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "options_restrict_reordering_to_owner"`);
        await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "options_restrict_grouping_to_owner"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "options_restrict_title_edit_to_owner"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "options_restrict_reordering_to_owner"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "options_restrict_grouping_to_owner"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_1ccf045da14e5350b26ee882592"`);
        await queryRunner.query(`ALTER TABLE "sessions" ALTER COLUMN "created_by_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD CONSTRAINT "FK_1ccf045da14e5350b26ee882592" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_1ccf045da14e5350b26ee882592"`);
        await queryRunner.query(`ALTER TABLE "sessions" ALTER COLUMN "created_by_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD CONSTRAINT "FK_1ccf045da14e5350b26ee882592" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "options_restrict_grouping_to_owner" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "options_restrict_reordering_to_owner" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "options_restrict_title_edit_to_owner" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "templates" ADD "options_restrict_grouping_to_owner" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "templates" ADD "options_restrict_reordering_to_owner" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "templates" ADD "options_restrict_title_edit_to_owner" boolean NOT NULL DEFAULT false`);

        await queryRunner.query(`UPDATE "templates" SET 
            options_restrict_title_edit_to_owner = options_restrict_title_edit_to_moderator,
            options_restrict_reordering_to_owner = options_restrict_reordering_to_moderator,
            options_restrict_grouping_to_owner = options_restrict_grouping_to_moderator
        `);
        await queryRunner.query(`UPDATE "sessions" SET 
            options_restrict_title_edit_to_owner = options_restrict_title_edit_to_moderator,
            options_restrict_reordering_to_owner = options_restrict_reordering_to_moderator,
            options_restrict_grouping_to_owner = options_restrict_grouping_to_moderator
        `);

        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "options_restrict_grouping_to_moderator"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "options_restrict_reordering_to_moderator"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "options_restrict_title_edit_to_moderator"`);
        await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "options_restrict_grouping_to_moderator"`);
        await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "options_restrict_reordering_to_moderator"`);
        await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "options_restrict_title_edit_to_moderator"`);
        
    }

}
