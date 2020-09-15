'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('case', 'requested_custody_end_date', {
        type: Sequelize.DATE,
        allowNull: true,
      }),
      queryInterface.addColumn('case', 'laws_broken', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.sequelize.query(
        "CREATE TYPE \"enum_case_custody_provisions\" AS ENUM ('_95_1_A', '_95_1_B', '_95_1_C', '_95_1_D', '_95_2', '_99_1_B');\
        ALTER TABLE \"case\" ADD COLUMN \"custody_provisions\" \"enum_case_custody_provisions\"[];",
      ),
      queryInterface.sequelize.query(
        'CREATE TYPE "enum_case_custody_restrictions" AS ENUM (\'ISOLATION\', \'VISITAION\', \'COMMUNICATION\', \'MEDIA\');\
        ALTER TABLE "case" ADD COLUMN "custody_restrictions" "enum_case_custody_restrictions"[];',
      ),
      queryInterface.addColumn('case', 'case_facts', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('case', 'witness_accounts', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('case', 'investigation_progress', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('case', 'legal_arguments', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('case', 'comments', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('case', 'requested_custody_end_date'),
      queryInterface.removeColumn('case', 'laws_broken'),
      queryInterface
        .removeColumn('case', 'custody_provisions')
        .then(() =>
          queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_case_custody_provisions";',
          ),
        ),
      queryInterface
        .removeColumn('case', 'custody_restrictions')
        .then(() =>
          queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_case_custody_restrictions";',
          ),
        ),
      queryInterface.removeColumn('case', 'case_facts'),
      queryInterface.removeColumn('case', 'witness_accounts'),
      queryInterface.removeColumn('case', 'investigation_progress'),
      queryInterface.removeColumn('case', 'legal_arguments'),
      queryInterface.removeColumn('case', 'comments'),
    ])
  },
}
