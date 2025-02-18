import {
  Box,
  Button,
  Divider,
  Drawer,
  Text,
  Table as T,
} from '@island.is/island-ui/core'
import { useLoaderData } from 'react-router-dom'
import { SignatureCollectionList } from '@island.is/api/schema'

const { Table, Row, Head, HeadData, Body, Data } = T

const ListManagers = () => {
  const { list, listStatus } = useLoaderData() as {
    list: SignatureCollectionList
    listStatus: string
  }

  return (
    <Box>
      <Drawer
        ariaLabel={''}
        baseId={''}
        disclosure={
          <Box marginLeft={2}>
            <Button variant="utility" icon="person" iconType="outline">
              Aðilar
            </Button>
          </Box>
        }
      >
        <Text variant="h2" color="backgroundBrand" marginY={3}>
          Aðilar
        </Text>
        <Divider />
        <Text marginY={6}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu
          justo interdum, pharetra enim vel, ultrices augue.
        </Text>

        <Text variant="h4" marginBottom={3}>
          Ábyrgðaraðilar
        </Text>
        <Table>
          <Head>
            <Row>
              <HeadData style={{ width: '25%' }}>Kennitala</HeadData>
              <HeadData>Nafn</HeadData>
            </Row>
          </Head>
          <Body>
            <Row>
              <Data>010130-3019</Data>
              <Data>Gervimaður Afríka</Data>
            </Row>
            <Row>
              <Data>010130-2399</Data>
              <Data>Gervimaður Færeyjar</Data>
            </Row>
          </Body>
        </Table>

        <Text variant="h4" marginTop={7} marginBottom={3}>
          Umsjónaraðilar
        </Text>
        <Table>
          <Head>
            <Row>
              <HeadData style={{ width: '25%' }}>Kennitala</HeadData>
              <HeadData>Nafn</HeadData>
            </Row>
          </Head>
          <Body>
            <Row>
              <Data>012345-3799</Data>
              <Data>Nafni Nafnasson</Data>
            </Row>
            <Row>
              <Data>012345-3799</Data>
              <Data>Nafni Nafnasson</Data>
            </Row>
            <Row>
              <Data>012345-3799</Data>
              <Data>Nafni Nafnasson</Data>
            </Row>
          </Body>
        </Table>
      </Drawer>
    </Box>
  )
}

export default ListManagers
