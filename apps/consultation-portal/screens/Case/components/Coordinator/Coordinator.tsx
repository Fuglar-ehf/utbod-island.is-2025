import { SimpleCardSkeleton } from '../../../../components/Card'
import StackedTitleAndDescription from '../../../../components/StackedTitleAndDescription/StackedTitleAndDescription'
import { Text } from '@island.is/island-ui/core'
import localization from '../../Case.json'

interface Props {
  contactEmail: string
  contactName: string
}

export const Coordinator = ({ contactEmail, contactName }: Props) => {
  const loc = localization['coordinator']

  return (
    <SimpleCardSkeleton>
      <StackedTitleAndDescription title={loc.title}>
        {contactName || contactEmail ? (
          <>
            {contactName && <Text>{contactName}</Text>}
            {contactEmail && <Text>{contactEmail}</Text>}
          </>
        ) : (
          <Text>{loc.noCoordinator}</Text>
        )}
      </StackedTitleAndDescription>
    </SimpleCardSkeleton>
  )
}
export default Coordinator
