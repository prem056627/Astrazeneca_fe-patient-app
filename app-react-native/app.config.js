// app.config.js
const ENVIRONMENTS = {
    dev: {
      apiUrl: 'https://newmiapp.serveo.net',
      // apiUrl: 'https://newmi.loca.lt',
      // apiUrl:'http://app0.zelthy.com:8000'
    },
    staging: {
      apiUrl: 'https://zel3-newmicaresstaging.zelthy.in',
    },
    prod: {
      apiUrl: 'https://clinic.newmi.in',
    }
  };
  
  export default ({ config }) => {
    // Get environment from env variable or default to 'dev'
    const ENV = process.env.APP_ENV || 'dev';
    
    // Get the appropriate URLs based on environment
    const envConfig = ENVIRONMENTS[ENV];
    
    return {
      ...config,
      name: `${config.name}${ENV === 'prod' ? '' : ` (${ENV})`}`,
      extra: {
        ...config.extra, // This preserves existing extra values, including eas.projectId
        env: ENV,
        ...envConfig
      }
    };
  };