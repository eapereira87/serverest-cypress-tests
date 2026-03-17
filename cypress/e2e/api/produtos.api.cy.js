import { createDynamicProduct } from '../../support/factories';
import { assertSchema } from '../../support/utils/schemaValidator';
import {
  createProductResponseSchema,
  productSchema,
  deleteProductResponseSchema,
  errorMessageSchema
} from '../../support/schemas/product.schema';

describe('API - Produtos', () => {

  let adminUser;
  let authToken;

  before(() => {
    cy.createAdminUserViaApi().then((user) => {
      adminUser = user;

      cy.apiLogin(user.email, user.password).then((response) => {
        expect(response.status).to.eq(200);
        authToken = response.body.authorization;
      });
    });
  });

  it('deve cadastrar produto com sucesso', () => {
    const product = createDynamicProduct();

    cy.apiCreateProduct(authToken, product).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.message).to.eq('Cadastro realizado com sucesso');
      expect(response.body._id).to.be.a('string').and.not.be.empty;

      assertSchema(response.body, createProductResponseSchema);
    });
  });

  it('deve consultar produto por id após cadastro', () => {
    const product = createDynamicProduct();

    cy.apiCreateProduct(authToken, product).then((createResponse) => {
      expect(createResponse.status).to.eq(201);

      const productId = createResponse.body._id;

      cy.apiGetProductById(productId).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.nome).to.eq(product.nome);
        expect(response.body.preco).to.eq(product.preco);
        expect(response.body.descricao).to.eq(product.descricao);
        expect(response.body.quantidade).to.eq(product.quantidade);

        assertSchema(response.body, productSchema);
      });
    });
  });

  it('não deve permitir cadastrar produto com nome duplicado', () => {
    const product = createDynamicProduct();

    cy.apiCreateProduct(authToken, product).then((firstResponse) => {
      expect(firstResponse.status).to.eq(201);
    });

    cy.apiCreateProduct(authToken, product).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.message).to.eq('Já existe produto com esse nome');

      assertSchema(response.body, errorMessageSchema);
    });
  });

  it('deve excluir produto com sucesso', () => {
    const product = createDynamicProduct();

    cy.apiCreateProduct(authToken, product).then((createResponse) => {
      expect(createResponse.status).to.eq(201);
      const productId = createResponse.body._id;

      cy.apiDeleteProduct(authToken, productId).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Registro excluído com sucesso');

        assertSchema(response.body, deleteProductResponseSchema);
      });

      cy.apiGetProductById(productId).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.eq('Produto não encontrado');

        assertSchema(response.body, errorMessageSchema);
      });
    });
  });

});
