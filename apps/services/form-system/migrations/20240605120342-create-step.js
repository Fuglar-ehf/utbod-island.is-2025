'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.createTable(
        'steps',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          name: {
            type: Sequelize.JSON,
            allowNull: false,
          },
          created: {
            type: 'TIMESTAMP WITH TIME ZONE',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
          },
          modified: {
            type: 'TIMESTAMP WITH TIME ZONE',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
          },
          step_type: {
            type: Sequelize.DataTypes.ENUM(
              'premises',
              'parties',
              'input',
              'payment',
            ),
            allowNull: false,
            defaultValue: 'input',
          },
          display_order: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          waiting_text: {
            type: Sequelize.JSON,
            allowNull: true,
          },
          is_hidden: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          call_ruleset: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          is_completed: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          form_id: {
            type: Sequelize.UUID,
            onDelete: 'CASCADE',
            allowNull: false,
            references: {
              model: 'forms',
              key: 'id',
            },
          },
        },
        { transaction: t },
      ),
    )
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.dropTable('steps', { transaction: t }),
    )
  },
}
