export const createUserResponseSchema = {
  type: 'object',
  required: ['message', '_id'],
  properties: {
    message: { type: 'string' },
    _id: { type: 'string' }
  }
};

export const userSchema = {
  type: 'object',
  required: ['nome', 'email', 'password', 'administrador', '_id'],
  properties: {
    nome: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' },
    administrador: { type: 'string', enum: ['true', 'false'] },
    _id: { type: 'string' }
  }
};

export const listUsersSchema = {
  type: 'object',
  required: ['quantidade', 'usuarios'],
  properties: {
    quantidade: { type: 'number' },
    usuarios: {
      type: 'array',
      items: userSchema
    }
  }
};

export const errorMessageSchema = {
  type: 'object',
  required: ['message'],
  properties: {
    message: { type: 'string' }
  }
};
