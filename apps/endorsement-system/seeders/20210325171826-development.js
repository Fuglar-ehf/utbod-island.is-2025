'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const endorsementIds = [
      '9c0b4106-4213-43be-a6b2-ff324f4ba0c1',
      '9c0b4106-4213-43be-a6b2-ff324f4ba0c2',
      '9c0b4106-4213-43be-a6b2-ff324f4ba0c3',
    ]

    const endorsementLists = [
      {
        id: endorsementIds[0],
        title: faker.lorem.words(2),
        description: faker.lorem.paragraph(1),
        closed_date: null,
        endorsement_meta: ['fullName'],
        tags: ['sudurkjordaemi'],
        validation_rules: JSON.stringify([
          {
            type: 'minAgeAtDate',
            value: '2021-03-15:18',
          },
        ]),
        owner: '1111111111',
        created: new Date(),
        modified: new Date(),
      },
      {
        id: endorsementIds[1],
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(1),
        closed_date: null,
        tags: ['nordausturkjordaemi'],
        endorsement_meta: ['fullName'],
        validation_rules: JSON.stringify([
          {
            type: 'minAgeAtDate',
            value: '2021-03-15:18',
          },
        ]),
        owner: '1111111111',
        created: new Date(),
        modified: new Date(),
      },
      {
        id: endorsementIds[2],
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(1),
        closed_date: new Date(),
        tags: ['nordausturkjordaemi'],
        endorsement_meta: ['fullName'],
        validation_rules: JSON.stringify([
          {
            type: 'minAgeAtDate',
            value: '2021-03-15:18',
          },
        ]),
        owner: '1111111111',
        created: new Date(),
        modified: new Date(),
      },
    ]

    await queryInterface.bulkInsert('endorsement_list', endorsementLists)

    const endorsements = new Array(10).fill().map(() => ({
      id: faker.random.uuid(),
      endorser: faker.phone.phoneNumber('##########'),
      endorsement_list_id: faker.random.arrayElement(endorsementIds),
      meta: JSON.stringify({
        fullName: faker.fake('{{name.firstName}} {{name.lastName}}'),
      }),
      created: new Date(),
      modified: new Date(),
    }))

    // we want to ensure at least one endorsement belongs to the first list
    endorsements.push({
      id: faker.random.uuid(),
      endorser: '0000000000',
      endorsement_list_id: endorsementIds[0],
      meta: JSON.stringify({
        fullName: faker.fake('{{name.firstName}} {{name.lastName}}'),
      }),
      created: new Date(),
      modified: new Date(),
    })

    // this endorsements is deleted in tests
    endorsements.push({
      id: faker.random.uuid(),
      endorser: '0000000000',
      endorsement_list_id: endorsementIds[1],
      meta: JSON.stringify({
        fullName: faker.fake('{{name.firstName}} {{name.lastName}}'),
      }),
      created: new Date(),
      modified: new Date(),
    })

    await queryInterface.bulkInsert('endorsement', endorsements)
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete('endorsement'),
      queryInterface.bulkDelete('endorsement_list'),
    ])
  },
}
