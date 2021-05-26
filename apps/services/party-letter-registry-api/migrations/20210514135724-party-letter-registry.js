'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    // try is here to make sure this safely fails if index creation fails
    try {
      await queryInterface.createTable('party_letter_registry', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        party_letter: {
          type: Sequelize.CHAR(2),
          allowNull: false,
          unique: true,
        },
        party_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        owner: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        managers: {
          type: Sequelize.ARRAY(Sequelize.STRING),
          allowNull: false,
        },
        created: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        modified: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      })
      await queryInterface.addIndex('party_letter_registry', ['owner'])
      transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('party_letter_registry')
  },
}
