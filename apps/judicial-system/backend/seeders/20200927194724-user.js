'use strict'

const userSeed = JSON.parse(
  process.env.USER_SEED ||
    `[
      {
        "id": "a1fd62db-18a6-4741-88eb-a7b7a7e05833",
        "national_id": "2510654469",
        "name": "Guðjón Guðjónsson",
        "title": "aðstoðarsaksóknari",
        "mobile_number": "8589030",
        "email": "gudjon@kolibri.is",
        "role": "PROSECUTOR",
        "institution": "Lögreglustjórinn á höfuðborgarsvæðinu"
      },
      {
        "id": "cef1ba9b-99b6-47fc-a216-55c8194830aa",
        "national_id": "2408783999",
        "name": "Baldur Kristjánsson",
        "title": "dómritari",
        "mobile_number": "8949946",
        "email": "baldur@kolibri.is",
        "role": "REGISTRAR",
        "institution": "Héraðsdómur Reykjavíkur"
      },
      {
        "id": "9c0b4106-4213-43be-a6b2-ff324f4ba0c2",
        "national_id": "1112902539",
        "name": "Ívar Oddsson",
        "title": "héraðsdómari",
        "mobile_number": "6904031",
        "email": "ivaro@kolibri.is",
        "role": "JUDGE",
        "institution": "Héraðsdómur Reykjavíkur"
      }
    ]`,
)

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
      mobile_number: Sequelize.STRING,
      role: Sequelize.STRING,
    })

    return queryInterface.sequelize.transaction((t) =>
      Promise.all(
        userSeed.map((user) =>
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
