'use strict';

const uuidv1 = require('uuid/v1');
const md5 = require('md5');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const {  STRING, UUID, DATE } = Sequelize;
    await queryInterface.createTable('users', {
      uuid: {
        type: UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: () => {
            return uuidv1().replace(/-/g, '')
        }
    },
    name: STRING(30),
    pwd: {
        type: STRING(32),
        allowNull: false,
        set(val) {
            this.setDataValue("pwd", md5(val));
        }
    },
    realname: STRING(30),
    phone: {
        type: STRING(15),
        allowNull: false
    },
    email: {
        type: STRING(30),
        allowNull: false
    },
    create_time: {
        type: DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
