import React from 'react'

import { ViewportContext } from '@island.is/judicial-system-web/src/components'
import type { Rect } from '@island.is/judicial-system-web/src/components'

export const useViewport = (): Rect => React.useContext<Rect>(ViewportContext)

export default useViewport
