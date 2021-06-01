require("dotenv").config();
const express = require('express');
const dbConnection = require("./db");
const app = express();

const controllers = require("./controllers");
app.use(express.json());

app.use("/log", controllers.logController);
app.use("/user", controllers.userController);
// app.use(require('./middleware/validate-jwt'));

dbConnection.authenticate()
.then(() => dbConnection.sync())
.then(() => {
    app.listen(3000, () => {
        console.log(`[Server]: App is listening on 3000.`);
    });
})
.catch((err) => {
    console.log(`[Server]: Server crashed. Error = ${err}`);
});

// app.listen(3000, () => {
//     console.log(`[Server]: App is listening on 3000.`);
// });