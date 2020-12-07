import { createParamDecorator } from '@nestjs/common'

import { User } from '@island.is/judicial-system/types'

export const CurrentHttpUser = createParamDecorator(
  (data, { args: [_1, { req }] }): User => req.user,
)
