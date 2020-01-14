'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, jwt } = app;
  // const auth = app.middleware.jwt({});

  router.get('/', controller.home.index);
  // router.post('/users/create', controller.users.create)

  router.post('users', '/users/login', controller.users.login);
  router.get('users', '/users/userInfo', jwt, controller.users.userInfo);
  router.resources('users', '/users', jwt, controller.users);
};
