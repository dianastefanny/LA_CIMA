const request = require("supertest");
const app = require("../backend/app");

describe("Pruebas de autenticación", () => {
  
  test("Registro de usuario nuevo", async () => {
    const res = await request(app)
      .post("/auth/registro")
      .send({
        nombre_completo: "Prueba Tester",
        usuario: "tester",
        contraseña: "123456"
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
  });

  test("Login con usuario existente", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        usuario: "tester",
        contraseña: "123456"
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
  });

});
afterAll(() => {
  // Importa la conexión a la BD y ciérrala al final
  const db = require("../backend/src/config/db");
  db.end();
});