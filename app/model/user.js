'use strict';

const uuidv1 = require('uuid/v1');
const md5 = require('md5');

module.exports = app => {
    const { STRING, UUID, DATE } = app.Sequelize;

    const User = app.model.define('user', {
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
            defaultValue: app.Sequelize.NOW
        }
    },{
        // timestamps: false
    });

    return User;
}