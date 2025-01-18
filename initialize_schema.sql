-- MySQL dump 10.13  Distrib 8.4.0, for macos11.6 (arm64)
--
-- Host: localhost    Database: deepcode
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Create database if not exists
--

CREATE DATABASE IF NOT EXISTS deepcode;
USE deepcode;

--
-- Table structure for table `parsed_urls`
--

DROP TABLE IF EXISTS `parsed_urls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parsed_urls` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `href` text,
  `username` text,
  `password` text,
  `protocol` varchar(50) DEFAULT NULL,
  `host` text,
  `port` varchar(10) DEFAULT NULL,
  `hostname` text,
  `pathname` text,
  `search` text,
  `hash` varchar(255) DEFAULT NULL,
  `application` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `href` (`href`(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
CREATE TABLE `accounts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255),
    `domain` VARCHAR(255),
    `ip_address` VARCHAR(45),
    `application` VARCHAR(255),
    `port` INT,
    `url_path` VARCHAR(255),
    `password_hash` VARCHAR(255),
    `tags` JSON DEFAULT NULL,
    `url_title` VARCHAR(255) DEFAULT NULL,
    `login_form_detected` BOOLEAN DEFAULT FALSE,
    `captcha_required` BOOLEAN DEFAULT FALSE,
    `otp_required` BOOLEAN DEFAULT FALSE,
    `is_parked` BOOLEAN DEFAULT NULL,
    `is_accessible` BOOLEAN DEFAULT NULL,
    `breach_detected` BOOLEAN DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;