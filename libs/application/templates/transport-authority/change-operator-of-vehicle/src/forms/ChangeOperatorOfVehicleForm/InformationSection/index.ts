import { buildSection } from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { pickVehicleSubSection } from './pickVehicleSubSection'
import { ownerSubSection } from './ownerSubSection'
import { operatorSubSection } from './operatorSubSection'
import { mainOperatorSubSection } from './mainOperatorSubSection'

export const informationSection = buildSection({
  id: 'information',
  title: information.general.sectionTitle,
  children: [
    pickVehicleSubSection,
    ownerSubSection,
    operatorSubSection,
    mainOperatorSubSection,
  ],
})
