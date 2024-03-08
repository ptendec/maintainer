module.exports = {
  apps: [
    {
      name: 'maintainer-bot',
      script: 'yarn',
      args: 'start:prod',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
