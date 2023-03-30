const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const utils = require("../lib/utils");

/* 전체 정보 가져오기 */
router.get("/", async (req, res) => {
  const { email, name } = JSON.parse(JSON.stringify(req.body));
  console.log("email  : " + email + " , name : " + name);

  const users = await prisma.user.findMany();

  const result = {
    success: users,
  };
  utils.send(res, result);
});

/* 회원 가입 */
router.post("/join", async (req, res) => {
  // 구조 분해
  const { email, name } = JSON.parse(JSON.stringify(req.body));

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return res
      .status(409)
      .json({ message: "User with this email already exists" });
  }
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
  utils.send(res, result);
});

module.exports = router;
