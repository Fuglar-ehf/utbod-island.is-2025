import { GetServerSideProps } from 'next'

import {
  Box,
  Button,
  Stack,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'
import {
  Query,
  QueryGetPaymentFlowArgs,
  QueryGetOrganizationArgs,
} from '@island.is/api/schema'

import { PageCard } from '../../components/PageCard/PageCard'
import gql from 'graphql-tag'
import initApollo from '../../graphql/client'

interface PaymentPageProps {
  locale: string
  paymentFlowId: string
  paymentFlow: Query['getPaymentFlow']
  organization: Query['getOrganization']
}

const GetPaymentFlow = gql`
  query getPaymentFlow($input: GetPaymentFlowInput!) {
    getPaymentFlow(input: $input) {
      id
      productId
      invoiceId
      availablePaymentMethods
      onSuccessUrl
      onUpdateUrl
      onErrorUrl
      organisationId
      metadata
    }
  }
`

const GetOrganization = gql`
  query getOrganization($input: GetOrganizationInput!) {
    getOrganization(input: $input) {
      id
      title
      shortTitle
      logo {
        url
        title
      }
    }
  }
`

export const getServerSideProps: GetServerSideProps<PaymentPageProps> = async (
  context,
) => {
  const { locale, paymentFlowId } = context.params as {
    locale: string
    paymentFlowId: string
  }

  const client = initApollo()

  const {
    data: { getPaymentFlow },
  } = await client.query<Query, QueryGetPaymentFlowArgs>({
    query: GetPaymentFlow,
    variables: {
      input: {
        id: paymentFlowId,
      },
    },
  })

  const {
    data: { getOrganization },
  } = await client.query<Query, QueryGetOrganizationArgs>({
    query: GetOrganization,
    variables: {
      input: {
        slug: getPaymentFlow.organisationId,
      },
    },
  })

  return {
    props: {
      locale,
      paymentFlowId,
      paymentFlow: getPaymentFlow,
      organization: getOrganization,
    },
  }
}

export default function TestPage(props: PaymentPageProps) {
  console.log(props)
  return (
    <PageCard
      label={props.organization?.title}
      imageSrc={props.organization?.logo?.url}
      imageAlt={props.organization?.logo?.title}
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <Text variant="h1">{props.paymentFlow.productId} (id)</Text>
        <p>(todo fetch product info)</p>
      </Box>

      <Stack space={1}>
        <RadioButton id="yes" checked label="Kort" />
        <RadioButton id="yes" label="Krafa" />
      </Stack>
      <Button>Halda áfram</Button>
      <p>
        {props.locale} | {props.paymentFlowId}
      </p>
    </PageCard>
  )
  //   return <p>Test page (page router)</p>
}
