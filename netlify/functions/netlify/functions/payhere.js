exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "PayHere function is working!"
    })
  };
};
