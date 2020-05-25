//todo: write tests
const controller = require("../../controllers/message");
const repo = {
  create: (opt) => {return opt.query},
  createMany: (opt) => {return opt.query},
  get: (opt) => {return opt.query},
  getMessageForRoom: (opt) => {return opt.query},
  delete: (opt) => {return opt.query},
  update: (opt) => {return opt.query},
};
const functions = controller[1](repo);
const mongoose = require("mongoose");

test("new message normal message", () => {
  //const  time = new Date(1590021724501);
  const req = {
    text: "aaaaa",
    author: "5dd4dcfe36424d441068f7aa",
    room: "5dd4dcfe36424d441068f7aa",
    isPinned: false,
    time: 1590021724501
  };

  const res = {
    json: async (ret) => {
      const items = ret.keys();
      for (i in items) {
          
        expect(ret[i]).toEqual(req[i]);
      }
    },
  };
  const next = {};
  functions.newMessage(req, res, next);
});
