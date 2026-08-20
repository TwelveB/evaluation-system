-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               12.3.2-MariaDB - MariaDB Server
-- Server OS:                    Win64
-- HeidiSQL Version:             12.21.0.7344
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for evaluation
CREATE DATABASE IF NOT EXISTS `evaluation` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `evaluation`;

-- Dumping structure for table evaluation.admins
CREATE TABLE IF NOT EXISTS `admins` (
  `admin_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'รหัสผู้ดูแลระบบ (PK)',
  `username` varchar(50) NOT NULL COMMENT 'ชื่อผู้ใช้งานสำหรับเข้าสู่ระบบ (ห้ามซ้ำ)',
  `password_hash` varchar(255) NOT NULL COMMENT 'รหัสผ่านที่เข้ารหัสแล้วเพื่อความปลอดภัย',
  `first_name` varchar(100) NOT NULL COMMENT 'ชื่อจริง',
  `last_name` varchar(100) NOT NULL COMMENT 'นามสกุล',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT 'วันเวลาที่สร้างบัญชีนี้',
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บข้อมูลผู้ดูแลระบบ (HR/Admin)';

-- Dumping data for table evaluation.admins: ~2 rows (approximately)
INSERT INTO `admins` (`admin_id`, `username`, `password_hash`, `first_name`, `last_name`, `created_at`) VALUES
	(1, 'admin', '$2a$10$1miEYxH.Grh67dmmtWTwz.Nu7RhFscQSoF.9ocB7y3Vp1xqXy0mpa', 'สมชาย', 'ใจดี', '2026-08-17 06:45:33'),
	(2, 'admin_it', '$2a$10$1miEYxH.Grh67dmmtWTwz.Nu7RhFscQSoF.9ocB7y3Vp1xqXy0mpa', 'วิภาพร', 'รักระบบ', '2026-08-17 06:45:33');

-- Dumping structure for table evaluation.assessors
CREATE TABLE IF NOT EXISTS `assessors` (
  `assessor_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'รหัสกรรมการผู้ประเมิน (PK)',
  `username` varchar(50) NOT NULL COMMENT 'ชื่อผู้ใช้งานสำหรับเข้าสู่ระบบ',
  `password_hash` varchar(255) NOT NULL COMMENT 'รหัสผ่านที่เข้ารหัสแล้ว',
  `first_name` varchar(100) NOT NULL COMMENT 'ชื่อจริง',
  `last_name` varchar(100) NOT NULL COMMENT 'นามสกุล',
  `phone_number` varchar(10) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL COMMENT 'แผนกหรือฝ่ายที่กรรมการสังกัด',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT 'วันเวลาที่สร้างบัญชีนี้',
  PRIMARY KEY (`assessor_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บข้อมูลคณะกรรมการผู้ประเมิน';

-- Dumping data for table evaluation.assessors: ~2 rows (approximately)
INSERT INTO `assessors` (`assessor_id`, `username`, `password_hash`, `first_name`, `last_name`, `phone_number`, `department`, `created_at`) VALUES
	(1, 'assessor_01', '$2a$10$1miEYxH.Grh67dmmtWTwz.Nu7RhFscQSoF.9ocB7y3Vp1xqXy0mpa', 'ดนัย', 'วิสัยทัศน์', NULL, 'ผู้จัดการฝ่าย IT', '2026-08-17 06:45:33'),
	(2, 'assessor_02', '$2a$10$1miEYxH.Grh67dmmtWTwz.Nu7RhFscQSoF.9ocB7y3Vp1xqXy0mpa', 'สุนิสา', 'รอบคอบ', NULL, 'หัวหน้าทีมพัฒนาซอฟต์แวร์', '2026-08-17 06:45:33');

-- Dumping structure for table evaluation.criteria
CREATE TABLE IF NOT EXISTS `criteria` (
  `criterion_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'รหัสตัวชี้วัดย่อย (PK)',
  `section_id` int(11) NOT NULL COMMENT 'อ้างอิงหมวดหลักที่สังกัด (FK)',
  `title` text NOT NULL COMMENT 'ชื่อตัวชี้วัด',
  `description` text DEFAULT NULL COMMENT 'คำอธิบายเกณฑ์การให้คะแนน',
  `weight` decimal(5,2) DEFAULT 1.00 COMMENT 'น้ำหนักคะแนนเฉพาะข้อนี้',
  `evaluation_type` enum('YES_NO','SCALE_1_4','SCALE_1_5') DEFAULT 'SCALE_1_4' COMMENT 'รูปแบบการประเมิน (YES_NO=มี/ไม่มี, SCALE=สเกลระดับคะแนน)',
  `requires_evidence` tinyint(1) DEFAULT 0 COMMENT 'บังคับแนบหลักฐานหรือไม่? (0=ไม่บังคับ, 1=บังคับ)',
  `min_score` int(11) DEFAULT 1 COMMENT 'คะแนนต่ำสุด',
  `max_score` int(11) DEFAULT 4 COMMENT 'คะแนนสูงสุด',
  PRIMARY KEY (`criterion_id`),
  KEY `section_id` (`section_id`),
  CONSTRAINT `1` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางกำหนดตัวชี้วัดย่อยและรูปแบบการให้คะแนน';

-- Dumping data for table evaluation.criteria: ~3 rows (approximately)
INSERT INTO `criteria` (`criterion_id`, `section_id`, `title`, `description`, `weight`, `evaluation_type`, `requires_evidence`, `min_score`, `max_score`) VALUES
	(1, 1, 'การส่งมอบงานตรงตามเวลา', 'ประเมินจากการส่งมอบโปรแกรมตามระยะเวลาที่กำหนด', 2.00, 'SCALE_1_4', 1, 1, 4),
	(2, 1, 'การจัดทำเอกสารคู่มือระบบ', 'มีเอกสาร System Flow หรือ ER-Diagram ประกอบ', 1.00, 'YES_NO', 1, 0, 1),
	(3, 2, 'ความร่วมมือในการทำงานเป็นทีม', 'การให้ความช่วยเหลือและสื่อสารกับเพื่อนร่วมงาน', 1.00, 'SCALE_1_4', 0, 1, 4);

-- Dumping structure for table evaluation.evaluation_scores
CREATE TABLE IF NOT EXISTS `evaluation_scores` (
  `score_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'รหัสผลคะแนน (PK)',
  `evaluation_id` int(11) NOT NULL COMMENT 'อ้างอิงรอบการประเมิน (FK)',
  `criterion_id` int(11) NOT NULL COMMENT 'อ้างอิงตัวชี้วัดข้อที่ให้คะแนน (FK)',
  `score` decimal(5,2) DEFAULT NULL COMMENT 'คะแนนที่ประเมินให้',
  `comment` text DEFAULT NULL COMMENT 'ความคิดเห็นหรือข้อเสนอแนะรายข้อ',
  PRIMARY KEY (`score_id`),
  UNIQUE KEY `unique_eval_criterion` (`evaluation_id`,`criterion_id`),
  KEY `criterion_id` (`criterion_id`),
  CONSTRAINT `1` FOREIGN KEY (`evaluation_id`) REFERENCES `evaluations` (`evaluation_id`) ON DELETE CASCADE,
  CONSTRAINT `2` FOREIGN KEY (`criterion_id`) REFERENCES `criteria` (`criterion_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางบันทึกผลคะแนนและคอมเมนต์รายตัวชี้วัด';

-- Dumping data for table evaluation.evaluation_scores: ~6 rows (approximately)
INSERT INTO `evaluation_scores` (`score_id`, `evaluation_id`, `criterion_id`, `score`, `comment`) VALUES
	(1, 2, 1, 4.00, 'ส่งงานตรงเวลาเสมอและโค้ดมีคุณภาพ'),
	(2, 2, 2, 1.00, 'มีเอกสาร ER-Diagram ชัดเจน'),
	(3, 2, 3, 3.00, 'สื่อสารได้ดี แต่อยากให้เสนอความคิดเห็นมากขึ้นในที่ประชุม'),
	(4, 1, 1, 4.00, NULL),
	(5, 1, 2, 1.00, NULL),
	(6, 1, 3, 1.00, NULL);

-- Dumping structure for table evaluation.evaluations
CREATE TABLE IF NOT EXISTS `evaluations` (
  `evaluation_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'รหัสรอบการประเมิน (PK)',
  `title` varchar(200) NOT NULL COMMENT 'ชื่องานประเมิน',
  `assessor_id` int(11) NOT NULL COMMENT 'ผู้ประเมิน (FK เชื่อมไป assessors)',
  `student_id` int(11) NOT NULL COMMENT 'ผู้ถูกประเมิน (FK เชื่อมไป students)',
  `committee_role` enum('PRESIDENT','MEMBER') DEFAULT 'MEMBER' COMMENT 'บทบาทกรรมการ (PRESIDENT=ประธาน, MEMBER=กรรมการร่วม)',
  `start_date` datetime NOT NULL COMMENT 'เวลาเปิดระบบให้เริ่มประเมิน',
  `end_date` datetime NOT NULL COMMENT 'เวลาปิดระบบประเมิน',
  `assigned_by` int(11) DEFAULT NULL COMMENT 'ผู้มอบหมายงาน (FK เชื่อมไป admins)',
  `status` enum('PENDING','IN_PROGRESS','COMPLETED') DEFAULT 'PENDING' COMMENT 'สถานะงาน (PENDING=รอทำ, IN_PROGRESS=กำลังทำ, COMPLETED=ส่งผลแล้ว)',
  `document_path` varchar(255) DEFAULT NULL,
  `assessor_signature_path` varchar(255) DEFAULT NULL COMMENT 'ที่เก็บไฟล์ภาพลายเซ็นกรรมการ',
  `assigned_at` timestamp NULL DEFAULT current_timestamp() COMMENT 'วันเวลาที่มอบหมาย',
  `completed_at` timestamp NULL DEFAULT NULL COMMENT 'วันเวลาที่กรรมการส่งผลประเมิน',
  PRIMARY KEY (`evaluation_id`),
  KEY `assessor_id` (`assessor_id`),
  KEY `student_id` (`student_id`),
  KEY `assigned_by` (`assigned_by`),
  CONSTRAINT `1` FOREIGN KEY (`assessor_id`) REFERENCES `assessors` (`assessor_id`) ON DELETE CASCADE,
  CONSTRAINT `2` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `3` FOREIGN KEY (`assigned_by`) REFERENCES `admins` (`admin_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางศูนย์กลางมอบหมายงานและกำหนดช่วงเวลาประเมิน';

-- Dumping data for table evaluation.evaluations: ~3 rows (approximately)
INSERT INTO `evaluations` (`evaluation_id`, `title`, `assessor_id`, `student_id`, `committee_role`, `start_date`, `end_date`, `assigned_by`, `status`, `document_path`, `assessor_signature_path`, `assigned_at`, `completed_at`) VALUES
	(1, 'การประเมินผลงานประจำปี 2026 - มานะ (ประธาน)', 1, 1, 'PRESIDENT', '2026-08-01 00:00:00', '2026-08-31 23:59:59', 1, 'IN_PROGRESS', '/uploads/documents/doc_eval_1_1787243481251.pdf', NULL, '2026-08-17 06:45:33', NULL),
	(2, 'การประเมินผลงานประจำปี 2026 - มานะ (กรรมการ)', 2, 1, 'MEMBER', '2026-08-01 00:00:00', '2026-08-31 23:59:59', 1, 'COMPLETED', NULL, NULL, '2026-08-17 06:45:33', NULL),
	(3, 'การประเมินผลงานประจำปี 2026 - ปิติ (ประธาน)', 1, 2, 'PRESIDENT', '2026-08-01 00:00:00', '2026-08-31 23:59:59', 1, 'PENDING', NULL, NULL, '2026-08-18 15:25:54', NULL);

-- Dumping structure for table evaluation.evidences
CREATE TABLE IF NOT EXISTS `evidences` (
  `evidence_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'รหัสหลักฐาน (PK)',
  `score_id` bigint(20) NOT NULL COMMENT 'อ้างอิงผลคะแนนที่หลักฐานนี้เชื่อมโยงอยู่ (FK)',
  `file_type` enum('PDF','IMAGE','URL') NOT NULL COMMENT 'ประเภทของไฟล์ (PDF, IMAGE, URL)',
  `file_path` varchar(500) NOT NULL COMMENT 'ตำแหน่งไฟล์หรือลิงก์ URL',
  `uploaded_at` timestamp NULL DEFAULT current_timestamp() COMMENT 'วันเวลาที่อัปโหลด',
  PRIMARY KEY (`evidence_id`),
  KEY `score_id` (`score_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บข้อมูลไฟล์หลักฐานประกอบการประเมิน';

-- Dumping data for table evaluation.evidences: ~2 rows (approximately)
INSERT INTO `evidences` (`evidence_id`, `score_id`, `file_type`, `file_path`, `uploaded_at`) VALUES
	(1, 1, 'URL', 'https://github.com/mana/project-delivery-proof', '2026-08-17 06:45:33'),
	(2, 2, 'PDF', '/uploads/evidences/emp001_er_diagram_2026.pdf', '2026-08-17 06:45:33');

-- Dumping structure for table evaluation.sections
CREATE TABLE IF NOT EXISTS `sections` (
  `section_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'รหัสหัวข้อหลัก (PK)',
  `title` varchar(200) NOT NULL COMMENT 'ชื่อหัวข้อหลัก',
  `description` text DEFAULT NULL COMMENT 'คำอธิบายเพิ่มเติมของหัวข้อ',
  `weight` decimal(5,2) DEFAULT 100.00 COMMENT 'น้ำหนักคะแนนรวมของหมวดนี้',
  `created_by` int(11) DEFAULT NULL COMMENT 'รหัสแอดมินที่สร้างหัวข้อนี้ (FK)',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT 'วันเวลาที่สร้าง',
  PRIMARY KEY (`section_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `1` FOREIGN KEY (`created_by`) REFERENCES `admins` (`admin_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางกำหนดหมวดหมู่หรือหัวข้อหลักของการประเมิน';

-- Dumping data for table evaluation.sections: ~2 rows (approximately)
INSERT INTO `sections` (`section_id`, `title`, `description`, `weight`, `created_by`, `created_at`) VALUES
	(1, 'ด้านผลสัมฤทธิ์ของงาน (Performance)', 'ประเมินผลสำเร็จของงานตาม KPI ที่ได้รับมอบหมาย', 60.00, 1, '2026-08-17 06:45:33'),
	(2, 'ด้านพฤติกรรมการทำงาน (Behavior)', 'ประเมินพฤติกรรม การทำงานเป็นทีม และความรับผิดชอบ', 40.00, 1, '2026-08-17 06:45:33');

-- Dumping structure for table evaluation.students
CREATE TABLE IF NOT EXISTS `students` (
  `student_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'รหัสผู้รับการประเมิน (PK)',
  `student_code` varchar(20) NOT NULL COMMENT 'รหัสพนักงาน/รหัสประจำตัว',
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL COMMENT 'ชื่อจริง',
  `last_name` varchar(100) NOT NULL COMMENT 'นามสกุล',
  `student_group` varchar(50) DEFAULT NULL COMMENT 'ตำแหน่ง แผนก หรือกลุ่มงาน',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT 'วันเวลาที่สร้างข้อมูล',
  `phone_number` varchar(10) DEFAULT NULL,
  `status` int(1) DEFAULT 0,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `student_code` (`student_code`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บข้อมูลผู้รับการประเมิน (บุคลากร)';

-- Dumping data for table evaluation.students: ~2 rows (approximately)
INSERT INTO `students` (`student_id`, `student_code`, `password_hash`, `first_name`, `last_name`, `student_group`, `created_at`, `phone_number`, `status`) VALUES
	(1, 'EMP-2024-001', '$2a$10$1miEYxH.Grh67dmmtWTwz.Nu7RhFscQSoF.9ocB7y3Vp1xqXy0mpa', 'มานะ', 'อดทน', 'Programmer', '2026-08-17 06:45:33', NULL, 1),
	(2, 'EMP-2024-002', '$2a$10$1miEYxH.Grh67dmmtWTwz.Nu7RhFscQSoF.9ocB7y3Vp1xqXy0mpa', 'ปิติ', 'ตั้งใจ', 'System Analyst', '2026-08-17 06:45:33', NULL, 0);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
