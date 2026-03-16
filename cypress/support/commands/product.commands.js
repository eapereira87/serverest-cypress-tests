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

Cypress.Commands.add('fillProductForm', (product) => {
  cy.getProductNameInput().clear().type(product.nome);
  cy.getProductPriceInput().clear().type(String(product.preco));
  cy.getProductDescriptionInput().clear().type(product.descricao);
  cy.getProductQuantityInput().clear().type(String(product.quantidade));
});

Cypress.Commands.add('submitProduct', () => {
  cy.getProductSubmitButton().click();
});
