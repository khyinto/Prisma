const utils = require("../lib/utils");
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class User_Controller {
  constructor() {
    this.router = express.Router();
    this.router.get("/", this.getAllUsers.bind(this));
    this.router.post("/join", this.createUsers.bind(this));
    this.router.post("/post_title", this.updatePostTile.bind(this));
  }

  // get all users
  async getAllUsers(req, res) {
    const users = await prisma.user.findMany();
    if (users === null) {
      utils.Error(res, "User not found");
      return;
    }
    utils.Success(res, users);
  }

  // create a new user
  async createUsers(req, res) {
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
  }

  // update post title
  async updatePostTile(req, res) {
    // 구조 분해
    const { id, title } = JSON.parse(JSON.stringify(req.body));

    //try {
    const result = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
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
  }
}

module.exports = User_Controller;
