DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE `department` (
    `id` int AUTO INCREMENT  NOT NULL ,
    `name` varchar(30)  NOT NULL ,
    PRIMARY KEY (
        `id`
    )
);

CREATE TABLE `role` (
    `id` int AUTO INCREMENT  NOT NULL ,
    `title` varchar(30)  NOT NULL ,
    `salary` decimal  NOT NULL ,
    `department_id` int  NOT NULL ,
    PRIMARY KEY (
        `id`
    )
);

CREATE TABLE `employee` (
    `id` int AUTO INCREMENT  NOT NULL ,
    `first_name` varchar(30)  NOT NULL ,
    `last_name` varchar(30)  NOT NULL ,
    `role_id` int  NOT NULL ,
    `manager_id` int ,
    PRIMARY KEY (
        `id`
    )
);

ALTER TABLE `role` ADD CONSTRAINT `fk_role_department_id` FOREIGN KEY(`department_id`)
REFERENCES `department` (`id`);

ALTER TABLE `employee` ADD CONSTRAINT `fk_employee_role_id` FOREIGN KEY(`role_id`)
REFERENCES `role` (`id`);

ALTER TABLE `employee` ADD CONSTRAINT `fk_employee_manager_id` FOREIGN KEY(`manager_id`)
REFERENCES `employee` (`id`);
