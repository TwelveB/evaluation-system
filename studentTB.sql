-- Adminer 5.5.1 PostgreSQL 16.14 dump

CREATE DATABASE "evaluation";
\connect "evaluation";

DROP TABLE IF EXISTS "studentTB";
CREATE TABLE "public"."studentTB" (
    "studentID" uuid DEFAULT gen_random_uuid() NOT NULL,
    "email" character varying(60) NOT NULL,
    "password_hash" character varying(20),
    "first_name" character varying(50),
    "last_name" character varying(50),
    "number" character varying(20)
)
WITH (oids = false);

INSERT INTO "studentTB" ("studentID", "email", "password_hash", "first_name", "last_name", "number") VALUES
('08fa5576-5cc6-4ca0-8195-a6c459b87b39',	'Test@gmail.com',	'1',	'Test',	'ระบบ',	'1');

-- 2026-08-09 08:01:38 UTC
