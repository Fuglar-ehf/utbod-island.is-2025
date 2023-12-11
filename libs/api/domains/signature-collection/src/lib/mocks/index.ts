import { SignatureCollectionArea } from '../models/area.model'
import { SignatureCollection } from '../models/collection.model'
import { SignatureCollectionOwner } from '../models/owner.model'
import { SignatureCollectionSignature } from '../models/signature.model'
import { SignatureCollectionList } from '../models/signatureList.model'
import { SignatureCollectionSignee } from '../models/signee.model'

const currDate = new Date()

export const Areas: SignatureCollectionArea[] = [
  { id: 'SF', name: 'Sunnlendingafjórðungur', min: 1224, max: 2448 },
  { id: 'VF', name: 'Vestfirðingafjórðungur', min: 59, max: 117 },
  { id: 'NF', name: 'Norðlendingafjórðungur', min: 160, max: 320 },
  { id: 'AF', name: 'Austfirðingafjórðungur', min: 57, max: 115 },
]

export const CurrentCollection: SignatureCollection = {
  id: '12345',
  name: 'Söfnun meðmæla forsetakosning 2024',
  areas: Areas,
  startTime: currDate,
  endTime: new Date(currDate.setMonth(currDate.getMonth() + 2)),
}
const fakeSigners = [
  '0101302399',
  '0101302209',
  '0101302479',
  '0101304339',
  '0101304929',
  '0101302559',
  '0101302719',
  '0101303369',
  '0101302639',
  '0101305069',
  '0101302129',
]

export const signee = (nationalId: string): SignatureCollectionSignee => ({
  id: nationalId,
  nationalId,
  name: `Nafn Nafnsson`,
  areaId: 'SF',
  address: 'Home',
})

const Owners: SignatureCollectionOwner[] = [
  {
    nationalId: '0101307789',
    name: 'Gervimaður útlönd',
    phone: '999-9999',
    email: 'test@test.is',
  },
  {
    nationalId: '0101303019',
    name: 'Gervimaður Afríka',
    phone: '999-9999',
    email: 'test@test.is',
  },
  {
    nationalId: '0101302989',
    name: 'Gervimaður Ameríka',
    phone: '999-9999',
    email: 'test@test.is',
  },
]

export const Lists: SignatureCollectionList[] = Owners.flatMap((owner, i) =>
  Areas.map((area, index) => ({
    id: `${i + 1}${index + 1}`,
    title: `${owner.name} ${area.name}`,
    area,
    endTime: CurrentCollection.endTime,
    startTime: CurrentCollection.startTime,
    owner,
    active: true,
    collectionId: CurrentCollection.id,
    collectors: [
      { name: 'Aðili 1', nationalId: '0101301234' },
      { name: 'Aðili 2', nationalId: '0101301234' },
    ],
    numberOfSignatures: 10,
  })),
)

export const Signatures = (listId: string): SignatureCollectionSignature[] =>
  fakeSigners.map((fake, index) => ({
    id: `${index}0${index}`,
    listId: listId,
    created: currDate,
    modified: currDate,
    signee: signee(fake),
    active: true,
    signatureType: 'User',
  }))
