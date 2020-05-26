//todo: write tests
const controller = require("../../src/controllers/message");
const repo = {
  create: (opt) => {
    return opt.query;
  },
  createMany: (opt) => {
    return opt.query;
  },
  get: (opt) => {
    return opt.query;
  },
  getMessageForRoom: (opt) => {
    return opt.query;
  },
  delete: (opt) => {
    return opt.query;
  },
  update: (opt) => {
    return opt.query;
  },
};
const functions = controller[1](repo);
var retval;

test("new message normal message", async() => {
  const  time = new Date(1590021724501);
  const body = {
    text: "aaaaa",
    author: "5dd4dcfe36424d441068f7aa",
    room: "5dd4dcfe36424d441068f7aa",
    isPinned: false,
    time,
    //time: 1590021724501
  };
  const req = {
    body,
  };

  const res = {
    json: (ret) => {
      expect(ret).toEqual(body);
    },
  };
  const next = {};
  await functions.newMessage(req, res, next);

});
