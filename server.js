require("dotenv").config();
const util = require("util");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const { table } = require("console");
const { title } = require("process");

const db = mysql.createConnection(
  {
    host: process.env.HOST,
    // MySQL username,
    user: process.env.USERNAME,
    // MySQL password
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  },
  console.log(`Connected to the Employee database.`)
);

const query = util.promisify(db.query).bind(db);

const mainActions = [
  {
    type: "list",
    name: "action",
    message: "What would you like to do?",
    choices: [
      "View All Departments",
      "View All Roles",
      "View All Employees",
      "Add A Department",
      "Add A Role",
      "Add An Employee",
      "Update An Employee Role",
    ],
  },
];

const handleActions = async () => {
  const action = await inquirer.prompt(mainActions);
  console.log(action.action);
  return takeAction(action.action);
};
handleActions();

const takeAction = (action) => {
  switch (action) {
    case "View All Departments":
      viewDepartments();
      break;
    case "View All Roles":
      viewRoles();
      break;
    case "View All Employees":
      viewEmployees();
      break;
    case "Add A Department":
      addDepartment();
      break;
    case "Add A Role":
      addRole();
      break;
    case "Add An Employee":
      addEmployee();
      break;
    case "Update An Employee Role":
      updateEmploy();
      break;
    default:
      console.log("Sorry we couldnt process your request");
  }
};

const viewDepartments = async () => {
  const response = await query("SELECT id, name FROM departments");

  console.table(response);
  await handleActions();
};

const viewRoles = async () => {
  const response = await query(
    "SELECT roles.id, title, salary, name AS department FROM ROLES JOIN departments ON department_id = departments.id"
  );

  console.table(response);
  await handleActions();
};

const viewEmployees = async () => {
  const response = await query(
    "SELECT e.id, e.first_name, e.last_name, title, salary, name AS department, IFNULL(CONCAT(m.first_name, ' ', m.last_name), 'N/A') AS manager FROM employees e JOIN roles ON role_id = roles.id INNER JOIN departments ON department_id = departments.id LEFT JOIN employees m ON m.id = e.manager_id"
  );

  console.table(response);
  await handleActions();
};

// functions thatll handle the add on tables -- with embedded inquirer
const addDepartment = async () => {
  const departPrompt = [
    {
      type: "input",
      name: "department",
      message: "What Department would you like to add?",
    },
  ];

  const addDepart = await inquirer.prompt(departPrompt);
  // console.log(addDepart);
  const newDepart = addDepart.department;
  // console.log(newDepart);
  const insertDepart = await query(
    `INSERT INTO departments (name) VALUES ('${newDepart}')`
  );
  console.log(`Added ${newDepart} to the database.`);
  await handleActions();
};

const addRole = async () => {
  const departList = await query("SELECT name, id AS value FROM departments");
  // console.log(departList);

  const rolePrompt = [
    {
      type: "input",
      name: "role",
      message: "What Role would you like to add?",
    },
    {
      type: "input",
      name: "salary",
      message: "What is the salary of the new role?",
    },
    {
      type: "list",
      name: "department",
      message: "What department does the role fall under?",
      choices: departList,
    },
  ];
  const addRole = await inquirer.prompt(rolePrompt);

  const insertRole = await query(
    `INSERT INTO roles (title, salary, department_id) VALUES ("${addRole.role}", ${addRole.salary}, ${addRole.department})`
  );
  console.log(`Added ${addRole.role} role to the Database.`);
  await handleActions();
};

const addEmployee = async () => {
  const rolesList = await query("SELECT title AS name, id AS value FROM roles");

  const manageList = await query(
    "SELECT CONCAT(first_name, ' ', last_name) AS name, id AS value FROM employees"
  );

  const employeePrompt = [
    {
      type: "input",
      name: "first",
      message: "Whats the first name of the new employee?",
    },
    {
      type: "input",
      name: "last",
      message: "Whats the last name of the new employee?",
    },
    {
      type: "list",
      name: "role",
      message: "What is the new employees role?",
      choices: rolesList,
    },
    {
      type: "list",
      name: "manager",
      message: "Who is the new employees manager?",
      choices: ["none", manageList],
    },
  ];
  const addEmploy = await inquirer.prompt(employeePrompt);

  const insertEmploy = await query(`
  INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("${addEmploy.first}", "${addEmploy.last}", ${addEmploy.role}, ${addEmploy.manager})
  `);

  console.log(
    `Added new employee ${addEmploy.first} ${addEmploy.last} to the database`
  );
  await handleActions();
};

const updateEmploy = async () => {
  const employList = await query(
    "SELECT CONCAT(first_name, ' ', last_name) AS name, id AS value FROM employees"
  );
  console.log(employList);
  const rolesList = await query("SELECT title AS name, id AS value FROM roles");
  console.log(rolesList);
  const updatePrompt = [
    {
      type: "list",
      name: "employee",
      message: "Which employee's role would you like to update?",
      choices: employList,
    },
    {
      type: "list",
      name: "role",
      message: "What role would you like to assign the selected employee?",
      choices: rolesList,
    },
  ];
  const updatedEmp = await inquirer.prompt(updatePrompt);
  const insertUpdate = await query(`
  UPDATE employees SET role_id = ${updatedEmp.role} WHERE employees.id = ${updatedEmp.employee}
  `);

  await handleActions();
};
