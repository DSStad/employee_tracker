USE employee_db;

INSERT INTO departments (name)
VALUES ("Engineering"), ("Sales"), ("Customer Service");

INSERT INTO roles (title, salary, department_id)
VALUES ("Team Lead", 120000, 1),
        ("Mid Dev", 90000, 1),
        ("Jr Dev", 75000, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('Ben', 'Machock', 1, null),
        ('Justin', 'Moore', 2, 1),
        ('Derick', 'Stadler', 3, 1);


-- FAKE DATA INSERT