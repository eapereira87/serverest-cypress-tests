export const loginSuccessSchema = {
  type: 'object',
  required: ['message', 'authorization'],
  properties: {
    message: { type: 'string' },
    authorization: { type: 'string', pattern: /^Bearer\s.+/ }
  }
};

export const errorMessageSchema = {
  type: 'object',
  required: ['message'],
  properties: {
    message: { type: 'string' }
  }
};
