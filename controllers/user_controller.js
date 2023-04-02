const utils = require("../lib/utils");
const express = require("express");

class UserController {
  constructor(prisma) {
    this.prisma = prisma;
    this.router = express.Router();
    this.router.get("/", this.getAllUsers.bind(this));
    this.router.post("/join", this.createUsers.bind(this));
    this.router.put("/post_title", this.updatePostTile.bind(this));
  }

  /* ------------------------------------------------------------------------------------- */
  // get all users
  async getAllUsers(req, res) {
    const users = await this.prisma.user.findMany();
    if (users === null) {
      utils.Error(res, "User not found");
      return;
    }

    if (users.Length === 0) {
      utils.Error(res, "User Length is 0");
    }

    utils.Success(res, users);
  }
  /* ------------------------------------------------------------------------------------- */

  /* ------------------------------------------------------------------------------------- */
  // create a new user
  async createUsers(req, res) {
    // 구조 분해
    const { email, name } = JSON.parse(JSON.stringify(req.body));
    const result = await this.prisma
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
    const postData = JSON.parse(JSON.stringify(req.body));
    if (Array.isArray(postData)) {
      await this.prisma
        .$transaction(async (prisma) => {
          for (let data of postData) {
            const _id = data.id;
            const _title = data.title;

            await this.prisma.user.findUnique({
              where: { id: parseInt(_id) },
            });
            await this.prisma.post.update({
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
      await this.prisma
        .$transaction(async (prisma) => {
          const _id = postData.id;
          const _title = postData.title;

          await this.prisma.user.findUnique({
            where: { id: parseInt(_id) },
          });
          await this.prisma.post.update({
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

module.exports = UserController;
