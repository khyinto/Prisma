const utils = require("../lib/utils");
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class User_Controller {
  constructor() {
    this.router = express.Router();
    this.router.get("/", this.getAllUsers.bind(this));
    this.router.post("/join", this.createUsers.bind(this));
    this.router.put("/post_title", this.updatePostTile.bind(this));
  }

  /* ------------------------------------------------------------------------------------- */
  // get all users
  async getAllUsers(req, res) {
    const users = await prisma.user.findMany();
    if (users === null) {
      utils.Error(res, "User not found");
      return;
    }
    utils.Success(res, users);
  }
  /* ------------------------------------------------------------------------------------- */

  /* ------------------------------------------------------------------------------------- */
  // create a new user
  async createUsers(req, res) {
    // 구조 분해
    const { email, name } = JSON.parse(JSON.stringify(req.body));
    const result = await prisma
      .$transaction(async (prisma) => {
        await prisma.user.findUnique({ where: { email } });
        await prisma.user.create({
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
      })
      .catch((error) => {
        utils.Error(res, "Error creating user");
      });
  }
  /* ------------------------------------------------------------------------------------- */

  /* ------------------------------------------------------------------------------------- */
  // update post title
  async updatePostTile(req, res) {
    // 배열로 데이터를 받을 때
    console.log(`Your IP address is ${req.ip}`);
    const groups = JSON.parse(JSON.stringify(req.body));
    if (Array.isArray(groups)) {
      await prisma
        .$transaction(async (prisma) => {
          for (let data of groups) {
            const _id = data.id;
            const _title = data.title;

            await prisma.user.findUnique({
              where: { id: parseInt(_id) },
            });
            await prisma.post.update({
              where: { id: parseInt(_id) },
              data: { title: _title },
            });
          }
          utils.Success(res, "Is Array Successfully updated");
        })
        .catch((err) => {
          utils.Error(res, "Error updated ");
        });
    }

    // 단일 데이터를 받을때.
    else {
      await prisma
        .$transaction(async (prisma) => {
          const _id = groups.id;
          const _title = groups.title;

          await prisma.user.findUnique({
            where: { id: parseInt(_id) },
          });
          await prisma.post.update({
            where: { id: parseInt(_id) },
            data: { title: _title },
          });
          utils.Success(res, "Is Single Successfully updated");
        })
        .catch((err) => {
          utils.Error(res, "Error updated ");
        });
    }
  }
  /* ------------------------------------------------------------------------------------- */
}

module.exports = User_Controller;
