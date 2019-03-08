const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

var connection = mysql.createConnection({ //Create connection to mySql Database
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root", //Super secure, right?
    database: "bamazon"
});

connection.connect(function (err) { //Connection function
    if (err) throw err;
    runBamazon();
});

function runBamazon() { //Read database and close the connection before calling prompt for further action (enquirer)
    connection.query("SELECT * FROM products", function (err, res) {
        console.table(res);
        bamBuy();
    })
};

function bamBuy() { //Function to call Enquirer to figure out what to do next
    inquirer.prompt([
        {
            name: "bamItem",
            type: "number",
            message: "What 'product' would you like to buy?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "howMuch",
            type: "number",
            message: "How much would you like to buy?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (item) {
        var selection = parseInt(item.bamItem);
        var quantity = parseInt(item.howMuch);

        connection.query("SELECT * FROM products WHERE ?",
            [
                {
                    id: selection
                }
            ],
            function (err, res) {
                if (err) throw err;

                console.log("\nYou want " + quantity + " " + res[0].product_name);

                if (quantity > res[0].stock_quantity) {
                    console.log("I only have " + res[0].stock_quantity + " of " + res[0].product_name + "\n");
                    buyMore();
                } else {
                    var currentStock = (res[0].stock_quantity - quantity);
                    var total = (parseInt(quantity * res[0].price));
                    console.log("That'll be $ " + total);
                    // var total = (quantity * )
                    connection.query("UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: currentStock
                            },
                            {
                                id: selection
                            }
                        ],
                        function (err, res) {
                            buyMore();
                        }
                    )
                }
            })




    })
}

function buyMore() {
    inquirer
        .prompt([
            {
                type: "confirm",
                message: "Would you like you buy something else?",
                name: "confirm",
                default: true
            }
        ]).then(function (doneResponse) {
            if (doneResponse.confirm) {
                bamBuy(); //Calls initial Inquirer questions again
            }
            else {
                console.log("Peace!")
                connection.end();
            }
        });
};