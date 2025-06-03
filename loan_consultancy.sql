-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 03, 2025 at 01:31 PM
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
('4e618b0c-e1a5-4582-aa6c-44fb940502df', 'Doctor', 'Tausif', '01552577108', 12000.00, '1 month', 'goran', 'No', 'Regular', 'hi', 'test', 'as', 'kuril', '7', '', '', 'Job Holder', 'city', 'city', '12', 0.00, 12000.00, 0.00, 0.00, '2025-06-03 09:17:40', 'Bank Amount', 'arbeit', '', ''),
('a79317cf-a918-4a66-bf0e-7be2c19c8c75', 'Govt. Employee', 'Tausif', '01646962631', 8000.00, '1 month', 'goran', 'No', '', '', 'tech', 'jr dev', 'kuril', '7', '', '', NULL, '', '', '', 0.00, 10000.00, 0.00, 0.00, '2025-06-03 09:25:01', 'Bank Amount', 'arbeit', '', ''),
('cc4e1c24-2c67-4f6b-b3f4-8e3fe5017814', 'Govt. Employee', 'Tausif', '01646962631', 8000.00, '1 month', 'goran', 'Yes', 'Sometime Irregular', 'ok', 'tech', 'jr dev', 'kuril', '7', '', '', NULL, '', '', '', 0.00, 10000.00, 0.00, 0.00, '2025-06-03 09:25:13', 'Bank Amount', 'arbeit', '', '');

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
