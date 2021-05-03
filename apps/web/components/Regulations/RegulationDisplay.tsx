import * as s from './RegulationDisplay.treat'

import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { ISODate, RegulationMaybeDiff } from './Regulations.types'
import { RegulationPageTexts } from './RegulationTexts.types'
import {
  Button,
  Stack,
  Text,
  ToggleSwitchLink,
  Hidden,
} from '@island.is/island-ui/core'
import { Sticky } from '@island.is/web/components'
import { RegulationLayout } from './RegulationLayout'
import { prettyName, useRegulationLinkResolver } from './regulationUtils'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { RegulationStatus } from './RegulationStatus'
import { Appendixes } from './Appendixes'
import { HTMLDump } from './HTMLDump'
import { CommentsBox } from './CommentsBox'
import { RegulationInfoBox } from './RegulationInfoBox'
import { RegulationEffectsBox } from './RegulationEffectsBox'
import { RegulationChangelog } from './RegulationChangelog'
import { AffectingRegulations } from './AffectingRegulations'
import { RegulationTimeline } from './RegulationTimeline'

const getKey = (regulation: RegulationMaybeDiff): string => {
  const { name, timelineDate, showingDiff } = regulation
  const { from, to } = showingDiff || {}
  return [name, timelineDate, from, to].join()
}

// ---------------------------------------------------------------------------

export type RegulationDisplayProps = {
  regulation: RegulationMaybeDiff
  urlDate?: ISODate
  texts: RegulationPageTexts
}

export const RegulationDisplay = (props: RegulationDisplayProps) => {
  const router = useRouter()
  const { regulation, texts } = props

  const txt = useNamespace(texts)
  const { linkToRegulation, linkResolver } = useRegulationLinkResolver()

  const name = prettyName(regulation.name)

  const diffView = !!regulation.showingDiff

  const timelineDate = regulation.timelineDate || ''
  const effectiveDate = regulation.effectiveDate
  const lastAmendDate = regulation.lastAmendDate || ''

  const isDiffable =
    regulation.history.length > 0 && timelineDate !== effectiveDate

  const isCurrent = !timelineDate || timelineDate === lastAmendDate
  const isUpcoming = !isCurrent && timelineDate > lastAmendDate

  const waterMarkClass = isCurrent
    ? undefined
    : s.oudatedWarning + (isUpcoming ? ' ' + s.upcomingWarning : '')

  const key = getKey(regulation)

  const [showTimeline, setShowTimeline] = useState(false)

  return (
    <RegulationLayout
      name={regulation.name}
      texts={props.texts}
      main={
        <>
          {isDiffable && (
            <ToggleSwitchLink
              className={s.diffToggler}
              checked={diffView}
              href={linkToRegulation(regulation.name, {
                diff: !diffView,
                ...(props.urlDate
                  ? { on: props.urlDate }
                  : timelineDate
                  ? { d: timelineDate }
                  : undefined),
              })}
              linkText={diffView ? txt('hideDiff') : txt('showDiff')}
              label={txt('showDiff')}
            />
          )}
          <RegulationStatus
            regulation={regulation}
            urlDate={props.urlDate}
            texts={texts}
          />
          <AffectingRegulations regulation={regulation} texts={texts} />

          <div className={waterMarkClass}>
            <Text marginTop={[2, 3, 4, 5]} marginBottom={1}>
              <strong>{name}</strong>
            </Text>
            <Text as="h1" variant="h3" marginBottom={[2, 4]}>
              {/* FIXME: Handle diffing of title (see `./Appendixes.tsx` for an example) */}
              {regulation.title}
            </Text>

            <HTMLDump className={s.bodyText} html={regulation.text} />

            <Appendixes
              key={key}
              legend={txt('appendixesTitle')}
              genericTitle={txt('appendixGenericTitle')}
              appendixes={regulation.appendixes}
            />

            <CommentsBox
              title={txt('commentsTitle')}
              content={regulation.comments}
            />
          </div>
        </>
      }
      sidebar={
        <Sticky>
          <Stack space={3}>
            <Hidden print={true}>
              <Button
                preTextIcon="arrowBack"
                preTextIconType="filled"
                size="small"
                type="button"
                variant="text"
                onClick={() => {
                  window.history.length > 2
                    ? router.back()
                    : router.push(linkResolver('regulationshome').href)
                }}
              >
                {txt('goBack')}
              </Button>
            </Hidden>

            <RegulationInfoBox regulation={regulation} texts={texts} />
            <Hidden print={true}>
              <RegulationEffectsBox regulation={regulation} texts={texts} />
            </Hidden>

            <Hidden print={true}>
              {showTimeline ? (
                <RegulationTimeline regulation={regulation} texts={texts} />
              ) : (
                <RegulationChangelog regulation={regulation} texts={texts} />
              )}
              <button
                onClick={() => setShowTimeline(!showTimeline)}
                {...((v) => ({
                  'aria-label': v,
                  title: v,
                }))(showTimeline ? 'Birta tímalínu' : 'Birta breytinga logg')}
                style={{ width: '100%', padding: '1em', cursor: 'pointer' }}
              />
            </Hidden>
          </Stack>
        </Sticky>
      }
    />
  )
}
