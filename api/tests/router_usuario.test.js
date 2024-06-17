const supertest = require("supertest");

const app = require("../app");

const jwt = require('jsonwebtoken');

const req = supertest(app);

let id = null;

describe("API Projeto Integrador BackEnd - Usuario", () => {
  let token = null;

  beforeAll(() => {
    token = jwt.sign({ username: 'testuser' }, process.env.SECRET, { expiresIn: '1h' });
  });

  test("Deve retornar 201 e JSON no POST /cadastrar",
    async () => {
      const res = await req.post("/auth/cadastrar").send({
        email: "eduardoa8142@gmail.com",
        nome: "Eduardo Alves",
        idade: 23,
        senha: "12345678"
      });
      expect(res.status).toBe(201);
      expect(res.type).toBe("application/json"); 
    });


    test("Deve retornar 422 e JSON no POST /cadastrar", async () => {
      const res = await req.post("/auth/cadastrar").send({});
      expect(res.status).toBe(422);
      expect(res.type).toBe("application/json");
    });


  test("Deve retornar 200 e JSON no GET /usuarios", async () => {
    const res = await req.get("/usuarios").set('authorization', token);
    expect(res.status).toBe(200);
    expect(res.type).toBe("application/json");
    if (res.body.length > 0) {
      id = res.body[0]._id.toString();
    }
  });

  
  test("Deve retornar 404 e JSON no GET /usuarios/id", async () =>{
    const res = await req.get('/usuarios/66468fdcf3fed9c6cb64b91a').set('authorization', token);
    expect(res.status).toBe(404);
    expect(res.type).toBe("application/json");
  });


  test("Deve retornar 200 e JSON no GET /usuarios/id", async() => {
    const res = await req.get(`/usuarios/${id}`).set('authorization', token).set('authorization', token);
    expect(res.status).toBe(200);
    expect(res.type).toBe("application/json");
  });

  
  test("Deve retornar 200 e JSON no PUT /usuarios/id", async() => {
    const res = await req.put(`/usuarios/${id}`).set('authorization', token)
      .send({nome: "Eduardo Alves da Rocha", idade:23});
    expect(res.status).toBe(200);
    expect(res.type).toBe("application/json");
  });

  test("Deve retornar 404 e JSON no PUT /usuarios/id", async () =>{
    const res = await req.put('/usuarios/66468fdcf3fed9c6cb64b91a').set('authorization', token);
    expect(res.status).toBe(404);
    expect(res.type).toBe("application/json");
  });

  test("Deve retornar 422 e JSON no PUT /usuarios/id", async() => {
    const res = await req.put(`/usuarios/${id}`).set('authorization', token)
    .send({nome: "Eduardo Alves da Rocha", idade:"Teste"});;
    expect(res.status).toBe(422);
    expect(res.type).toBe("application/json");     
  });

  
  test("Deve retornar 204 e JSON no DELETE /usuarios/id", async () => {
    const res = await req.delete(`/usuarios/${id}`).set('authorization', token);
    expect(res.status).toBe(204);
    expect(res.type).toBe("");
  });


  test("Deve retornar 404 e JSON no DELETE /usuarios/id", async () => {
    const res = await req.delete(`/usuarios/${id}`).set('authorization', token);
    expect(res.status).toBe(404);
    expect(res.type).toBe("application/json");
  });
});