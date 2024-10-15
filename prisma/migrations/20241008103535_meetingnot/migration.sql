/*
  Warnings:

  - You are about to drop the `_meetingattendees` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `meeting` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_meetingattendees` DROP FOREIGN KEY `_MeetingAttendees_A_fkey`;

-- DropForeignKey
ALTER TABLE `_meetingattendees` DROP FOREIGN KEY `_MeetingAttendees_B_fkey`;

-- DropForeignKey
ALTER TABLE `meeting` DROP FOREIGN KEY `Meeting_companyId_fkey`;

-- DropTable
DROP TABLE `_meetingattendees`;

-- DropTable
DROP TABLE `meeting`;
