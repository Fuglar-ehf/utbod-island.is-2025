import { useContext, useState } from 'react'
import ControlContext from '../../../../../../../context/ControlContext'
import {
  GridColumn as Column,
  GridRow as Row,
  Select,
  Stack,
  Box,
  Button,
  RadioButton,
} from '@island.is/island-ui/core'
import { FormSystemInput } from '@island.is/api/schema'

const predeterminedLists = [
  {
    label: 'Sveitarfélög',
    value: 'Sveitarfelog',
  },
  {
    label: 'Lönd',
    value: 'Lond',
  },
  {
    label: 'Póstnúmer',
    value: 'Postnumer',
  },
  {
    label: 'Iðngreinarmeistara',
    value: 'Idngreinarmeistara',
  },
]

// Need to fix the radio buttons
const ListSettings = () => {
  const { control, setInListBuilder } = useContext(ControlContext)
  const { activeItem } = control
  const currentItem = activeItem.data as FormSystemInput
  const [radio, setRadio] = useState([true, false, false])

  const radioHandler = (index: number) => {
    if (!radio[index])
      setRadio((prev) =>
        prev.map((_, i) => {
          return index === i
        }),
      )
  }

  return (
    <Stack space={2}>
      {currentItem.type === 'Fellilisti' && (
        <>
          <Row>
            <Column>
              <Box onClick={() => radioHandler(0)}>
                <RadioButton
                  label="Nýr fellilisti"
                  onChange={(e) => {
                    console.log()
                  }}
                  checked={radio[0]}
                />
              </Box>
            </Column>
          </Row>
          <Row>
            <Column>
              <RadioButton
                label="Tilbúnir fellilistar"
                onChange={(e) => {
                  console.log()
                }}
                checked={radio[1]}
              />
            </Column>
          </Row>
        </>
      )}
      {radio[0] && (
        <Button variant="ghost" onClick={() => setInListBuilder(true)}>
          Listasmiður
        </Button>
      )}
      {radio[1] && (
        <Column span="5/10">
          <Select
            placeholder="Veldu lista tegund"
            name="predeterminedLists"
            label="Tilbúnir fellilistar"
            options={predeterminedLists}
            backgroundColor="blue"
            // TODO: add lists
          />
        </Column>
      )}
    </Stack>
  )
}

export default ListSettings
