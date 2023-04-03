const { User } = require("../schemas/user");
const mongoose = require("mongoose");

exports.send = (res, data) => {
  res.send(data);
};

exports.Success = (res, data) => {
  res.send(data);
};

exports.Error = (res, data) => {
  const msg = { error: data };
  res.send(msg);
};

exports.NDB_Create = (name, email) => {};

exports.NDB_APIS = (apiName) => {};
