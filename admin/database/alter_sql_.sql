ALTER TABLE `category` ADD `tag_name` VARCHAR(255) NULL AFTER `name`, ADD `color` VARCHAR(255) NULL AFTER `tag_name`;



ALTER TABLE `business` ADD `contact_background_image` VARCHAR(255) NULL AFTER `contact_title`, ADD `contact_background_image_mobile` VARCHAR(255) NULL AFTER `contact_background_image`;


ALTER TABLE `slider` ADD `src_image_mobile` VARCHAR(255) NULL AFTER `src_imagen`;



ALTER TABLE `event` ADD `publication_date_end` DATETIME NULL AFTER `publication_time`, ADD `publication_time_end` DATETIME NULL AFTER `publication_date_end`;


/*NUEVOS*/

ALTER TABLE `business` ADD `mission` LONGTEXT NULL DEFAULT NULL AFTER `contact_background_image_mobile`, ADD `vision` LONGTEXT NULL DEFAULT NULL AFTER `mission`, ADD `about_us` LONGTEXT NULL DEFAULT NULL AFTER `vision`;


CREATE TABLE `piuraculturaviva`.`business_allies` ( `id` INT NOT NULL AUTO_INCREMENT , `name` VARCHAR(255) NULL , `url` VARCHAR(255) NULL , `logo` VARCHAR(255) NULL , `business_id` INT NULL , PRIMARY KEY (`id`), INDEX `business_allies_business_id` (`business_id`)) ENGINE = InnoDB;


ALTER TABLE `business_allies` ADD `created_at` TIMESTAMP NULL AFTER `business_id`, ADD `updated_at` TIMESTAMP NULL AFTER `created_at`, ADD `deleted_at` TIMESTAMP NULL AFTER `updated_at`;



ALTER TABLE `member` ADD `facebook` VARCHAR(255) NULL AFTER `website`, ADD `instagram` VARCHAR(255) NULL AFTER `facebook`, ADD `youtube` VARCHAR(255) NULL AFTER `instagram`;





ALTER TABLE `event` ADD `sub_category_id` INT NULL AFTER `category_id`, ADD `price` VARCHAR(255) NULL AFTER `sub_category_id`;
