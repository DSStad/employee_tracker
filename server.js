require("dotenv").config();
const util = require("util");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const { table } = require("console");

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
    default:
      console.log("Sorry we couldnt process your request");
  }
};

const viewDepartments = async () => {
  const response = await query("SELECT * FROM department");

  console.table(response);
  await handleActions();
};

const viewRoles = async () => {
  const response = await query("SELECT * FROM role");

  console.table(response);
  await handleActions();
};

const viewEmployees = async () => {
  const response = await query("SELECT * FROM employee");

  console.table(response);
  await handleActions();
};
// view employee function next

// functions thatll handle the add on tables -- with embedded inquirer
// functions thatll handle the updating tables -- with emdedded inquirer
