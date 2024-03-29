
CREATE DATABASE /*!32312 IF NOT EXISTS*/ `tin` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `tin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `extracts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `row_id` int(11) DEFAULT NULL,
  `upload_id` int(11) DEFAULT NULL,
  `json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`json`)),
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQUE_row_file_id` (`row_id`,`upload_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1391 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mapped_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `schema_uploads_id` int(11) NOT NULL,
  `row_id` int(11) NOT NULL,
  `json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`json`)),
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQUE_mapper_id_row_id` (`schema_uploads_id`,`row_id`),
  KEY `mapper_id_with_row_id` (`schema_uploads_id`,`row_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2667 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mappers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`config`)),
  `hashed` char(32) GENERATED ALWAYS AS (md5(`config`)) VIRTUAL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hashed_idx` (`hashed`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schema_uploads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `schema_id` int(10) unsigned NOT NULL,
  `upload_id` int(10) unsigned DEFAULT NULL,
  `mapper_id` int(10) unsigned DEFAULT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` text NOT NULL,
  `status` enum('in_progress','ready_for_import') DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schemas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `json` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `uploads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `filename` text DEFAULT NULL,
  `filepath` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
