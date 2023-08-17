import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import OperatingLicenses from '@island.is/web/screens/Organization/Syslumenn/OperatingLicenses'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

const Screen = withApollo(withLocale('is')(OperatingLicenses))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
