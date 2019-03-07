const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",

    port: 8080,

    user: "root",

    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    runBamazon();
    bamBuy();
});

function runBamazon() {
    var trenchCoat = "SELECT * FROM products"
    connection.trenchCoat(query, trenchCoat, function (err, res) {
        for (var i=0; i<res.length; i++) {
            console.
        }
    })
};

function bamBuy() {
    inquirer.prompt({
        name: "bamItem",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
            "What product would you like to buy?",
        ]
    }).then(function (item) {
        console.log(item.bamItem)
    })
}