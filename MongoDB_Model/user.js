// 몽고db에 저장할 유저 관련 로그들

const mongoose = require("mongoose");

// 스키마 정의
const apiSchema = new mongoose.Schema({
  name: String,
});

const api_model = mongoose.model("api", apiSchema);

exports.API = (path) => {
  var api = new api_model({ name: path });

  api
    .save()
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.error(error);
    });
};
