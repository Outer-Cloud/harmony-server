const account = {
  username,
  discriminator,
  email,
  password,
  tokens,
};
const category = {
  name,
  server,
};
const message = {
  text,
  author,
  room,
  time,
  isPinned,
};
const server = {
  name,
  owner,
  channelsAndCategories: {
    channel,
    category,
  },
};
const user = {
  name,
  age,
  status,
  language,
  statusMessage,
  servers,
  directMessages,
  friends,
  blocked,
  pending,
  account,
};

const schemas = {
  account,
  category,
  message,
  message,
  user,
};

module.exports = [
    "schemas",
    schemas
]
