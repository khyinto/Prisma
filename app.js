const express = require("express");
let bodyParser = require("body-parser");

const userRouter = require("./routes/user");
const User_Controller = require("./controllers/user_controller");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false, limit: "2mb" })); //파서(기본)
app.use(bodyParser.json()); //파서(json)

const user_controller = new User_Controller();
app.use("/users", user_controller.router);

app.listen(3000, () => console.log("Server is running"));
