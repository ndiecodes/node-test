const { validate } = require("indicative").validator;
const { User } = require("../models");

exports.register = async (req, res) => {
  //Validate request data
  const rules = {
    name: "required|string",
    email: "required|email",
    password: "required|min:6|max:30"
  };

  validate(req.body, rules).catch(errors => {
    return res.status(422).json(errors[0]);
  });
  try {
    const user = new User(); //initialize mongoose Model
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    await user.save(); //save user record to database

    const token = user.getJWT();

    // data { user, token } = data {user: user, token token}
    return res.status(201).json({ data: { user, token } });

  } catch (err) {
    //return error if user unique field already exists
    if (err.name === "MongoError" && err.code === 11000) {
      field = Object.keys(err.keyValue)[0];
      const response = {
        message: `${field} already exists!`,
        field: field
      };
      return res.status(422).json(response);
    }

    return res.status(409).json({ message: "error saving data" });
  }
};