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

const query = util.promisify(db.query).bind(db);

const viewDepartments = async () => {
  const response = await query("SELECT * FROM department");

  console.table(response);
};

viewDepartments();
