const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://front.serverest.dev',
    env: {
      apiUrl: 'https://serverest.dev'
    },
    viewportWidth: 1440,
    viewportHeight: 900,
    video: false,
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    setupNodeEvents(on, config) {
      return config;
    }
  }
});