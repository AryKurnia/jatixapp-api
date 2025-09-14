module.exports = {
  isAdmin: {
    auth: {
      strategy: 'jatixapp_jwt',
      access: {
        scope: ['admin'], // atau bisa custom cek credentials
      },
    },
  },
  isUser: {
    auth: {
      strategy: 'jatixapp_jwt',
      access: {
        scope: ['user', 'admin'],
      },
    },
  },
};
