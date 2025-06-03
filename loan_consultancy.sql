-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 03, 2025 at 05:03 AM
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
-- Table structure for table `loan_applications`
--

CREATE TABLE `loan_applications` (
  `id` int(11) NOT NULL,
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
  `salary` decimal(15,2) DEFAULT NULL,
  `instituteAddress` text DEFAULT NULL,
  `companyAddress` text DEFAULT NULL,
  `doctorType` enum('Job Holder','Only Chamber','Job Holder & Chamber') DEFAULT NULL,
  `hospitalName` varchar(100) DEFAULT NULL,
  `hospitalAddress` text DEFAULT NULL,
  `bmdcAge` varchar(50) DEFAULT NULL,
  `chamberPlaceName` varchar(100) DEFAULT NULL,
  `chamberAddress` text DEFAULT NULL,
  `monthlyIncome` decimal(15,2) DEFAULT NULL,
  `monthlySalaryFromHospital` decimal(15,2) DEFAULT NULL,
  `bankAmount` decimal(15,2) DEFAULT NULL,
  `cashAmount` decimal(15,2) DEFAULT NULL,
  `bankAndCashAmount` decimal(15,2) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `loan_applications`
--

INSERT INTO `loan_applications` (`id`, `loan_type`, `fullName`, `contactNo`, `requiredAmount`, `loanRequirementTime`, `presentAddress`, `existingLoan`, `paymentRegularity`, `comments`, `department`, `designation`, `organizationAddress`, `jobGrade`, `salary`, `instituteAddress`, `companyAddress`, `doctorType`, `hospitalName`, `hospitalAddress`, `bmdcAge`, `chamberPlaceName`, `chamberAddress`, `monthlyIncome`, `monthlySalaryFromHospital`, `bankAmount`, `cashAmount`, `bankAndCashAmount`, `createdAt`) VALUES
(1, 'Doctor', 'Tausif Rahman', '01552577108', 1233.00, '1', 'aaas', 'Yes', 'Sometime Irregular', 'aaaaaaaaaa', '', '', '', '', 0.00, '', '', 'Job Holder & Chamber', 'aaaaaaaaaaaaaaa', 'aaaaaaaaaaaaa', 'aaaaaaaaaaaa', 'aaaaaaaaaaaaaaa', 'aaaaaaaaaa', 111111111.00, 1223.00, 11111111.00, 111111111111.00, 1111111111.00, '2025-06-02 18:38:42'),
(2, 'Govt. Employee', 'Tausifur Rahman', '01552577108', 111111111.00, '1', 'aaaaaaaaaaa', 'No', 'Regular', 'aaaaaaaaaaa', 'aaaaaaaaaa', 'aaaaaaaaa', 'aaaaaaaaaa', 'aaaaaaaaa', 11111111.00, '', '', 'Job Holder', '', '', '', '', '', 0.00, 0.00, 1.00, 1.00, 1.00, '2025-06-02 19:09:26');

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
-- AUTO_INCREMENT for table `loan_applications`
--
ALTER TABLE `loan_applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
