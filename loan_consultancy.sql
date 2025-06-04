-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 04, 2025 at 07:32 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `loan_consultancy`
--

-- --------------------------------------------------------

--
-- Table structure for table `chambers`
--

CREATE TABLE `chambers` (
  `chamber_id` char(36) NOT NULL,
  `application_id` char(36) NOT NULL,
  `chamber_place_name` varchar(100) DEFAULT NULL,
  `chamber_address` text DEFAULT NULL,
  `monthly_income` decimal(15,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chambers`
--

INSERT INTO `chambers` (`chamber_id`, `application_id`, `chamber_place_name`, `chamber_address`, `monthly_income`) VALUES
('9152e01a-016d-4cad-aa82-e46b1033f1d0', '96d6ab54-cbc7-4f3f-8892-617ad8e04ac7', 'aaaaaaaaaaaaaaa', 'aaaaaaaaa', 122333.00),
('99d49053-8f09-4e61-88bc-00c974fe569b', '0c98c407-4bd9-419e-ac8b-6330b583388a', 'sd', 'sd', 123.00),
('b85f094c-6121-4f86-b5ea-1c00ab60b519', '4e618b0c-e1a5-4582-aa6c-44fb940502df', 'hatir jheel', 'kuril', 12000.00),
('f4bc42a3-239b-452b-8207-6efc14b5254a', '4e618b0c-e1a5-4582-aa6c-44fb940502df', 'rampura', 'rampura', 120000.00);

-- --------------------------------------------------------

--
-- Table structure for table `loan_applications`
--

CREATE TABLE `loan_applications` (
  `id` char(36) NOT NULL,
  `loan_type` varchar(50) NOT NULL,
  `fullName` varchar(100) NOT NULL,
  `contactNo` varchar(20) NOT NULL,
  `requiredAmount` decimal(15,2) NOT NULL,
  `loanRequirementTime` varchar(50) DEFAULT NULL,
  `presentAddress` text NOT NULL,
  `existingLoan` enum('Yes','No') DEFAULT 'No',
  `paymentRegularity` enum('Regular','Irregular','Sometime Irregular') DEFAULT NULL,
  `comments` text DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `organizationAddress` text DEFAULT NULL,
  `jobGrade` varchar(50) DEFAULT NULL,
  `instituteAddress` text DEFAULT NULL,
  `companyAddress` text DEFAULT NULL,
  `doctor_type` enum('Job Holder','Only Chamber','Job Holder & Chamber') DEFAULT NULL,
  `hospitalName` varchar(100) DEFAULT NULL,
  `hospitalAddress` text DEFAULT NULL,
  `bmdcAge` varchar(50) DEFAULT NULL,
  `monthlySalaryFromHospital` decimal(15,2) DEFAULT NULL,
  `bankAmount` decimal(15,2) DEFAULT NULL,
  `cashAmount` decimal(15,2) DEFAULT NULL,
  `bankAndCashAmount` decimal(15,2) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `salary_type` enum('Bank Amount','Cash Amount','Bank & Cash Amount') DEFAULT NULL,
  `organizationName` varchar(255) DEFAULT NULL,
  `instituteName` varchar(255) DEFAULT NULL,
  `companyName` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `loan_applications`
--

INSERT INTO `loan_applications` (`id`, `loan_type`, `fullName`, `contactNo`, `requiredAmount`, `loanRequirementTime`, `presentAddress`, `existingLoan`, `paymentRegularity`, `comments`, `department`, `designation`, `organizationAddress`, `jobGrade`, `instituteAddress`, `companyAddress`, `doctor_type`, `hospitalName`, `hospitalAddress`, `bmdcAge`, `monthlySalaryFromHospital`, `bankAmount`, `cashAmount`, `bankAndCashAmount`, `createdAt`, `salary_type`, `organizationName`, `instituteName`, `companyName`) VALUES
('0c98c407-4bd9-419e-ac8b-6330b583388a', 'Doctor', 'Tausifur Rahman', '01552577108', 12344.00, '1 month', 'sd', 'No', '', 'sd', 'sd', 'sd', '', '', '', '', 'Job Holder', 'sd', 'sd', '11', 0.00, 12.00, 0.00, 0.00, '2025-06-03 21:37:56', 'Bank Amount', '', '', ''),
('4e618b0c-e1a5-4582-aa6c-44fb940502df', 'Doctor', 'Tausif', '01552577108', 12000.00, '1 month', 'goran', 'No', 'Regular', 'hi', 'test', 'as', 'kuril', '7', '', '', 'Job Holder', 'city', 'city', '12', 0.00, 12000.00, 0.00, 0.00, '2025-06-03 09:17:40', 'Bank Amount', 'arbeit', '', ''),
('512bffa0-3c6b-40d3-a0d3-c932411903fc', 'Govt. Employee', 'Tausif Rahman', '01552577108', 123.00, '1 month', 'as', 'Yes', 'Regular', 'as', 'Website Development', 'Jr. developer', 'as', 'as', '', '', NULL, '', '', '', 0.00, 12.00, 0.00, 0.00, '2025-06-04 01:46:36', 'Bank Amount', 'aq', '', ''),
('756a2d19-1b03-487a-b240-b26d1d0b7fd4', 'Govt. Employee', 'taufiq', '01552577108', 1234.00, '1 month', 'ftyhutfhg', 'No', '', 'cdgfdgf', 'Website Development', 'Jr. developer', 'ghjhkhgjg', 'aaaaaaaaa', '', '', NULL, '', '', '', 0.00, 0.00, 8999.00, 0.00, '2025-06-04 05:13:00', 'Cash Amount', 'aq', '', ''),
('96d6ab54-cbc7-4f3f-8892-617ad8e04ac7', 'Doctor', 'Tausif Rahman', '01552577108', 1223.00, '1 month', 'asfdasf', 'Yes', 'Sometime Irregular', 'aaaaaaaaaa', 'Website Development', 'aaaaaaaaa', '', '', '', '', 'Job Holder', 'aaaaaaaaaaaaaaa', 'aaaa', '12', 0.00, 12000.00, 0.00, 0.00, '2025-06-03 20:13:02', 'Bank Amount', '', '', ''),
('a79317cf-a918-4a66-bf0e-7be2c19c8c75', 'Govt. Employee', 'Tausif', '01646962631', 8000.00, '1 month', 'goran', 'No', '', '', 'tech', 'jr dev', 'kuril', '7', '', '', NULL, '', '', '', 0.00, 10000.00, 0.00, 0.00, '2025-06-03 09:25:01', 'Bank Amount', 'arbeit', '', ''),
('a7edda74-6982-48f0-baef-18a2234bb168', 'Private Job Holder', 'Tausifur Rahman', '01552577108', 5000.00, '12 month', 'Goran', 'No', '', 'Hello vaiya', 'Website Development', 'Jr. developer', '', '', '', 'Kuril', NULL, '', '', '', 0.00, 0.00, 10000.00, 0.00, '2025-06-04 00:10:20', 'Cash Amount', '', '', 'Arbeit Technology'),
('cc4e1c24-2c67-4f6b-b3f4-8e3fe5017814', 'Govt. Employee', 'Tausif', '01646962631', 8000.00, '1 month', 'goran', 'Yes', 'Sometime Irregular', 'ok', 'tech', 'jr dev', 'kuril', '7', '', '', NULL, '', '', '', 0.00, 10000.00, 0.00, 0.00, '2025-06-03 09:25:13', 'Bank Amount', 'arbeit', '', ''),
('e42fcee4-5209-4395-86f8-fa9a70887c15', 'Govt. Employee', 'Tausif Rahman', '01552577108', 12345.00, '1 month', 'aq', 'No', '', 'aq', 'aq', 'aq', 'aq', 'aq', '', '', NULL, '', '', '', 0.00, 123.00, 0.00, 0.00, '2025-06-04 01:24:54', 'Bank Amount', 'aq', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `created_at`) VALUES
(1, 'admin', '$2b$10$ImBwrnOUMY3/e7EWLiUaC.JZluPmufJp3AtqRqgQUavwHZTZiZ5IC', '2025-06-02 18:33:53');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chambers`
--
ALTER TABLE `chambers`
  ADD PRIMARY KEY (`chamber_id`),
  ADD KEY `chambers_ibfk_1` (`application_id`);

--
-- Indexes for table `loan_applications`
--
ALTER TABLE `loan_applications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chambers`
--
ALTER TABLE `chambers`
  ADD CONSTRAINT `chambers_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `loan_applications` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
