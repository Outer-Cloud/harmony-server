module.exports = [
  "jsonwebtoken",
  "JWT_SECRET",
  "TOKEN_LIFE_TIME",
  (jsonwebtoken, JWT_SECRET, TOKEN_LIFE_TIME) => {
    const base = ["_id", "__v"];

    return {
      invalid: {
        base,
        account: [...base, "tokens", "discriminator"],
        profile: [...base, "avatar", "account"],
      },
      isValid: (query, schema, invalid) => {
        const validFields = Object.keys(schema).filter((field) => {
          return !invalid.includes(field);
        });

        const updateFields = Object.keys(query);

        return updateFields.every((field) => {
          return validFields.includes(field);
        });
      },

      isValidPassword: (password) => {
        passwordRegExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?])/;
        passwordLen = password.length;
        return (
          passwordLen >= 7 &&
          passwordLen <= 24 &&
          password.match(passwordRegExp)
        );
      },

      generateToken: (id) => {
        const currentDate = new Date().getTime();
        const expirationDate = new Date(currentDate + TOKEN_LIFE_TIME * 1000);

        const token = jsonwebtoken.sign(
          {
            _id: id,
            exp: expirationDate.getTime() / 1000,
            iat: currentDate / 1000,
          },
          JWT_SECRET
        );

        return token;
      },
    };
  },
];
