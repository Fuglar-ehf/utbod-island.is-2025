import React, { useState } from 'react'
import { useNamespace } from '../../hooks'
import {
  Box,
  Inline,
  Text,
  Divider,
  Link,
  Button,
  Select,
  GridRow,
  GridColumn,
  Option,
} from '@island.is/island-ui/core'
import {
  Service,
  ServiceDetail,
  GetNamespaceQuery,
} from '@island.is/web/graphql/schema'
import TagList from './TagList'
import XroadValue from './XroadValue'
import ServiceInfoLink from './ServiceInfoLink'
import ServiceTag from './ServiceTag'

export interface ServiceInformationProps {
  service: Service
  strings: GetNamespaceQuery['getNamespace']
  onSelectChange?: (value: ServiceDetail) => void
}

export const ServiceInformation = ({
  service,
  strings,
  onSelectChange,
}: ServiceInformationProps) => {
  const n = useNamespace(strings)

  // TODO When environment is chosen set the version options, default is set to newest version.
  const enviromentOptions: Array<Option> = service.environments.map((x) => {
    return {
      label: n(x.environment),
      value: x.environment,
    }
  })
  const [selectedEnviromentOption, _1] = useState<Option>(enviromentOptions[0])

  const [versionOptions, _2] = useState<Option[]>(
    service.environments[0].details.map((x) => {
      return {
        label: x.version,
        value: x.version,
      }
    }),
  )

  const [selectedVersionOption, setSelectedVersionOption] = useState<Option>(
    versionOptions[0],
  )

  const [serviceDetail, setServiceDetail] = useState<ServiceDetail>(
    service.environments[0].details[0],
  )

  const onSelectVersion = (versionOption: Option) => {
    const tempServiceDetail = service.environments
      .find((e) => e.environment === selectedEnviromentOption.value)
      .details.find((e) => e.version === versionOption.value)

    setServiceDetail(tempServiceDetail)
    setSelectedVersionOption(versionOption)
    onSelectChange(tempServiceDetail)
  }

  return (
    <Box>
      <Box marginTop={1} marginBottom={3}>
        <Box marginBottom={2} display="flex" alignItems="flexStart">
          <Inline space={1}>
            <Text variant="h1">{service.title}</Text>
            {service.pricing.length > 0 && (
              <Box height="full" display="flex" alignItems="center">
                <ServiceTag
                  category="pricing"
                  item={service.pricing[0]}
                  namespace={strings}
                />
              </Box>
            )}
          </Inline>
        </Box>
        {service.summary && (
          <Text variant="intro" paddingBottom={2}>
            {service.summary}
          </Text>
        )}
        {service.description && <Text> {service.description}</Text>}
      </Box>

      <Box paddingBottom={3}>
        <Divider />
      </Box>

      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '12/12', '5/12']}>
          <Select
            backgroundColor="blue"
            size="sm"
            label={n('version')}
            name="version"
            isSearchable={false}
            defaultValue={selectedVersionOption}
            options={versionOptions}
            onChange={onSelectVersion}
          />
        </GridColumn>
        <GridColumn
          span={['12/12', '12/12', '12/12', '12/12', '5/12']}
          offset={['0', '0', '0', '0', '2/12']}
        >
          <Box
            marginTop={[2, 2, 2, 2, 0]}
            display="flex"
            alignItems="center"
            height="full"
            justifyContent={[
              'flexStart',
              'flexStart',
              'flexStart',
              'flexStart',
              'flexEnd',
            ]}
          >
            <Link href={serviceDetail.links.bugReport}>
              <Button
                disabled={!serviceDetail.links.bugReport}
                colorScheme="light"
                iconType="filled"
                size="small"
                type="button"
                variant="utility"
                fluid
              >
                {n('linkBugReport')}
              </Button>
            </Link>
            <Box marginLeft={[3, 3, 3, 3, 2]}>
              <Link href={serviceDetail.links.featureRequest}>
                <Button
                  disabled={!serviceDetail.links.featureRequest}
                  colorScheme="light"
                  iconType="filled"
                  size="small"
                  type="button"
                  variant="utility"
                >
                  {n('linkFeatureRequest')}
                </Button>
              </Link>
            </Box>
          </Box>
        </GridColumn>
      </GridRow>

      <Box
        background="blue100"
        paddingY={3}
        marginY={3}
        borderRadius="large"
        display="flex"
        flexDirection="column"
      >
        {/* Xroad values */}
        {serviceDetail.xroadIdentifier && (
          <Box paddingX={3} marginBottom={2}>
            <Inline space={1}>
              <Text color="blue600">{`${n('ServiceOwner')}:`}</Text>
              <Text color="blue600" fontWeight="semiBold">
                {service.owner}
              </Text>
              <Text color="blue200">|</Text>
              <Text color="blue600">
                {`${n('XroadIdentifierSubsystemCode')}:`}
              </Text>
              <Text color="blue600" fontWeight="semiBold">
                {serviceDetail.xroadIdentifier.subsystemCode}
              </Text>
            </Inline>
            <Box marginTop={1} display="flex">
              <Inline space={1}>
                {/* IdentifierInstance */}
                <XroadValue
                  value={serviceDetail.xroadIdentifier.instance}
                  label={`${n('XroadIdentifierInstance')}:`}
                  showDivider
                />
                {/* memberCode */}
                <XroadValue
                  label={`${n('XroadIdentifierMemberCode')}:`}
                  value={serviceDetail.xroadIdentifier.memberCode}
                  showDivider
                />
                {/* memberClass */}
                <XroadValue
                  label={`${n('XroadIdentifierMemberClass')}:`}
                  value={serviceDetail.xroadIdentifier.memberClass}
                  showDivider
                />
                {/* serviceCode */}
                <XroadValue
                  label={`${n('XroadIdentifierServiceCode')}:`}
                  value={serviceDetail.xroadIdentifier.serviceCode}
                  showDivider={false}
                />
              </Inline>
            </Box>
          </Box>
        )}
        <Box paddingBottom={3}>
          <Divider />
        </Box>
        <TagList
          data={serviceDetail.data}
          type={serviceDetail.type}
          access={service.access}
          namespace={strings}
        />
      </Box>
      <Inline space={3}>
        {serviceDetail.links.documentation && (
          <ServiceInfoLink
            href={serviceDetail.links.documentation}
            link={n('linkDocumentation')}
          />
        )}
        {serviceDetail.links.responsibleParty && (
          <ServiceInfoLink
            href={serviceDetail.links.responsibleParty}
            link={n('linkResponsible')}
          />
        )}
      </Inline>
    </Box>
  )
}
