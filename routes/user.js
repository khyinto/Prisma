const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const utils = require("../lib/utils");

// '/users' API 라우터

/* 전체 정보 가져오기 */
router.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  if (users === null) {
    utils.Error(res, "User not found");
    return;
  }
  utils.Success(res, users);
});

/* 회원 가입 */
router.post("/join", async (req, res) => {
  // 구조 분해
  const { email, name } = JSON.parse(JSON.stringify(req.body));

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    //res.status(409).json({ message: "User with this email already exists" });
    utils.Error(res, "User with this email already exists");
    return;
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
  utils.Success(res, "Successfully created");
});

router.post("/post_title", async (req, res) => {
  // 구조 분해
  const { id, title } = JSON.parse(JSON.stringify(req.body));

  //try {
  const result = await prisma.user.findUnique({ where: { id: parseInt(id) } });
  if (result === null) {
    utils.Error(res, "User with this");
    return;
  }

  const updatePost = await prisma.post.update({
    where: { id: parseInt(id) },
    data: { title: title },
  });

  if (updatePost === null) {
    utils.Error(res, "User not found");
    return;
  }
  utils.send(res, "Successfully updated");
});

module.exports = router;
