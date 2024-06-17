const supertest = require("supertest");

const app = require("../app");

const req = supertest(app);

describe("API Projeto Integrador BackEnd - Usuario", () => {
  let token = null;
  let usuario_id = null;

  beforeAll(async () => {
    const res = await req.post("/auth/cadastrar").send({
      email: "eduardoa81422@gmail.com",
      nome: "Eduardo Alves",
      idade: 23,
      senha: "12345678"
    });
    usuario_id = res.body._id;
  });

  afterAll(async () => {
    await req.delete(`/usuarios/${usuario_id}`).set('authorization', token);
  });

  test("Deve retornar 201 e JSON no POST /auth",
    async () => {
      const res = await req.post("/auth").send({
        email: "eduardoa81422@gmail.com",
        senha: "12345678"
      });
      token = res.body.token;
      console.log("token:", token);
      expect(res.status).toBe(200);
      expect(res.type).toBe("application/json");
    });

  test("Deve retornar 422 e JSON no POST /auth",
    async () => {
      const res = await req.post("/auth").send({
        email: "eduardoa81422@gmail.com",
        senha: "1234567899"
      });
      expect(res.status).toBe(401);
      expect(res.type).toBe("application/json");
    });

  test("Deve retornar 201 e JSON no POST /auth/refresh",
    async () => {
      const res = await req.post("/auth/refresh").send({}).set('authorization', token);
      expect(res.status).toBe(200);
      expect(res.type).toBe("application/json");
      expect(res.body.token).toBeDefined();
    });

  test("Deve retornar 422 e JSON no POST /auth",
    async () => {
      const res = await req.post("/auth/refresh").send({});
      expect(res.status).toBe(400);
      expect(res.type).toBe("application/json");
    });

});