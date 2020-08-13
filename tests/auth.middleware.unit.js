const sinon = require("sinon");
const jwt = require("jsonwebtoken");

const tokenKey = require("../src/constants").TOKEN_SECRET_KEY;
const authorization = require("../src/middlewares/authorization");
const userModel = require("../src/models/UserModel");

describe("authorization unit test", () => {
  describe("пользователь не передал токен в Authorization заголовке", () => {
    let sandbox, req, res, next, token, verifyTokenStub, findByIdStub;

    before(async () => {
      sandbox = sinon.createSandbox();
      token = "";

      req = {
        headers: {},
        get(header) {
          return "";
        },
      };

      res = {
        status: sandbox.stub().returns(res),
        send: sandbox.stub().returns(res),
      };

      next = sandbox.stub();

      findByIdStub = sandbox.stub(userModel, "findById");

      verifyTokenStub = sandbox.stub(jwt, "verify");

      await authorization(req, res, next);
    });

    it("should call jwt.verify once with exact params", () => {
      sinon.assert.calledOnceWithExactly(verifyTokenStub, token, tokenKey);
    });

    it("should call res.status once with proper code", () => {
      sinon.assert.calledOnceWithExactly(res.status, 401);
    });

    it("should not call find user by id", () => {
      sinon.assert.notCalled(findByIdStub);
    });

    it("should call next once", () => {
      sinon.assert.calledOnce(next);
    });

    after(() => {
      sandbox.restore();
    });
  });

  describe("токен пользователя невалидный", () => {
    let sandbox, req, res, next, token, verifyTokenStub, findByIdStub;
    before(async () => {
      sandbox = sinon.createSandbox();

      token = "invalidToken";

      req = {
        headers: { authorization: `Bearer ${token}` },
        get(header) {
          return this.headers[header.toLowerCase()];
        },
      };

      res = {
        status: sandbox.stub().returns(res),
        send: sandbox.stub().returns(res),
      };

      next = sandbox.stub();

      verifyTokenStub = sandbox.stub(jwt, "verify");
      findByIdStub = sandbox.stub(userModel, "findById");

      await authorization(req, res, next);
    });

    it("should call jwt.verify once with exact params", () => {
      sinon.assert.calledOnceWithExactly(verifyTokenStub, token, tokenKey);
    });

    it("should call res.status once with proper code", () => {
      sinon.assert.calledOnceWithExactly(res.status, 401);
    });

    it("should not call find user by id", () => {
      sinon.assert.notCalled(findByIdStub);
    });

    it("should call next once", () => {
      sinon.assert.calledOnce(next);
    });

    after(() => {
      sandbox.restore();
    });
  });

  describe("токен пользователя валидный", () => {
    let sandbox, req, res, next, token, verifyTokenStub, findByIdStub, user;

    before(async () => {
      sandbox = sinon.createSandbox();

      user = {
        id: "randomId",
      };

      token = jwt.sign({ id: user.id }, tokenKey);

      req = {
        headers: {
          authorization: `Bearer ${token}`,
        },
        get(header) {
          return this.headers[header.toLowerCase()];
        },
      };

      res = {
        status: sandbox.stub().returns(res),
        send: sandbox.stub().returns(res),
      };

      next = sandbox.stub();

      verifyTokenStub = sandbox.stub(jwt, "verify").returns(user.id);

      findByIdStub = sandbox
        .stub(userModel, "findById")
        .returns({ id: "databaseId", token });

      await authorization(req, res, next);
    });

    it("should call jwt.verify once with exact params", () => {
      sinon.assert.calledOnceWithExactly(verifyTokenStub, token, tokenKey);
    });

    it("should call find by id once with proper id", () => {
      sinon.assert.calledOnceWithExactly(
        findByIdStub,
        verifyTokenStub(token, tokenKey).id
      );
    });

    it("should not call res.status", () => {
      sinon.assert.notCalled(res.status);
    });

    it("should not call res.send", () => {
      sinon.assert.notCalled(res.send);
    });

    it("should call next once", () => {
      sinon.assert.calledOnce(next);
    });

    after(() => {
      sandbox.restore();
    });
  });
});
