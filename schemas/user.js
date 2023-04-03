const mongoose = require("mongoose");

// 스키마 정의
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
});

/*
// 새로운 도큐먼트 생성
const user = new User({
  name: 'John Doe',
  email: 'johndoe@example.com',
  age: 25
});
// 도큐먼트 저장
user.save()
  .then((result) => {
    console.log(result); // 저장된 도큐먼트 출력
  })
  .catch((error) => {
    console.error(error); // 에러 출력
  });
*/

module.exports = mongoose.model("User", userSchema);
