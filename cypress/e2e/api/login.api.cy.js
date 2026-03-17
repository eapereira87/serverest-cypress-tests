import { assertSchema } from '../../support/utils/schemaValidator';
import { loginSuccessSchema, errorMessageSchema } from '../../support/schemas/login.schema';

describe('API - Login', () => {

  let adminUser;

  before(() => {
    cy.createAdminUserViaApi().then((user) => {
      adminUser = user;
    });
  });

  it('deve realizar login com sucesso com credenciais válidas', () => {
    cy.apiLogin(adminUser.email, adminUser.password).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq('Login realizado com sucesso');
      expect(response.body.authorization).to.match(/^Bearer\s.+/);

      assertSchema(response.body, loginSuccessSchema);
    });
  });

  it('não deve permitir login com senha incorreta', () => {
    cy.apiLogin(adminUser.email, 'SenhaIncorreta123').then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.message).to.eq('Email e/ou senha inválidos');

      assertSchema(response.body, errorMessageSchema);
    });
  });

});
