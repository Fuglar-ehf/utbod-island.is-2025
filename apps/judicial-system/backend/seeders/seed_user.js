'use strict'

const userSeeds = `[
  {
    "id": "a1fd62db-18a6-4741-88eb-a7b7a7e05833",
    "national_id": "0000000009",
    "name": "Áki Ákærandi",
    "title": "ákærandi",
    "mobile_number": "0000000",
    "email": "aki@dmr.is",
    "role": "PROSECUTOR",
    "institution_id": "7b261673-8990-46b4-a310-5412ad77686a"
  },
  {
    "id": "cef1ba9b-99b6-47fc-a216-55c8194830aa",
    "national_id": "0000001119",
    "name": "Dalli Dómritari",
    "title": "dómritari",
    "mobile_number": "1111111",
    "email": "dalli@dmr.is",
    "role": "REGISTRAR",
    "institution_id": "a38666f3-0444-4e44-9654-b83f39f4db11"
  },
  {
    "id": "9c0b4106-4213-43be-a6b2-ff324f4ba0c2",
    "national_id": "0000002229",
    "name": "Dóra Dómari",
    "title": "dómari",
    "mobile_number": "2222222",
    "email": "dora@dmr.is",
    "role": "JUDGE",
    "institution_id": "a38666f3-0444-4e44-9654-b83f39f4db11"
  }
]`

module.exports = {
  up: (queryInterface, Sequelize) => {
    var model = queryInterface.sequelize.define('user', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      created: Sequelize.DATE,
      updated: Sequelize.DATE,
      national_id: Sequelize.STRING,
      name: Sequelize.STRING,
      title: Sequelize.STRING,
      mobile_number: Sequelize.STRING,
      email: Sequelize.STRING,
      role: Sequelize.STRING,
      institution_id: Sequelize.UUID,
    })

    return queryInterface.sequelize.transaction((t) =>
      Promise.all(
        JSON.parse(userSeeds).map((user) =>
          queryInterface.upsert(
            'user',
            {
              ...user,
              created: new Date(),
              modified: new Date(),
            },
            {
              ...user,
              modified: new Date(),
            },
            { id: user.id },
            model,
            { transaction: t },
          ),
        ),
      ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.bulkDelete('user', null, { transaction: t }),
    )
  },
}
