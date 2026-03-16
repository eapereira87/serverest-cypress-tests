Cypress.Commands.add('getProductNameInput', () => {
  return cy.get('[data-testid="nome"]');
});

Cypress.Commands.add('getProductPriceInput', () => {
  return cy.get('[data-testid="preco"]');
});

Cypress.Commands.add('getProductDescriptionInput', () => {
  return cy.get('[data-testid="descricao"]');
});

Cypress.Commands.add('getProductQuantityInput', () => {
  return cy.get('[data-testid="quantity"]');
});

Cypress.Commands.add('getProductImageInput', () => {
  return cy.get('[data-testid="imagem"]');
});

Cypress.Commands.add('getProductSubmitButton', () => {
  return cy.get('[data-testid="cadastarProdutos"]');
});

Cypress.Commands.add('getProductsTable', () => {
  return cy.get('table');
});

Cypress.Commands.add('getProductRowByName', (name) => {
  return cy.contains('td', name).parent('tr');
});

Cypress.Commands.add('getDeleteProductButtonByName', (name) => {
  return cy.getProductRowByName(name).contains('button', 'Excluir');
});

Cypress.Commands.add('getDuplicateProductMessage', () => {
  return cy.contains('Já existe produto com esse nome');
});

Cypress.Commands.add('generateDynamicProduct', () => {
  const timestamp = Date.now();

  const product = {
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

  return cy.wrap(product);
});

Cypress.Commands.add('fillProductForm', (product) => {
  cy.getProductNameInput().clear().type(product.nome);
  cy.getProductPriceInput().clear().type(String(product.preco));
  cy.getProductDescriptionInput().clear().type(product.descricao);
  cy.getProductQuantityInput().clear().type(String(product.quantidade));

  cy.getProductImageInput().selectFile({
    contents: product.imagem.contents,
    fileName: product.imagem.fileName,
    mimeType: product.imagem.mimeType,
    lastModified: Date.now()
  }, { force: true });
});

Cypress.Commands.add('submitProduct', () => {
  cy.getProductSubmitButton().click();
});

Cypress.Commands.add('assertProductFormVisible', () => {
  cy.getProductSubmitButton().should('be.visible');
});

Cypress.Commands.add('assertProductImageSelected', (product) => {
  cy.getProductImageInput().then(($input) => {
    const input = $input[0];
    expect(input.files).to.have.length(1);
    expect(input.files[0].name).to.eq(product.imagem.fileName);
  });
});

Cypress.Commands.add('assertProductListPageVisible', () => {
  cy.get('h1').should('contain', 'Lista dos Produtos');
  cy.getProductsTable().should('be.visible');
});

Cypress.Commands.add('assertProductInList', (product) => {
  cy.getProductRowByName(product.nome)
    .should('contain', product.nome)
    .and('contain', String(product.preco))
    .and('contain', product.descricao)
    .and('contain', String(product.quantidade))
    .and('contain', product.imagem.fileName);
});

Cypress.Commands.add('deleteProductByName', (name) => {
  cy.getDeleteProductButtonByName(name).click();
});

Cypress.Commands.add('assertProductNotInList', (name) => {
  cy.contains('td', name).should('not.exist');
});

Cypress.Commands.add('assertDuplicateProductMessageVisible', () => {
  cy.getDuplicateProductMessage().should('be.visible');
});
