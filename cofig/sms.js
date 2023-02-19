const fast2sms = require("fast-two-sms");

require("dotenv").config();

const sendMessage = function (mobile, res, next) {
 let randomOTP = Math.floor(Math.random() * 10000);
  var options = {
    authorization :'LpKOkcUND4ClatShjgRIH2FVPG1wbn7sx9BfZeE03QrozXA6WdbwJ2VIs6laoPdzDC14KrOtWTuRA0vm',
    message: `your verification code is ${randomOTP}`,
    // message: "",
    numbers: [mobile],
  };
  //send this message
  fast2sms
    .sendMessage(options)
    .then((response) => {
      console.log("otp sent successfully");
    })
    .catch((error) => {
      console.log(error);
    });
  return randomOTP;
};


module.exports = {
  sendMessage,
};