import {
  Page,
  Text,
  Document,
  Image,
  View,
  Font,
  StyleSheet,
} from '@react-pdf/renderer'
import { formatDate } from '../../../../lib/utils'
import {
  Endorsement,
  EndorsementList,
  PaginatedEndorsementResponse,
} from '@island.is/api/schema'
import { dark200 } from '@island.is/island-ui/theme'

const MyPdfDocument = (data: {
  petition?: EndorsementList
  petitionSigners: PaginatedEndorsementResponse
}) => {
  const { petition, petitionSigners } = data
  return (
    <Document>
      <Page style={pdfStyles.body}>
        {/* Header */}
        <Image
          src={'./assets/images/thjodskra.png'}
          style={pdfStyles.image}
          fixed
        />

        {/* Body */}
        <View style={pdfStyles.listInfo}>
          <Text style={pdfStyles.title}>Upplýsingar um undirskriftalista</Text>
          <Text style={pdfStyles.header}>Heiti undirskriftalista</Text>
          <Text>{petition?.title}</Text>
          <Text style={pdfStyles.header}>Um undirskriftalista</Text>
          <Text>{petition?.description}</Text>
          <View style={pdfStyles.row}>
            <View style={pdfStyles.widthHalf}>
              <Text style={pdfStyles.header}>Opinn til: </Text>
              <Text>{formatDate(petition?.closedDate)}</Text>
            </View>
            <View style={pdfStyles.widthHalf}>
              <Text style={pdfStyles.header}>Fjöldi undirskrifta: </Text>
              <Text>{petitionSigners?.totalCount}</Text>
            </View>
          </View>
          <View style={pdfStyles.row}>
            <View style={pdfStyles.widthHalf}>
              <Text style={pdfStyles.header}>Ábyrgðarmaður: </Text>
              <Text>{petition?.ownerName}</Text>
            </View>
            <View style={pdfStyles.widthHalf}>
              <Text style={pdfStyles.header}>Kennitala ábyrgðarmannsins: </Text>
              {/*todo: */}
              <Text>{''}</Text>
            </View>
          </View>
        </View>
        <View style={pdfStyles.tableView}>
          <View style={pdfStyles.tableRow}>
            <Text style={pdfStyles.tableHeaderDate}>Dags. skráð</Text>
            <Text style={pdfStyles.tableHeader}>Nafn</Text>
            <Text style={pdfStyles.tableHeader}>Sveitarfélag</Text>
          </View>
          <View>
            {petitionSigners?.data?.map((sign: Endorsement) => {
              return (
                <View key={sign.id} style={pdfStyles.tableRow}>
                  <Text style={{ width: '20%' }}>
                    {formatDate(sign.created)}
                  </Text>
                  <Text style={{ width: '30%' }}>
                    {sign.meta.fullName ? sign.meta.fullName : ''}
                  </Text>
                  <Text style={{ width: '30%' }}>
                    {sign.meta.locality ? sign.meta.locality : ''}
                  </Text>
                </View>
              )
            })}
          </View>
        </View>

        {/* Footer */}
        <Image
          src={'./assets/images/island.png'}
          style={pdfStyles.footerImage}
          fixed
        />
      </Page>
    </Document>
  )
}

export const pdfStyles = StyleSheet.create({
  body: {
    paddingVertical: 50,
    paddingHorizontal: 60,
    fontFamily: 'IBM Plex Sans',
    fontSize: 10,
  },
  title: {
    fontSize: 24,
  },
  header: {
    fontSize: 14,
    fontWeight: 600,
    marginTop: 20,
    marginBottom: 5,
  },
  tableHeaderDate: {
    fontWeight: 600,
    marginBottom: 5,
    width: '20%',
  },
  tableHeader: {
    fontWeight: 600,
    marginBottom: 5,
    width: '30%',
  },
  row: {
    flexDirection: 'row',
  },
  widthHalf: {
    width: '50%',
  },
  listInfo: {
    paddingBottom: 30,
  },
  tableView: {
    paddingTop: 35,
    borderTop: `1px solid ${dark200}`,
  },
  tableRow: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  image: {
    width: 120,
    marginBottom: 30,
  },
  footerImage: {
    position: 'absolute',
    left: 60,
    bottom: 50,
    width: 120,
  },
})

Font.register({
  family: 'IBM Plex Sans',
  fonts: [
    {
      src: './assets/fonts/ibm-plex-sans-v7-latin-regular.ttf',
    },
    {
      src: './assets/fonts/ibm-plex-sans-v7-latin-600.ttf',
      fontWeight: 600,
    },
  ],
})

export default MyPdfDocument
