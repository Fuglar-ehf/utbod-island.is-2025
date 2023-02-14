import * as React from 'react'
import { Box } from '../Box/Box'
import { Button, ButtonSizes, ButtonTypes } from '../Button/Button'
import { Tag, TagVariant } from '../Tag/Tag'
import { Text } from '../Text/Text'
import { Tooltip } from '../Tooltip/Tooltip'
import { Inline } from '../Inline/Inline'
import { DraftProgressMeterVariant } from '../DraftProgressMeter/DraftProgressMeter'
import * as styles from './ActionCard.css'
import { Hidden } from '../Hidden/Hidden'
import { Icon as IconType } from '../IconRC/iconMap'
import { Icon } from '../IconRC/Icon'
import DialogPrompt from '../DialogPrompt/DialogPrompt'
import { DraftProgressMeter } from '../DraftProgressMeter/DraftProgressMeter'

type ActionCardProps = {
  date?: string
  heading?: string
  headingVariant?: 'h3' | 'h4'
  text?: string
  eyebrow?: string
  logo?: string
  backgroundColor?: 'white' | 'blue' | 'red'
  tag?: {
    label: string
    variant?: TagVariant
    outlined?: boolean
  }
  cta: {
    label: string
    variant?: ButtonTypes['variant']
    size?: ButtonSizes
    icon?: IconType
    onClick?: () => void
    disabled?: boolean
  }
  secondaryCta?: {
    label: string
    visible?: boolean
    size?: ButtonSizes
    icon?: IconType
    onClick?: () => void
    disabled?: boolean
  }
  progressMeter?: {
    active?: boolean
    variant?: DraftProgressMeterVariant
    draftTotalSteps?: number
    draftFinishedSteps?: number
  }
  unavailable?: {
    active?: boolean
    label?: string
    message?: string
  }
  avatar?: boolean
  deleteButton?: {
    visible?: boolean
    onClick?: () => void
    disabled?: boolean
    icon?: IconType
    dialogTitle?: string
    dialogDescription?: string
    dialogConfirmLabel?: string
    dialogCancelLabel?: string
  }
  status?: string
}

const defaultCta = {
  variant: 'primary',
  icon: 'arrowForward',
  onClick: () => null,
} as const
const defaultTag = {
  variant: 'blue',
  outlined: true,
  label: '',
} as const

const defaultProgressMeter = {
  variant: 'blue',
  active: false,
} as const

const defaultUnavailable = {
  active: false,
  label: '',
  message: '',
} as const

const defaultDelete = {
  visible: false,
  onClick: () => null,
  disabled: true,
  icon: 'trash',
  dialogTitle: '',
  dialogDescription: '',
  dialogConfirmLabel: '',
  dialogCancelLabel: '',
} as const

