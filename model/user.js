const Sequelize = require('sequelize')
const db = require('../db')

class User extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        unionid: { type: DataTypes.STRING(64) },
        openid: { type: DataTypes.STRING(64), },
        nickname: { type: DataTypes.STRING(64) },
        avatar: { type: DataTypes.STRING(256) },
        access_token: { type: DataTypes.STRING(128) },
        refresh_token: { type: DataTypes.STRING(128) }
      },
      {
        indexes: [ { unique: true, fields: ['unionid'] }, { unique: true, fields: ['openid'] } ],
        tableName: 'users',
        sequelize
      }
    )
  }
}


const UserModel = User.init(db, Sequelize)
UserModel.sync({ force: false })

module.exports = UserModel