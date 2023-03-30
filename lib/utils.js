exports.send = (res, data) => {
  res.send(data);
};

exports.Success = (res, data) => {
  res.send(data);
  console.log("Success");
};

exports.Error = (res, data) => {
  const msg = { error: data };
  res.send(msg);
  console.log("Error");
};
