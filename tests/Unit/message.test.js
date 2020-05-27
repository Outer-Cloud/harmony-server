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
    return opt;
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

test("normal delete message",async() =>{
  const body = {
    ID: "5dd4dcfe36424d441068f7aa"
  }
  const req = {
    body,
  };
  const res = {
    json: (ret) => {
      expect(ret._id).toEqual(body.ID);
    },
  };
  const next = {};
  await functions.deleteMessage(req, res, next);
});

test("normal edit message",async() =>{
  const body = {
    ID: "5dd4dcfe36424d441068f7aa",
    text: "sdfw"
  }
  const req = {
    body,
  };

  const res = {
    json: (ret) => {
      expect(ret.query._id).toEqual(body.ID);
      expect(ret.update.text).toEqual(body.text)
    },
  };
  const next = {};
  await functions.editMessage(req, res, next);
});

test("normal get message",async() =>{
  const body = {
    ID: "5dd4dcfe36424d441068f7aa"
  }
  const req = {
    body,
  };
  const res = {
    json: (ret) => {
      expect(ret._id).toEqual(body.ID);
    },
  };
  const next = (error)=>{};
  await functions.getMessage(req, res, next);
});