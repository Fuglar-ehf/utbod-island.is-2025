import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import syslumenn from '@island.is/web/screens/Organization/Home'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

const Screen = withApollo(withLocale('en')(syslumenn))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
