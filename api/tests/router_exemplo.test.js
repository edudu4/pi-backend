const supertest = require("supertest");

const app = require("../app");

const request = supertest(app);

describe("API", () => {
  test("Deve retornar CODIGO e CORPO no METODO /ROTA", async () => {});
});
