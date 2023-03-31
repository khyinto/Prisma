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
