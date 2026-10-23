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
  let produtoId;

  before(() => {
    cy.createAdminUserViaApi().then((user) => {
      adminUser = user;

      cy.apiLogin(user.email, user.password).then((response) => {
        expect(response.status).to.eq(200);
        authToken = response.body.authorization;
      });
    });
  });

  beforeEach(() => {
    produtoId = undefined;
  });

  afterEach(() => {
    if (produtoId) {
      cy.apiDeleteProduct(authToken, produtoId).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Registro excluído com sucesso');

        produtoId = undefined;
      });
    }
  });

  after(() => {
    if (adminUser?._id) {
      cy.apiDeleteUser(adminUser._id).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Registro excluído com sucesso');
      });
    }
  });

  it('deve cadastrar produto com sucesso', () => {
    const product = createDynamicProduct();

    cy.apiCreateProduct(authToken, product).then((response) => {
      produtoId = response.body._id;

      expect(response.status).to.eq(201);
      expect(response.body.message).to.eq('Cadastro realizado com sucesso');
      expect(produtoId).to.be.a('string').and.not.be.empty;

      assertSchema(response.body, createProductResponseSchema);
    });
  });

  it('deve consultar produto por id após cadastro', () => {
    const product = createDynamicProduct();

    cy.apiCreateProduct(authToken, product).then((response) => {
      produtoId = response.body._id;

      expect(response.status).to.eq(201);
      expect(produtoId).to.be.a('string').and.not.be.empty;

      cy.apiGetProductById(produtoId).then((consulta) => {
        expect(consulta.status).to.eq(200);
        expect(consulta.body._id).to.eq(produtoId);
        expect(consulta.body.nome).to.eq(product.nome);
        expect(consulta.body.preco).to.eq(product.preco);
        expect(consulta.body.descricao).to.eq(product.descricao);
        expect(consulta.body.quantidade).to.eq(product.quantidade);

        assertSchema(consulta.body, productSchema);
      });
    });
  });

  it('não deve permitir cadastrar produto com nome duplicado', () => {
    const product = createDynamicProduct();

    cy.apiCreateProduct(authToken, product).then((response) => {
      produtoId = response.body._id;

      expect(response.status).to.eq(201);
      expect(produtoId).to.be.a('string').and.not.be.empty;
    });

    cy.apiCreateProduct(authToken, product).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.message).to.eq('Já existe produto com esse nome');

      assertSchema(response.body, errorMessageSchema);
    });
  });

  it('deve excluir produto com sucesso', () => {
    const product = createDynamicProduct();

    cy.apiCreateProduct(authToken, product).then((response) => {
      produtoId = response.body._id;

      expect(response.status).to.eq(201);
      expect(produtoId).to.be.a('string').and.not.be.empty;

      const idExcluido = produtoId;

      cy.apiDeleteProduct(authToken, idExcluido).then((exclusao) => {
        expect(exclusao.status).to.eq(200);
        expect(exclusao.body.message).to.eq('Registro excluído com sucesso');

        produtoId = undefined;

        assertSchema(exclusao.body, deleteProductResponseSchema);
      });

      cy.apiGetProductById(idExcluido).then((consulta) => {
        expect(consulta.status).to.eq(400);
        expect(consulta.body.message).to.eq('Produto não encontrado');

        assertSchema(consulta.body, errorMessageSchema);
      });
    });
  });
});
