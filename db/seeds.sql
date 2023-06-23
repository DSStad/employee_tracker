USE employee_db;

INSERT INTO department (name)
VALUES ('ENGINEERING');

INSERT INTO role (title, salary, department_id)
VALUES ('Team Lead', 80000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Justin', 'Moore', 1, null);


-- FAKE DATA INSERT