import { Box, Text, Button } from '@island.is/island-ui/core'

import * as styles from './Signatures.css'
import { advert } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import {
  CommitteeSignatureState,
  InputFields,
  OJOIFieldBaseProps,
} from '../../lib/types'
import cloneDeep from 'lodash/cloneDeep'
import {
  DatePickerController,
  InputController,
} from '@island.is/shared/form-fields'
import { MEMBER_INDEX } from '../../lib/constants'
import { getErrorViaPath } from '@island.is/application/core'

type ChairmanKey = keyof CommitteeSignatureState['chairman']
type MemberKey = keyof Required<CommitteeSignatureState>['members'][0]

type Props = Pick<OJOIFieldBaseProps, 'errors'> & {
  state: CommitteeSignatureState
  setState: (state: CommitteeSignatureState) => void
  addSignature?: boolean
}

const emptyMember = {
  name: '',
  textBelow: '',
}

export const CommitteeSignature = ({ state, setState, errors }: Props) => {
  const { formatMessage: f } = useLocale()

  const onCommitteeChairmanChange = (key: ChairmanKey, value: string) => {
    const newState = cloneDeep(state)
    newState.chairman[key] = value
    setState(newState)
  }

  const onCommitteMemberChange = (
    index: number,
    key: MemberKey,
    value: string,
  ) => {
    const newState = cloneDeep(state)
    if (!newState.members) return
    newState.members[index][key] = value
    setState(newState)
  }

  const onCommitteeChange = (
    key: keyof Omit<CommitteeSignatureState, 'members' | 'chairman'>,
    value: string,
  ) => {
    const newState = cloneDeep(state)
    newState[key] = value
    setState(newState)
  }

  const onAddCommitteeMember = () => {
    const newState = cloneDeep(state)
    if (!newState.members) return
    newState.members.push(cloneDeep(emptyMember))
    setState(newState)
  }

  const onRemoveCommitteeMember = (index: number) => {
    const newState = cloneDeep(state)
    if (!newState.members) return
    newState.members.splice(index, 1)
    setState(newState)
  }

  return (
    <Box>
      <Box
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        rowGap={2}
        columnGap={2}
        marginBottom={2}
      >
        <InputController
          required={true}
          id={InputFields.signature.committee.institution}
          name={InputFields.signature.committee.institution}
          label={f(advert.inputs.signature.institution.label)}
          error={
            errors &&
            getErrorViaPath(errors, InputFields.signature.committee.institution)
          }
          defaultValue={state.institution}
          backgroundColor="blue"
          onChange={(e) => onCommitteeChange('institution', e.target.value)}
          size="sm"
        />
        <DatePickerController
          id={InputFields.signature.committee.date}
          name={InputFields.signature.committee.date}
          label={f(advert.inputs.signature.date.label)}
          placeholder={f(advert.inputs.signature.date.placeholder)}
          backgroundColor="blue"
          size="sm"
          defaultValue={state.date}
          onChange={(date) => onCommitteeChange('date', date)}
        />
      </Box>
      <Box className={styles.wrapper}>
        <Text variant="h5" marginBottom={2}>
          {f(advert.general.chairman)}
        </Text>
        <Box className={styles.inputGroup}>
          <Box className={styles.inputWrapper}>
            <InputController
              id={InputFields.signature.committee.chairman.textAbove}
              name={InputFields.signature.committee.chairman.textAbove}
              label={f(advert.inputs.signature.textAbove.label)}
              defaultValue={state.chairman.textAbove}
              backgroundColor="blue"
              size="sm"
              onChange={(e) =>
                onCommitteeChairmanChange('textAbove', e.target.value)
              }
            />
            <InputController
              required={true}
              id={InputFields.signature.committee.chairman.name}
              name={InputFields.signature.committee.chairman.name}
              error={
                errors &&
                getErrorViaPath(
                  errors,
                  InputFields.signature.committee.chairman.name,
                )
              }
              label={f(advert.inputs.signature.name.label)}
              defaultValue={state.chairman.name}
              backgroundColor="blue"
              size="sm"
              onChange={(e) =>
                onCommitteeChairmanChange('name', e.target.value)
              }
            />
          </Box>
          <Box className={styles.inputWrapper}>
            <InputController
              id={InputFields.signature.committee.chairman.textAfter}
              name={InputFields.signature.committee.chairman.textAfter}
              label={f(advert.inputs.signature.textAfter.label)}
              defaultValue={state.chairman.textAfter}
              backgroundColor="blue"
              size="sm"
              onChange={(e) =>
                onCommitteeChairmanChange('textAfter', e.target.value)
              }
            />
            <InputController
              id={InputFields.signature.committee.chairman.textBelow}
              name={InputFields.signature.committee.chairman.textBelow}
              label={f(advert.inputs.signature.textBelow.label)}
              defaultValue={state.chairman.textBelow}
              backgroundColor="blue"
              size="sm"
              onChange={(e) =>
                onCommitteeChairmanChange('textBelow', e.target.value)
              }
            />
          </Box>
        </Box>
      </Box>
      <Box className={styles.wrapper} marginTop={2}>
        <Text variant="h5" marginBottom={2}>
          {f(advert.general.committeeMembers)}
        </Text>
        {state.members?.map((member, index) => {
          const localName =
            InputFields.signature.committee.members.name.replace(
              MEMBER_INDEX,
              `${index}`,
            )
          return (
            <Box key={index} className={styles.inputGroup}>
              <Box className={styles.inputWrapper}>
                <InputController
                  id={localName}
                  name={localName}
                  error={errors && getErrorViaPath(errors, localName)}
                  label={f(advert.inputs.signature.name.label)}
                  defaultValue={member.name}
                  backgroundColor="blue"
                  size="sm"
                  required={true}
                  onChange={(e) =>
                    onCommitteMemberChange(index, 'name', e.target.value)
                  }
                />
                <InputController
                  id={InputFields.signature.committee.members.textBelow.replace(
                    MEMBER_INDEX,
                    `${index}`,
                  )}
                  name={InputFields.signature.committee.members.textBelow.replace(
                    MEMBER_INDEX,
                    `${index}`,
                  )}
                  label={f(advert.inputs.signature.textBelow.label)}
                  defaultValue={member.textBelow}
                  backgroundColor="blue"
                  size="sm"
                  onChange={(e) =>
                    onCommitteMemberChange(index, 'textBelow', e.target.value)
                  }
                />
                {index > 1 && (
                  <Box className={styles.removeInputGroup}>
                    <Button
                      variant="utility"
                      icon="trash"
                      onClick={() => onRemoveCommitteeMember(index)}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          )
        })}
        <Box marginTop={2}>
          <Button onClick={onAddCommitteeMember} variant="utility" icon="add">
            {f(advert.buttons.addCommitteeMember.label)}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
