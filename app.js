
const express = require("express");
const app = express();// MiddleWare
const bodyParser = require("body-parser");// MiddleWare
const morgan = require("morgan");
const mongoose = require("mongoose"); //Express will accept JSON Data for this we need to middle ware to accept the JSON data
const cors = require("cors");

// get the enviroment by install npm install dotenv

require("dotenv/config");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");

// get request to server 
// api is prefix -> http://localhost:3000/api/v1./products


app.use(cors());
app.options("*", cors());

//middleware
app.use(express.json()); //Express will accept JSON Data for this we need to middle ware to accept the JSON data
app.use(morgan("tiny"));
app.use(authJwt());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(errorHandler);

//Routes
const categoriesRoutes = require("./routers/categories");
const productsRoutes = require("./routers/products");
const usersRoutes = require("./routers/users");
const ordersRoutes = require("./routers/orders");

const api = process.env.API_URL;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);


// connecting the Database
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "mean-eshop",
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

//Server
// app.listen(3000, () => {
//   console.log("server is running http://localhost:3000");
// });

// Running the server on port 3000

//Production

var server = app.listen(process.env.PORT || 3000, function() {
  var port = server.address().port;
  console.log("Express is working on port" + port)
})
