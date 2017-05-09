const Sequelize = require('sequelize')
const db = require('./database')

module.exports = db.define('events', {
  userId: Sequelize.STRING,
  type: Sequelize.STRING,
  message: Sequelize.STRING,
  rawEvent: Sequelize.STRING,
  createdAt: Sequelize.DATE
})
