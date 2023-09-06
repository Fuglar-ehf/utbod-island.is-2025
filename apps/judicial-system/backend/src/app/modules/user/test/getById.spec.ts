import { uuid } from 'uuidv4'

import { Institution } from '../../institution'
import { User } from '../user.model'
import { createTestingUserModule } from './createTestingUserModule'

interface Then {
  result: User
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('UserController - Get by id', () => {
  const userId = uuid()
  let mockUserModel: typeof User
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { userModel, userController } = await createTestingUserModule()

    mockUserModel = userModel

    givenWhenThen = async () => {
      const then = {} as Then

      await userController
        .getById(userId)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('user found', () => {
    const user = { id: userId } as User
    let then: Then

    beforeEach(async () => {
      const mockFindByPk = mockUserModel.findByPk as jest.Mock
      mockFindByPk.mockReturnValueOnce(user)

      then = await givenWhenThen()
    })

    it('should return the user', () => {
      expect(mockUserModel.findByPk).toHaveBeenCalledWith(userId, {
        include: [{ model: Institution, as: 'institution' }],
      })
      expect(then.result).toBe(user)
    })
  })
})
