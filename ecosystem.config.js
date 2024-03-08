module.exports = {
  apps: [
    {
      name: 'maintainer-bot',
      script: 'yarn',
      args: 'start:prod',
      autorestart: true,
    },
  ],
};
