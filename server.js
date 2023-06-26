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
      // getRoles();
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
  const departArr = [];
  const departList = await query("SELECT name FROM departments");
  console.log(departList);
  for (let department of departList) {
    for (let name in department) {
      departArr.push(`${department[name]}`);
    }
  }
  console.log(departArr);
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
      choices: departArr,
    },
  ];
  const addRole = await inquirer.prompt(rolePrompt);

  const insertRole = await query(
    `INSERT INTO roles (title, salary, department_id) VALUES (${addRole.role}, ${addRole.salary}, SELECT departments.id FROM departments WHERE name = "${addRole.department}")`
  );
  console.log(`Added ${addRole.role} role to the Database.`);
  await handleActions();
};

const addEmployee = async () => {
  const rolesArr = [];
  const rolesList = await query("SELECT roles.title FROM roles");
  // console.log(rolesList);
  for (let roles of rolesList) {
    for (let title in roles) {
      // console.log(`${roles[title]}`);
      rolesArr.push(`${roles[title]}`);
    }
    // console.log(rolesArr);
  }
  const manageArr = [];
  const manageList = await query(
    "SELECT CONCAT(first_name, ' ', last_name) AS employee FROM employees"
  );
  console.log(manageList);
  for (let managers of manageList) {
    for (let name in managers) {
      manageArr.push(`${managers[name]}`);
    }
  }
  console.log(manageArr);

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
      choices: rolesArr,
    },
    {
      type: "list",
      name: "manager",
      message: "Who is the new employees manager?",
      choices: manageArr,
    },
  ];
  const addEmploy = await inquirer.prompt(employeePrompt);
  console.log(addEmploy.manager.split(" "));
  const fullName = addEmploy.manager.split(" ");
  const firstName = fullName[0];
  const lastName = fullName[1];
  console.log(firstName, lastName);
  const insertEmploy = await query(`
  INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (${addEmploy.first}, ${addEmploy.last}, SELECT roles.id FROM roles WHERE title = "${addEmploy.role}", SELECT employees.id FROM employees WHERE first_name = "${firstName}" AND last_name = "${lastName}")
  `);

  console.log(
    `Added new employee ${addEmploy.first} ${addEmploy.last} to the database`
  );
  await handleActions();
};
// functions thatll handle the updating tables -- with emdedded inquirer
