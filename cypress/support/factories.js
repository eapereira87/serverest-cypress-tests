export function createDynamicUser(overrides = {}) {
  const id = crypto.randomUUID();

  return {
    nome: `Usuario Teste ${id}`,
    email: `usuario${id}@example.com`,
    password: 'Teste@123456',
    administrador: 'true',
    ...overrides
  };
}

export function createDynamicProduct() {
  const id = crypto.randomUUID();

  return {
    nome: `Produto QA ${id}`,
    preco: 150,
    descricao: `Descricao produto ${id}`,
    quantidade: 10
  };
}
