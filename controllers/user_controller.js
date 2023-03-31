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
        const existingUser = await prisma.user
          .findUnique({ where: { email } })
          .catch((err) => {
            utils.Error(res, "Error creating user");
          });

        if (existingUser) {
          //utils.Error(res, "User with this email already exists");
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
      })
      .catch((error) => {
        utils.Error(res, "Error creating user");
      });
  }
  /* ------------------------------------------------------------------------------------- */

  /* ------------------------------------------------------------------------------------- */
  // update post title
  async updatePostTile(req, res) {
    // 구조 분해
    // const { id, title } = JSON.parse(JSON.stringify(req.body));

    const groups = [
      { id: parseInt(1), title: "HaHaHaHaHaHa" },
      { id: parseInt(20), title: "HoHoHoHHoHHoH" },
    ];

    await prisma
      .$transaction(async (prisma) => {
        for (let data of groups) {
          const _id = data.id;
          const _title = data.title;
          console.log(_id);
          console.log(_title);

          await prisma.user.findUnique({
            where: { id: parseInt(_id) },
          });
          await prisma.post.update({
            where: { id: parseInt(_id) },
            data: { title: _title },
          });
        }
        /*
        await prisma.post.update(
          {
            where: { id: parseInt(id) },
            data: { title: title },
          }.catch((err) => {
            utils.Error(res, "User not found");
          })
        );
        */
        utils.send(res, "Successfully updated");
      })
      .catch((err) => {
        utils.send(res, "Error updated ");
      });
  }
  /* ------------------------------------------------------------------------------------- */
}

module.exports = User_Controller;
