import { Server } from 'miragejs'

export function makeServer({ environment = 'development' } = {}) {
  const server = new Server({
    routes() {
      this.passthrough('http://localhost:4444/api/graphql')
      this.get('/api/keys', () => [
        {
          id: '1',
          name: 'Client ID',
          value: '5016d8d5cb6ce0758107b9969ea3c201',
        },
        {
          id: '2',
          name: 'Secret key',
          value: '5016d8d5cb6ce0758107b9969ea3c201',
        },
      ])
      this.get('/api/endPointVariables', () => [
        {
          id: '1',
          name: 'Audience',
          value: '5016d8d5cb6ce0758107b9969ea3c201',
        },
        {
          id: '2',
          name: 'Scope',
          value: '5016d8d5cb6ce0758107b9969ea3c201',
        },
      ])
      this.get(
        '/api/testMyEndpoint',
        () => [
          {
            id: '1',
            isValid: true,
            message: 'Skjal fannst fyrir skráða kennitölu',
          },
          {
            id: '2',
            isValid: false,
            message: 'Ekki tókst að sækja skjal til skjalaveitu',
          },
        ],
        {
          timing: 2000,
        },
      )
    },
  })
}

export default makeServer
