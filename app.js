const express = require("express");

const cluster = require("cluster");
const os = require("os");
const { PrismaClient } = require("@prisma/client");

let bodyParser = require("body-parser");

const userRouter = require("./routes/user");
const userController = require("./controllers/user_controller");

const { connectToDatabase } = require("./schemas/index");

const app = express();

if (cluster.isMaster) {
  const numWorkers = os.cpus().length;

  console.log(`Master cluster setting up ${numWorkers} workers...`);

  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on("online", (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });

  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`
    );
    console.log("Starting a new worker");
    cluster.fork();
  });
} else {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(bodyParser.urlencoded({ extended: false, limit: "2mb" })); //파서(기본)
  app.use(bodyParser.json()); //파서(json)

  /*사용자 정의 인스턴스 생성 */
  const prisma = new PrismaClient();
  const user_controller = new userController(prisma);
  app.use("/users", user_controller.router);

  app.listen(3000, () => {
    console.log(`Server running on process ${process.pid}`);
    connectToDatabase();
  });
}
