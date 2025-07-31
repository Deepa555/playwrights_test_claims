// Environment configuration for different stages
const config = {
  development: {
    baseURL: 'https://employer.modoff.secure.azblue.com',
    loginURL: 'https://employer.modoff.secure.azblue.com/log-in',
    timeout: 30000,
    retries: 1,
    workers: 1
  },
  
  staging: {
    baseURL: 'https://staging.employer.modoff.secure.azblue.com',
    loginURL: 'https://staging.employer.modoff.secure.azblue.com/log-in',
    timeout: 30000,
    retries: 2,
    workers: 2
  },
  
  production: {
    baseURL: 'https://employer.modoff.secure.azblue.com',
    loginURL: 'https://employer.modoff.secure.azblue.com/log-in',
    timeout: 45000,
    retries: 3,
    workers: 1
  },
  
  ci: {
    baseURL: 'https://employer.modoff.secure.azblue.com',
    loginURL: 'https://employer.modoff.secure.azblue.com/log-in',
    timeout: 60000,
    retries: 2,
    workers: 3
  }
};

// Get environment from NODE_ENV or default to development
const environment = process.env.NODE_ENV || 'development';

module.exports = config[environment] || config.development;
