export function createDynamicUser(overrides = {}) {
  const timestamp = Date.now();

  return {
    nome: `Usuario Teste ${timestamp}`,
    email: `usuario${timestamp}@teste.com`,
    password: `Teste@${timestamp}`,
    administrador: 'true',
    ...overrides
  };
}

export function createDynamicProduct() {
  const timestamp = Date.now();

  return {
    nome: `Produto QA ${timestamp}`,
    preco: Number(`1${String(timestamp).slice(-2)}`),
    descricao: `Descricao produto ${timestamp}`,
    quantidade: Number(String(timestamp).slice(-2)),
    imagem: {
      fileName: `produto-${timestamp}.png`,
      mimeType: 'image/png',
      contents: Cypress.Buffer.from(`imagem-dinamica-${timestamp}`)
    }
  };
}
