import '@island.is/api/mocks'

import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import subPage from '@island.is/web/screens/Organization/SubPage'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

const Screen = withApollo(withLocale('is')(subPage))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
