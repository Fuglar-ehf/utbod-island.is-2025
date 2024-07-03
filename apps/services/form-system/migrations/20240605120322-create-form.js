'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.createTable(
        'forms',
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
          invalidation_date: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          is_translated: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          application_days_to_remove: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 60,
          },
          derived_from: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          stop_progress_on_validating_step: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
          },
          completed_message: {
            type: Sequelize.JSON,
            allowNull: true,
          },
          organization_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'organizations',
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
      queryInterface.dropTable('forms', { transaction: t }),
    )
  },
}
