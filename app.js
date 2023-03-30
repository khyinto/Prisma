const express = require("express");
let bodyParser = require("body-parser");
//const { PrismaClient } = require("@prisma/client");

const userRouter = require("./routes/user");

//const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false, limit: "2mb" })); //파서(기본)
app.use(bodyParser.json()); //파서(json)

app.use("/users", userRouter);

/*
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post("/users", async (req, res) => {
  console.log(req.body);
  const { name, email } = req.body;
  console.log("name:" + name + " email:" + email);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      posts: {
        create: { title: "Hello World" },
      },
      profile: {
        create: { bio: "I like turtles" },
      },
    },
  });
  res.json(user);
});
*/

app.listen(3000, () => console.log("Server is running"));
