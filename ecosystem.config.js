module.exports = {
  apps: [
    {
      name: 'maintainer-bot',
      script: 'yarn',
      args: 'start:prod',
      interpreter: '/bin/bash',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
