-- Adminer 5.5.1 PostgreSQL 16.14 dump

CREATE DATABASE "evaluation";
\connect "evaluation";

DROP TABLE IF EXISTS "adminTB";
DROP SEQUENCE IF EXISTS "public"."adminTB_admin_id_seq";
CREATE SEQUENCE "public"."adminTB_admin_id_seq" INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."adminTB" (
    "admin_id" integer DEFAULT nextval('public."adminTB_admin_id_seq"') NOT NULL,
    "email" character varying(50) NOT NULL,
    "password_hash" character varying(255) NOT NULL,
    "first_name" character varying,
    "last_name" character varying(50),
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "profile_picture" text,
    "number" character varying(20),
    CONSTRAINT "adminTB_pkey" PRIMARY KEY ("admin_id")
)
WITH (oids = false);

CREATE UNIQUE INDEX "adminTB_email" ON public."adminTB" USING btree (email);


DROP TABLE IF EXISTS "scoreTB";
DROP SEQUENCE IF EXISTS "public"."scoreTB_score_id_seq";
CREATE SEQUENCE "public"."scoreTB_score_id_seq" INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."scoreTB" (
    "score_id" integer DEFAULT nextval('public."scoreTB_score_id_seq"') NOT NULL,
    "section_id" integer NOT NULL,
    "student_id" integer NOT NULL,
    "score_value" integer DEFAULT '0' NOT NULL,
    CONSTRAINT "scoreTB_pkey" PRIMARY KEY ("score_id")
)
WITH (oids = false);

INSERT INTO "scoreTB" ("score_id", "section_id", "student_id", "score_value") VALUES
(1,	1,	16,	0),
(2,	2,	16,	0),
(3,	3,	16,	0);

DROP TABLE IF EXISTS "sectionTB";
DROP SEQUENCE IF EXISTS "public"."sectionTB_section_id_seq";
CREATE SEQUENCE "public"."sectionTB_section_id_seq" INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."sectionTB" (
    "section_id" integer DEFAULT nextval('public."sectionTB_section_id_seq"') NOT NULL,
    "section_name" character varying(50) NOT NULL,
    "max_score" integer DEFAULT '1' NOT NULL,
    CONSTRAINT "sectionTB_pkey" PRIMARY KEY ("section_id")
)
WITH (oids = false);

INSERT INTO "sectionTB" ("section_id", "section_name", "max_score") VALUES
(1,	'โจทย์1',	1),
(2,	'โจทย์2',	1),
(3,	'โจทย์3',	1);

DROP TABLE IF EXISTS "studentTB";
DROP SEQUENCE IF EXISTS "public"."studnetTB_student_id_seq";
CREATE SEQUENCE "public"."studnetTB_student_id_seq" INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."studentTB" (
    "student_id" integer DEFAULT nextval('public."studnetTB_student_id_seq"') NOT NULL,
    "email" character varying(50) NOT NULL,
    "password_hash" character varying(255) NOT NULL,
    "first_name" character varying(50),
    "last_name" character varying(50),
    "number" character varying(20),
    "profile_picture" text,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT "studnetTB_pkey" PRIMARY KEY ("student_id")
)
WITH (oids = false);

CREATE UNIQUE INDEX "studnetTB_email" ON public."studentTB" USING btree (email);

INSERT INTO "studentTB" ("student_id", "email", "password_hash", "first_name", "last_name", "number", "profile_picture", "created_at") VALUES
(16,	'Test2@gmail.com',	'$2b$10$l6fM6Jkqq78Q792xuZeR6eEQr7SupMYQj7qd8z1MklFvPFi/31Wfi',	'Test',	'D',	'1',	NULL,	'2026-08-14 16:50:08.184131+00');

ALTER TABLE ONLY "public"."scoreTB" ADD CONSTRAINT "scoreTB_section_id_fkey" FOREIGN KEY (section_id) REFERENCES "public"."sectionTB"(section_id);
ALTER TABLE ONLY "public"."scoreTB" ADD CONSTRAINT "scoreTB_student_id_fkey" FOREIGN KEY (student_id) REFERENCES "public"."studentTB"(student_id);

-- 2026-08-14 16:50:57 UTC
