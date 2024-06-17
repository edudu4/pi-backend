const supertest = require("supertest");

const app = require("../app");

const jwt = require('jsonwebtoken');

const req = supertest(app);

let id = null;

describe("API Projeto Integrador BackEnd - Produto", () => {
  let token = null;
  let usuario_id = null;

  beforeAll(async () => {
    const res = await req.post("/auth/cadastrar").send({
      email: "eduardoa814222@gmail.com",
      nome: "Eduardo Alves",
      idade: 23,
      senha: "12345678"
    });
    const resLogin = await req.post("/auth").send({
      email: "eduardoa814222@gmail.com",
      senha: "12345678"
    });
    usuario_id = res.body._id;
    token = resLogin.body.token;
  }); 

  afterAll(async () => {
    await req.delete(`/usuarios/${usuario_id}`).set('authorization', token);
  });

  test("Deve retornar 201 e JSON no POST /produtos",
    async () => {
      const res = await req.post("/produtos").set('authorization', token).send({
        nome: "Teclado Mecânico",
        preco: 299.00,
        emEstoque: true
      });
      expect(res.status).toBe(201);
      expect(res.type).toBe("application/json");
    });


  test("Deve retornar 422 e JSON no POST /produtos", async () => {
    const res = await req.post("/produtos").set('authorization', token).send({});
    expect(res.status).toBe(422);
    expect(res.type).toBe("application/json");
  });


  test("Deve retornar 200 e JSON no GET /produtos", async () => {
    const res = await req.get("/produtos").set('authorization', token);
    expect(res.status).toBe(200);
    expect(res.type).toBe("application/json");
    if (res.body.length > 0) {
      id = res.body[0]._id.toString();
    }
  });


  test("Deve retornar 404 e JSON no GET /produtos/id", async () => {
    const res = await req.get('/produtos/66468fdcf3fed9c6cb64b91a').set('authorization', token);
    expect(res.status).toBe(404);
    expect(res.type).toBe("application/json");
  });


  test("Deve retornar 200 e JSON no GET /produtos/id", async () => {
    const res = await req.get(`/produtos/${id}`).set('authorization', token).set('authorization', token);
    expect(res.status).toBe(200);
    expect(res.type).toBe("application/json");
  });


  test("Deve retornar 200 e JSON no POST /comprar", async () => {
    console.log("produto:", id);
    const res = await req.post(`/produtos/comprar/`).set('authorization', token).send([{
    _id: id
    }]);
    expect(res.status).toBe(201);
    expect(res.type).toBe("application/json");
  });

  test("Deve retornar 422 e JSON no POST /comprar", async () => {
    const res = await req.post(`/produtos/comprar/`).set('authorization', token).send({});
    expect(res.status).toBe(422);
    expect(res.type).toBe("application/json");
  }); 

  test("Deve retornar 404 e JSON no POST /comprar", async () => {
    const res = await req.post(`/produtos/comprar/`).set('authorization', token).send([{_id:'666fcb7ea91e0d42314b902c'}]);
    expect(res.status).toBe(404);
    expect(res.type).toBe("application/json");
  }); 

  test("Deve retornar 200 e JSON no PUT /produtos/id", async () => {
    const res = await req.put(`/produtos/${id}`).set('authorization', token)
      .send({ preco: 499.99 });
    expect(res.status).toBe(200);
    expect(res.type).toBe("application/json");
  });

  test("Deve retornar 404 e JSON no PUT /produtos/id", async () => {
    const res = await req.put('/produtos/66468fdcf3fed9c6cb64b91a').set('authorization', token);
    expect(res.status).toBe(404);
    expect(res.type).toBe("application/json");
  });

  test("Deve retornar 422 e JSON no PUT /produtos/id", async () => {
    const res = await req.put(`/produtos/${id}`).set('authorization', token)
      .send({ emEstoque:123 });;
    expect(res.status).toBe(422);
    expect(res.type).toBe("application/json");
  });


  test("Deve retornar 204 e JSON no DELETE /produtos/id", async () => {
    const res = await req.delete(`/produtos/${id}`).set('authorization', token);
    expect(res.status).toBe(204);
    expect(res.type).toBe("");
  });


  test("Deve retornar 404 e JSON no DELETE /produtos/id", async () => {
    const res = await req.delete(`/produtos/${id}`).set('authorization', token);
    expect(res.status).toBe(404);
    expect(res.type).toBe("application/json");
  });
});