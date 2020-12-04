import { createParamDecorator } from '@nestjs/common'

import { User } from '@island.is/judicial-system/types'

export const CurrentGraphQlUser = createParamDecorator(
  (data, { args: [_1, _2, { req }] }): User => req.user,
)
