-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 17, 2025 at 05:23 PM
-- Server version: 10.6.21-MariaDB
-- PHP Version: 8.3.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `arbeitte_loan`
--

-- --------------------------------------------------------

--
-- Table structure for table `chambers`
--

CREATE TABLE `chambers` (
  `chamber_id` char(36) NOT NULL,
  `application_id` char(36) NOT NULL,
  `chamberPlaceName` varchar(100) DEFAULT NULL,
  `chamberAddress` text DEFAULT NULL,
  `monthlyIncome` decimal(15,2) DEFAULT NULL,
  `chamber_type` enum('Job Holder','Only Chamber','Job Holder & Chamber') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chambers`
--

INSERT INTO `chambers` (`chamber_id`, `application_id`, `chamberPlaceName`, `chamberAddress`, `monthlyIncome`, `chamber_type`, `created_at`, `updated_at`) VALUES
('7251f162-544d-4e40-bb12-c60e4c3ce01c', '6062aa91-9329-4dd9-a4a2-ac765eb25502', 'Rampura', 'khilgaon', 30000.00, 'Job Holder & Chamber', '2025-06-17 08:12:26', '2025-06-17 08:12:26'),
('7d7888b0-744f-421a-bc95-52fbc4e90ad9', 'bd95b01c-7ee3-4a91-a1b1-eee1f3109a41', 'suja', 'rampura', 30000.00, 'Only Chamber', '2025-06-17 07:20:52', '2025-06-17 07:20:52'),
('ab5669cb-ccc3-4819-86ec-036c7b0cf6a2', 'bd95b01c-7ee3-4a91-a1b1-eee1f3109a41', 'gulshan', 'gulshan', 40000.00, 'Only Chamber', '2025-06-17 07:20:52', '2025-06-17 07:20:52'),
('d0ebcc49-bc2d-4d9f-858d-a503e2f867d2', 'eb8c2682-407b-4157-8b9f-cdf6c633e074', 'Baridhara dental', 'Baridhara', 40000.00, 'Job Holder & Chamber', '2025-06-17 07:25:38', '2025-06-17 07:25:38'),
('e192d8ab-3d5c-40dc-bc26-ccd8b9639a52', '6ccc2146-21cd-441c-b171-1e07d07c3887', 'Rampura', 'Rampura Badda', 29997.00, 'Job Holder & Chamber', '2025-06-17 07:55:32', '2025-06-17 07:55:32');

-- --------------------------------------------------------

--
-- Table structure for table `loan_applications`
--

CREATE TABLE `loan_applications` (
  `id` char(36) NOT NULL,
  `fullName` varchar(100) NOT NULL,
  `contactNo` varchar(20) NOT NULL,
  `requiredAmount` decimal(15,2) NOT NULL,
  `presentAddress` text NOT NULL,
  `existingLoan` enum('Yes','No') DEFAULT 'No',
  `paymentRegularity` enum('Regular','Irregular','Sometime Irregular') DEFAULT NULL,
  `comments` text DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `organizationName` varchar(100) DEFAULT NULL,
  `organizationAddress` text DEFAULT NULL,
  `jobGrade` varchar(50) DEFAULT NULL,
  `instituteName` varchar(100) DEFAULT NULL,
  `instituteAddress` text DEFAULT NULL,
  `companyName` varchar(100) DEFAULT NULL,
  `companyAddress` text DEFAULT NULL,
  `hospitalName` varchar(100) DEFAULT NULL,
  `hospitalAddress` text DEFAULT NULL,
  `bmdcAge` varchar(20) DEFAULT NULL,
  `monthlySalaryFromHospital` decimal(15,2) DEFAULT NULL,
  `bankAmount` decimal(15,2) DEFAULT NULL,
  `cashAmount` decimal(15,2) DEFAULT NULL,
  `bankAndCashAmount` decimal(15,2) DEFAULT NULL,
  `doctorType` enum('Job Holder','Only Chamber','Job Holder & Chamber') DEFAULT NULL,
  `loanRequirementTime` varchar(100) DEFAULT NULL,
  `loanType` enum('Govt. Employee','Private Job Holder','Garments Job Holder','Doctor','Teacher') NOT NULL,
  `salaryType` varchar(50) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `loan_applications`
--

INSERT INTO `loan_applications` (`id`, `fullName`, `contactNo`, `requiredAmount`, `presentAddress`, `existingLoan`, `paymentRegularity`, `comments`, `department`, `designation`, `organizationName`, `organizationAddress`, `jobGrade`, `instituteName`, `instituteAddress`, `companyName`, `companyAddress`, `hospitalName`, `hospitalAddress`, `bmdcAge`, `monthlySalaryFromHospital`, `bankAmount`, `cashAmount`, `bankAndCashAmount`, `doctorType`, `loanRequirementTime`, `loanType`, `salaryType`, `createdAt`, `updated_at`) VALUES
('20449d0b-8e49-4bfc-ae3d-dca2c1e62b5b', 'Mr Garment', '01552577108', 5000.00, 'Mymensingh', 'No', NULL, 'urgent needed sir', 'Sewing', 'Wroker', NULL, NULL, NULL, NULL, NULL, 'Fakir', 'Uttara', NULL, NULL, NULL, NULL, NULL, 8998.00, NULL, NULL, '1 week', 'Garments Job Holder', 'Cash Amount', '2025-06-17 13:32:04', '2025-06-17 13:32:04'),
('6062aa91-9329-4dd9-a4a2-ac765eb25502', 'mr tausif job and chamber', '01552577108', 300000.00, 'fs', 'No', NULL, 'f12', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Better Life', 'khilgaon', '24', 40000.00, NULL, NULL, NULL, 'Job Holder & Chamber', 'after 1 week', 'Doctor', 'Bank & Cash Amount', '2025-06-17 14:12:26', '2025-06-17 14:12:26'),
('6ccc2146-21cd-441c-b171-1e07d07c3887', 'mr tausif job and chamber', '01552577108', 300000.00, 'C block bansree', 'Yes', 'Regular', 'Done?', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Better Life', 'Rampura', '24', 19999.00, NULL, NULL, NULL, 'Job Holder & Chamber', 'after 1 week', 'Doctor', 'Bank & Cash Amount', '2025-06-17 13:55:32', '2025-06-17 13:55:32'),
('7b18297a-3054-4e9a-ba25-8482748f5c07', 'Tawsif Rahman', '01552577108', 1200.00, '93 north Goran, Dhaka-1217', 'Yes', 'Irregular', 'ff', 's', 'u', 'Dpdc', '93 north Goran, Dhaka-1217', '1th', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 10000.00, NULL, NULL, NULL, '2 months', 'Govt. Employee', NULL, '2025-06-17 13:18:46', '2025-06-17 13:18:46'),
('87270378-266d-404e-bf27-431f5d5e0ce2', 'Dr job holder', '01552577108', 65000.00, 'G block Basundhara ', 'Yes', 'Regular', 'Bye', 'sergery', 'Doctor', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Evercare', 'Basundhara', '10', NULL, 56565.00, NULL, 30000.00, 'Job Holder', '1 year', 'Doctor', 'Bank & Cash Amount', '2025-06-17 13:23:05', '2025-06-17 13:23:05'),
('bd95b01c-7ee3-4a91-a1b1-eee1f3109a41', 'Dr Chamber', '01552577108', 50000.00, 'goran 10', 'Yes', 'Regular', 'hello', 's', 'u', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '5', NULL, NULL, NULL, NULL, 'Only Chamber', '1 months', 'Doctor', NULL, '2025-06-17 13:20:52', '2025-06-17 13:20:52'),
('eb8c2682-407b-4157-8b9f-cdf6c633e074', 'Mr job and Chamber', '01552577108', 100000.00, 'Nikunjo', 'No', NULL, 'beautiful', 's', 'u', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'CMH', 'Mirpur', '20', 49999.00, 56565.00, NULL, NULL, 'Job Holder & Chamber', '2 year', 'Doctor', 'Bank Amount', '2025-06-17 13:25:38', '2025-06-17 13:25:38');

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
  ADD KEY `application_id` (`application_id`);

--
-- Indexes for table `loan_applications`
--
ALTER TABLE `loan_applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`);

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
  ADD CONSTRAINT `fk_application` FOREIGN KEY (`application_id`) REFERENCES `loan_applications` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
