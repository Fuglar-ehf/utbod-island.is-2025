import {
  buildForm,
  buildSection,
  buildSubmitField,
  buildCustomField,
  buildExternalDataProvider,
  buildDataProviderItem,
  Form,
  FormModes,
  buildRadioField,
  buildMultiField,
  DefaultEvents,
  ExternalData,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import { EndorsementListTags, constituencyMapper } from '../constants'
import Logo from '../assets/Logo'
import { PartyLetterRegistryPartyLetter } from '../dataProviders/partyLetterRegistry'

const hasPartyLetter = (externalData: ExternalData) => {
  const partyLetter = externalData.partyLetterRegistry
    ?.data as PartyLetterRegistryPartyLetter

  return !!partyLetter?.partyLetter
}

export const ConstituencyForm: Form = buildForm({
  id: 'Constitunecy',
  title: m.constituencySection.title,
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'constituencySection',
      title: m.constituencySection.title,
      children: [
        buildRadioField({
          id: 'constituency',
          title: m.constituencySection.selectConstituency,
          width: 'half',
          largeButtons: true,
          defaultValue: '',
          options: [
            {
              value: 'partyApplicationReykjavikurkjordaemiSudur2021' as EndorsementListTags,
              label:
                constituencyMapper[
                  'partyApplicationReykjavikurkjordaemiSudur2021' as EndorsementListTags
                ].region_name,
            },
            {
              value: 'partyApplicationReykjavikurkjordaemiNordur2021' as EndorsementListTags,
              label:
                constituencyMapper[
                  'partyApplicationReykjavikurkjordaemiNordur2021' as EndorsementListTags
                ].region_name,
            },
            {
              value: 'partyApplicationSudvesturkjordaemi2021' as EndorsementListTags,
              label:
                constituencyMapper[
                  'partyApplicationSudvesturkjordaemi2021' as EndorsementListTags
                ].region_name,
            },
            {
              value: 'partyApplicationNordvesturkjordaemi2021' as EndorsementListTags,
              label:
                constituencyMapper[
                  'partyApplicationNordvesturkjordaemi2021' as EndorsementListTags
                ].region_name,
            },
            {
              value: 'partyApplicationNordausturkjordaemi2021' as EndorsementListTags,
              label:
                constituencyMapper[
                  'partyApplicationNordausturkjordaemi2021' as EndorsementListTags
                ].region_name,
            },
            {
              value: 'partyApplicationSudurkjordaemi2021' as EndorsementListTags,
              label:
                constituencyMapper[
                  'partyApplicationSudurkjordaemi2021' as EndorsementListTags
                ].region_name,
            },
          ],
        }),
      ],
    }),
    buildSection({
      id: 'disclaimerSection',
      title: m.disclaimerSection.title,
      children: [
        buildExternalDataProvider({
          title: m.disclaimerSection.title,
          id: 'approveDisclaimer',
          subTitle: m.disclaimerSection.subtitle,
          description: m.disclaimerSection.descriptionPt1,
          checkboxLabel: m.disclaimerSection.checkboxLabel,
          dataProviders: [
            buildDataProviderItem({
              id: 'disclaimer',
              type: undefined,
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              id: 'nationalRegistry',
              type: 'NationalRegistryProvider',
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              id: 'partyLetterRegistry',
              type: 'PartyLetterRegistryProvider',
              title: '',
              subTitle: '',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'partyLetterFailed',
      title: '',
      condition: (_, externalData) => {
        return !hasPartyLetter(externalData)
      },
      children: [
        buildMultiField({
          id: 'partyLetterFailed',
          title: '',
          children: [
            buildCustomField({
              id: 'intro',
              title: '',
              component: 'PartyLetterFailed',
            }),
            buildSubmitField({
              id: 'submit',
              title: '',
              placement: 'footer',
              actions: [],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'overviewSection',
      title: m.constituencySection.confirmationTitle,
      condition: (_, externalData) => {
        return hasPartyLetter(externalData)
      },
      children: [
        buildMultiField({
          id: 'overviewSubmit',
          title: m.constituencySection.confirmation,
          description: m.constituencySection.confirmationDescription,
          children: [
            buildCustomField({
              id: 'review',
              title: '',
              component: 'ReviewConstituency',
            }),
            buildSubmitField({
              id: 'submit',
              title: '',
              placement: 'footer',

              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.overviewSection.submitButton,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        buildCustomField({
          id: 'collectEndorsements',
          title: m.endorsementList.title,
          component: 'EndorsementList',
        }),
      ],
    }),
  ],
})
