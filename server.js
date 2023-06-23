require("dotenv").config();
const util = require("util");
const mysql = require("mysql2");
const inquirer = require("inquirer");

const db = mysql.createConnection(
  {
    host: process.env.HOST,
    // MySQL username,
    user: process.env.USERNAME,
    // MySQL password
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  },
  console.log(`Connected to the classlist_db database.`)
);

const mainActions = [
    {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: ["View All Departments", "View All Roles", "View All Employees","Add A Department", "Add A Role", "Add An Employee", "Update An Employee Role"]
    }
]

const query = util.promisify(db.query).bind(db);

const viewDepartments = async () => {
  const response = await query("SELECT * FROM department");

  console.table(response);
};

viewDepartments();
