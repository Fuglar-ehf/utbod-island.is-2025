import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { useLoaderData } from 'react-router-dom'
import { SignatureCollectionList } from '@island.is/api/schema'
import { signatureCollectionNavigation } from '../../lib/navigation'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { GridColumn, GridContainer, GridRow } from '@island.is/island-ui/core'
import header from '../../../assets/headerImage.svg'
import Signees from './components/signees'
import ActionExtendDeadline from './components/extendDeadline'
import ActionReviewComplete from './components/completeReview'
import PaperUpload from './components/paperUpload'
import ListReviewedAlert from './components/listReviewedAlert'

export const List = () => {
  const { list } = useLoaderData() as { list: SignatureCollectionList }
  const { formatMessage } = useLocale()

  return (
    <GridContainer>
      <GridRow direction="row">
        <GridColumn
          span={['12/12', '5/12', '5/12', '3/12']}
          offset={['0', '7/12', '7/12', '0']}
        >
          <PortalNavigation
            navigation={signatureCollectionNavigation}
            title={formatMessage(m.signatureListsTitle)}
          />
        </GridColumn>
        <GridColumn
          paddingTop={[5, 5, 5, 2]}
          offset={['0', '0', '0', '1/12']}
          span={['12/12', '12/12', '12/12', '8/12']}
        >
          {!!list && (
            <>
              <IntroHeader
                title={list.title}
                intro={formatMessage(m.singleListIntro)}
                img={header}
                imgPosition="right"
                imgHiddenBelow="sm"
              />
              <ListReviewedAlert />
              <ActionExtendDeadline listId={list.id} endTime={list.endTime} />
              <Signees numberOfSignatures={list.numberOfSignatures ?? 0} />
              <PaperUpload listId={list.id} />
              <ActionReviewComplete />
            </>
          )}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default List