export const ActionCard: React.FC<ActionCardProps> = ({
  date,
  heading,
  headingVariant = 'h3',
  text,
  eyebrow,
  backgroundColor = 'white',
  cta: _cta,
  secondaryCta,
  tag: _tag,
  unavailable: _unavailable,
  progressMeter: _progressMeter,
  deleteButton: _delete,
  avatar,
  logo,
  status,
}) => {
  const cta = { ...defaultCta, ..._cta }
  const progressMeter = { ...defaultProgressMeter, ..._progressMeter }
  const tag = { ...defaultTag, ..._tag }
  const unavailable = { ...defaultUnavailable, ..._unavailable }
  const deleteButton = { ...defaultDelete, ..._delete }
  const alignWithDate = date ? 'flexEnd' : 'center'
  const bgr =
    backgroundColor === 'white'
      ? 'white'
      : backgroundColor === 'red'
      ? 'red100'
      : 'blue100'

  const renderAvatar = () => {
    if (!avatar) {
      return null
    }

    return heading ? (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexShrink={0}
        marginRight={[2, 3]}
        borderRadius="circle"
        background="blue100"
        className={styles.avatar}
      >
        <Text variant="h3" as="p" color="blue400">
          {getTitleAbbreviation(heading)}
        </Text>
      </Box>
    ) : null
  }

  const renderDisabled = () => {
    const { label, message } = unavailable

    return (
      <Box display="flex">
        <Text variant="small">{label}&nbsp;</Text>
        <Tooltip placement="top" as="button" text={message} />
      </Box>
    )
  }

  const renderEyebrow = () => {
    if (!eyebrow) {
      return null
    }

    return (
      <Box
        alignItems="center"
        display="flex"
        flexDirection="row"
        justifyContent={eyebrow ? 'spaceBetween' : 'flexEnd'}
        marginBottom={[0, 1]}
      >
        <Text variant="eyebrow" color="purple400">
          {eyebrow}
        </Text>

        {renderTag()}
        {renderDelete()}
      </Box>
    )
  }
  const renderDate = () => {
    if (!date) {
      return null
    }

    return (
      <Box
        alignItems="center"
        display="flex"
        flexDirection="row"
        justifyContent={date ? 'spaceBetween' : 'flexEnd'}
        marginBottom={[0, 2]}
      >
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
        >
          <Box display="flex" marginRight={1} justifyContent="center">
            <Icon icon="time" size="medium" type="outline" color="blue400" />
          </Box>
          <Box display="flex" justifyContent="center">
            <Text variant="small">{date}</Text>
          </Box>
        </Box>
        <Inline alignY="center" space={1}>
          {!eyebrow && renderTag()}
          {!eyebrow && renderDelete()}
        </Inline>
      </Box>
    )
  }

  const renderTag = () => {
    if (!tag.label) {
      return null
    }

    return (
      <Tag outlined={tag.outlined} variant={tag.variant} disabled>
        {tag.label}
      </Tag>
    )
  }

  const renderDelete = () => {
    if (!deleteButton.visible) {
      return null
    }

    return (
      <DialogPrompt
        baseId="delete_dialog"
        title={deleteButton.dialogTitle}
        description={deleteButton.dialogDescription}
        ariaLabel="delete"
        img={
          <img
            src={`assets/images/settings.svg`}
            alt={'globe'}
            style={{ float: 'right' }}
            width="80%"
          />
        }
        disclosureElement={
          <Tag outlined={tag.outlined} variant={tag.variant}>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Icon icon={deleteButton.icon} size="small" type="outline" />
            </Box>
          </Tag>
        }
        onConfirm={deleteButton.onClick}
        buttonTextConfirm={deleteButton.dialogConfirmLabel}
        buttonTextCancel={deleteButton.dialogCancelLabel}
      />
    )
  }

  const renderDefault = () => {
    const hasCTA = cta.label && !progressMeter.active
    const hasSecondaryCTA =
      hasCTA &&
      secondaryCta?.label &&
      !progressMeter.active &&
      secondaryCta?.visible

    return (
      !!hasCTA && (
        <Box
          paddingTop={tag.label ? 'gutter' : 0}
          display="flex"
          justifyContent={['flexStart', 'flexEnd']}
          alignItems="center"
          flexDirection="row"
        >
          {hasSecondaryCTA && (
            <Box paddingRight={4} paddingLeft={2}>
              <Button
                variant="text"
                size={secondaryCta?.size}
                onClick={secondaryCta?.onClick}
                icon={secondaryCta?.icon}
                disabled={secondaryCta?.disabled}
              >
                {secondaryCta?.label}
              </Button>
            </Box>
          )}
          <Box marginLeft={[0, 3]}>
            <Button
              variant={cta.variant}
              size="small"
              onClick={cta.onClick}
              disabled={cta.disabled}
              icon={cta.icon}
            >
              {cta.label}
            </Button>
          </Box>
        </Box>
      )
    )
  }

  const renderDraftProgressMeter = () => {
    const { variant, draftFinishedSteps, draftTotalSteps } = progressMeter
    return (
      <Box flexGrow={1} className={styles.draftProgressMeter}>
        <DraftProgressMeter
          variant={variant}
          draftTotalSteps={draftTotalSteps ?? 1}
          draftFinishedSteps={draftFinishedSteps ?? 1}
        />
      </Box>
    )
  }

  const renderProgressMeterButton = () => {
    return (
      <Box marginLeft={[0, 0, 'auto']} paddingTop={[2, 2, 0]}>
        <Button
          variant={cta.variant}
          onClick={cta.onClick}
          icon={cta.icon}
          size={cta.size}
        >
          {cta.label}
        </Button>
      </Box>
    )
  }

  const renderLogo = () => {
    if (!logo || logo.length === 0) return null
    return (
      <Box
        padding={2}
        marginRight={2}
        className={styles.logo}
        style={{ backgroundImage: `url(${logo})` }}
      ></Box>
    )
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      borderColor={
        backgroundColor === 'red'
          ? 'red200'
          : backgroundColor === 'blue'
          ? 'blue100'
          : 'blue200'
      }
      borderRadius="large"
      borderWidth="standard"
      paddingX={[3, 3, 4]}
      paddingY={3}
      background={bgr}
    >
      {renderEyebrow()}

      {renderDate()}
      <Box
        alignItems={['flexStart', 'center']}
        display="flex"
        flexDirection={['column', 'row']}
      >
        {renderAvatar()}
        <Box flexDirection="row" width="full">
          {heading && (
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="spaceBetween"
              alignItems={['flexStart', 'flexStart', 'flexEnd']}
            >
              <Box display="flex" flexDirection="row" alignItems="center">
                {renderLogo()}
                <Text
                  variant={headingVariant}
                  color={
                    backgroundColor === 'blue' ? 'blue600' : 'currentColor'
                  }
                >
                  {heading}
                </Text>
              </Box>
              <Hidden above="xs">
                <Box>{!date && !eyebrow && renderTag()}</Box>
              </Hidden>
            </Box>
          )}

          {text && <Text paddingTop={heading ? 1 : 0}>{text}</Text>}
        </Box>

        <Box
          display="flex"
          alignItems={['flexStart', 'flexEnd']}
          flexDirection="column"
          flexShrink={0}
          marginTop={[1, 0]}
          marginLeft={[0, 'auto']}
          className={progressMeter.active && tag ? styles.tag : styles.button}
        >
          <Hidden below="sm">{!date && !eyebrow && renderTag()}</Hidden>
          {unavailable.active ? renderDisabled() : renderDefault()}
        </Box>
      </Box>

      <Box
        width="full"
        paddingTop={[2, 2, 2, 3]}
        display="flex"
        flexGrow={1}
        flexShrink={0}
        alignItems={['stretch', 'stretch', alignWithDate]}
        flexDirection={['column', 'column', 'row']}
      >
        {status === 'draft' && renderDraftProgressMeter()}
        {renderProgressMeterButton()}
      </Box>
    </Box>
  )
}

const getTitleAbbreviation = (title: string) => {
  const words = title.split(' ')
  let initials = words[0].substring(0, 1).toUpperCase()

  if (words.length > 1)
    initials += words[words.length - 1].substring(0, 1).toUpperCase()

  return initials
}
