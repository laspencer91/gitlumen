import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1754796929446 implements MigrationInterface {
    name = 'InitialSchema1754796929446'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "api_keys" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "keyHash" character varying(255) NOT NULL, "keyPrefix" character varying(6) NOT NULL, "lastUsedAt" TIMESTAMP, "expiresAt" TIMESTAMP, "isActive" boolean NOT NULL DEFAULT true, "permissions" jsonb, "organizationId" uuid NOT NULL, CONSTRAINT "PK_5c8a79801b44bd27b79228e1dad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_df3b25181df0b4b59bd93f16e1" ON "api_keys" ("keyHash") `);
        await queryRunner.query(`CREATE TYPE "public"."project_team_members_accesslevel_enum" AS ENUM('developer', 'maintainer', 'owner', 'guest')`);
        await queryRunner.query(`CREATE TABLE "project_team_members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "externalUserId" character varying(255) NOT NULL, "username" character varying(255) NOT NULL, "name" character varying(255) NOT NULL, "email" character varying(255), "avatarUrl" character varying(500), "accessLevel" "public"."project_team_members_accesslevel_enum", "isTracked" boolean NOT NULL DEFAULT true, "metadata" jsonb, "projectId" uuid NOT NULL, CONSTRAINT "UQ_e033b1ed7931d86d26b2f38ecd0" UNIQUE ("projectId", "externalUserId"), CONSTRAINT "PK_005000583312b398393c8296d18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_86619ec18e15b2ccadcf1c8080" ON "project_team_members" ("externalUserId") `);
        await queryRunner.query(`CREATE INDEX "IDX_fd189ab840395c39c11bbe14a8" ON "project_team_members" ("username") `);
        await queryRunner.query(`CREATE TABLE "project_event_subscriptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "eventType" character varying(100) NOT NULL, "isEnabled" boolean NOT NULL DEFAULT true, "filters" jsonb, "projectId" uuid NOT NULL, CONSTRAINT "UQ_6df8d7bbeebe9d1fb888184b1e2" UNIQUE ("projectId", "eventType"), CONSTRAINT "PK_b6cb46b39821eac4f912c039e12" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."organization_members_role_enum" AS ENUM('owner', 'admin', 'member')`);
        await queryRunner.query(`CREATE TABLE "organization_members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying(255) NOT NULL, "name" character varying(255) NOT NULL, "role" "public"."organization_members_role_enum" NOT NULL DEFAULT 'member', "isActive" boolean NOT NULL DEFAULT true, "invitedAt" TIMESTAMP, "acceptedAt" TIMESTAMP, "organizationId" uuid NOT NULL, CONSTRAINT "UQ_ff8c56fcba4ee5c761a45e6df36" UNIQUE ("organizationId", "email"), CONSTRAINT "PK_c2b39d5d072886a4d9c8105eb9a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9c80e55c83225dde0052ff13ac" ON "organization_members" ("email") `);
        await queryRunner.query(`CREATE TYPE "public"."provider_configs_type_enum" AS ENUM('gitlab', 'github', 'bitbucket')`);
        await queryRunner.query(`CREATE TABLE "provider_configs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "type" "public"."provider_configs_type_enum" NOT NULL, "baseUrl" character varying(500) NOT NULL, "accessToken" text NOT NULL, "webhookSecret" character varying(255), "isActive" boolean NOT NULL DEFAULT true, "metadata" jsonb, "organizationId" uuid NOT NULL, CONSTRAINT "PK_00bf1b21735102954736b29cdb8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_65925f7599469b8fa706e6ae3a" ON "provider_configs" ("type") `);
        await queryRunner.query(`CREATE TABLE "project_plugin_configs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isEnabled" boolean NOT NULL DEFAULT true, "config" jsonb NOT NULL, "projectId" uuid NOT NULL, "pluginConfigId" uuid NOT NULL, CONSTRAINT "UQ_a35162690bbf89216a476057cf8" UNIQUE ("projectId", "pluginConfigId"), CONSTRAINT "PK_319aa5609ae2fdbca38e975c3e1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "plugin_configs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "type" character varying(100) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "config" jsonb NOT NULL, "organizationId" uuid NOT NULL, CONSTRAINT "PK_bdd4a426a59373a5783d9a65857" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f64230f76d1e7e8dca7806073a" ON "plugin_configs" ("type") `);
        await queryRunner.query(`CREATE TABLE "organizations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "description" text, "isActive" boolean NOT NULL DEFAULT true, "settings" jsonb, CONSTRAINT "UQ_963693341bd612aa01ddf3a4b68" UNIQUE ("slug"), CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_963693341bd612aa01ddf3a4b6" ON "organizations" ("slug") `);
        await queryRunner.query(`CREATE TYPE "public"."event_logs_status_enum" AS ENUM('pending', 'processed', 'failed')`);
        await queryRunner.query(`CREATE TABLE "event_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "eventType" character varying(100) NOT NULL, "eventSourceId" character varying(255), "authorExternalId" character varying(255), "eventData" jsonb NOT NULL, "status" "public"."event_logs_status_enum" NOT NULL DEFAULT 'pending', "error" text, "processedAt" TIMESTAMP, "metadata" jsonb, "organizationId" uuid NOT NULL, "projectId" uuid NOT NULL, "providerConfigId" uuid NOT NULL, CONSTRAINT "PK_b09cf1bb58150797d898076b242" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5fbf370d1f8f376f65c4b309aa" ON "event_logs" ("eventType") `);
        await queryRunner.query(`CREATE INDEX "IDX_5230004f637f14da071f1ccee3" ON "event_logs" ("eventSourceId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8052912461f7dd4daf999d43b3" ON "event_logs" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_b689c9ad1865829626c75cd870" ON "event_logs" ("status", "createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_861870b3f4b785153d3a859430" ON "event_logs" ("projectId", "createdAt") `);
        await queryRunner.query(`CREATE TABLE "webhook_deliveries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "projectId" uuid NOT NULL, "eventLogId" uuid, "webhookUrl" character varying(500) NOT NULL, "headers" jsonb NOT NULL, "payload" jsonb NOT NULL, "responseStatus" integer, "responseHeaders" jsonb, "responseBody" text, "duration" integer NOT NULL, "isValid" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_535dd409947fb6d8fc6dfc0112a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f4e42f907338c690b5a2a956de" ON "webhook_deliveries" ("projectId") `);
        await queryRunner.query(`CREATE INDEX "IDX_1b313323c2daa0961818975be5" ON "webhook_deliveries" ("projectId", "createdAt") `);
        await queryRunner.query(`CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "description" text, "externalId" character varying(255) NOT NULL, "webUrl" character varying(500) NOT NULL, "defaultBranch" character varying(255), "webhookId" character varying(255) NOT NULL, "lastSyncedAt" TIMESTAMP, "isActive" boolean NOT NULL DEFAULT true, "metadata" jsonb, "organizationId" uuid NOT NULL, "providerConfigId" uuid NOT NULL, CONSTRAINT "UQ_70f018cadd8b281c5c8bfe5d508" UNIQUE ("webhookId"), CONSTRAINT "UQ_72f01c3b3eed28a8785bf997ead" UNIQUE ("organizationId", "slug"), CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_96e045ab8b0271e5f5a91eae1e" ON "projects" ("slug") `);
        await queryRunner.query(`CREATE INDEX "IDX_cf4ff07d1a8a205ab007b004cb" ON "projects" ("externalId") `);
        await queryRunner.query(`CREATE INDEX "IDX_70f018cadd8b281c5c8bfe5d50" ON "projects" ("webhookId") `);
        await queryRunner.query(`ALTER TABLE "api_keys" ADD CONSTRAINT "FK_1888b4544f52d274e98f6f1aa62" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_team_members" ADD CONSTRAINT "FK_0f3370a56d2658d30d7583cf12b" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_event_subscriptions" ADD CONSTRAINT "FK_f0fad8e60ad3faa2aa8937cd161" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_members" ADD CONSTRAINT "FK_5652c2c6b066835b6c500d0d83f" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_configs" ADD CONSTRAINT "FK_faa6801946ba0e76314d423bf7a" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_plugin_configs" ADD CONSTRAINT "FK_19a8646b5246e15481c6cc0c643" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_plugin_configs" ADD CONSTRAINT "FK_adef35029fb60579a52a986cf0c" FOREIGN KEY ("pluginConfigId") REFERENCES "plugin_configs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plugin_configs" ADD CONSTRAINT "FK_19e8305109c12ae58c1561d4d12" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_logs" ADD CONSTRAINT "FK_136791fc445acdb895ec4ed15cb" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_logs" ADD CONSTRAINT "FK_92d715f8fce27963309b8767c37" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_logs" ADD CONSTRAINT "FK_5b656663887033e8c741492c93d" FOREIGN KEY ("providerConfigId") REFERENCES "provider_configs"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_eec93fd979bdcf5a0141da324d6" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_2297d28b9a784bdd1f272dbadbd" FOREIGN KEY ("providerConfigId") REFERENCES "provider_configs"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_2297d28b9a784bdd1f272dbadbd"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_eec93fd979bdcf5a0141da324d6"`);
        await queryRunner.query(`ALTER TABLE "event_logs" DROP CONSTRAINT "FK_5b656663887033e8c741492c93d"`);
        await queryRunner.query(`ALTER TABLE "event_logs" DROP CONSTRAINT "FK_92d715f8fce27963309b8767c37"`);
        await queryRunner.query(`ALTER TABLE "event_logs" DROP CONSTRAINT "FK_136791fc445acdb895ec4ed15cb"`);
        await queryRunner.query(`ALTER TABLE "plugin_configs" DROP CONSTRAINT "FK_19e8305109c12ae58c1561d4d12"`);
        await queryRunner.query(`ALTER TABLE "project_plugin_configs" DROP CONSTRAINT "FK_adef35029fb60579a52a986cf0c"`);
        await queryRunner.query(`ALTER TABLE "project_plugin_configs" DROP CONSTRAINT "FK_19a8646b5246e15481c6cc0c643"`);
        await queryRunner.query(`ALTER TABLE "provider_configs" DROP CONSTRAINT "FK_faa6801946ba0e76314d423bf7a"`);
        await queryRunner.query(`ALTER TABLE "organization_members" DROP CONSTRAINT "FK_5652c2c6b066835b6c500d0d83f"`);
        await queryRunner.query(`ALTER TABLE "project_event_subscriptions" DROP CONSTRAINT "FK_f0fad8e60ad3faa2aa8937cd161"`);
        await queryRunner.query(`ALTER TABLE "project_team_members" DROP CONSTRAINT "FK_0f3370a56d2658d30d7583cf12b"`);
        await queryRunner.query(`ALTER TABLE "api_keys" DROP CONSTRAINT "FK_1888b4544f52d274e98f6f1aa62"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_70f018cadd8b281c5c8bfe5d50"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cf4ff07d1a8a205ab007b004cb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_96e045ab8b0271e5f5a91eae1e"`);
        await queryRunner.query(`DROP TABLE "projects"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1b313323c2daa0961818975be5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f4e42f907338c690b5a2a956de"`);
        await queryRunner.query(`DROP TABLE "webhook_deliveries"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_861870b3f4b785153d3a859430"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b689c9ad1865829626c75cd870"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8052912461f7dd4daf999d43b3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5230004f637f14da071f1ccee3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5fbf370d1f8f376f65c4b309aa"`);
        await queryRunner.query(`DROP TABLE "event_logs"`);
        await queryRunner.query(`DROP TYPE "public"."event_logs_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_963693341bd612aa01ddf3a4b6"`);
        await queryRunner.query(`DROP TABLE "organizations"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f64230f76d1e7e8dca7806073a"`);
        await queryRunner.query(`DROP TABLE "plugin_configs"`);
        await queryRunner.query(`DROP TABLE "project_plugin_configs"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_65925f7599469b8fa706e6ae3a"`);
        await queryRunner.query(`DROP TABLE "provider_configs"`);
        await queryRunner.query(`DROP TYPE "public"."provider_configs_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9c80e55c83225dde0052ff13ac"`);
        await queryRunner.query(`DROP TABLE "organization_members"`);
        await queryRunner.query(`DROP TYPE "public"."organization_members_role_enum"`);
        await queryRunner.query(`DROP TABLE "project_event_subscriptions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fd189ab840395c39c11bbe14a8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_86619ec18e15b2ccadcf1c8080"`);
        await queryRunner.query(`DROP TABLE "project_team_members"`);
        await queryRunner.query(`DROP TYPE "public"."project_team_members_accesslevel_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_df3b25181df0b4b59bd93f16e1"`);
        await queryRunner.query(`DROP TABLE "api_keys"`);
    }

}
