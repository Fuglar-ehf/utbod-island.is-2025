import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildExternalDataProvider,
  buildKeyValueField,
  buildSubmitField,
  buildCheckboxField,
  buildCustomField,
  buildSelectField,
  buildDividerField,
  buildRadioField,
  Form,
  FormModes,
  DefaultEvents,
  StaticText,
  buildSubSection,
  getValueViaPath,
  buildDataProviderItem,
  FormValue,
} from '@island.is/application/core'
import { NationalRegistryUser, UserProfile } from '../types/schema'
import { m } from '../lib/messages'
import { Juristiction } from '../types/schema'
import { format as formatKennitala } from 'kennitala'
import { QualityPhotoData } from '../utils'
import { StudentAssessment } from '@island.is/api/schema'
import { NO, YES } from '../lib/constants'

// const ALLOW_FAKE_DATA = todo: serverside feature flag
const ALLOW_FAKE_DATA = false

const allowFakeCondition = (result = YES) => (answers: FormValue) =>
  getValueViaPath(answers, 'fakeData.useFakeData') === result

const needsHealthCertificateCondition = (result = YES) => (
  answers: FormValue,
) => {
  return Object.values(answers?.healthDeclaration || {}).includes(result)
}

export const application: Form = buildForm({
  id: 'DrivingLicenseApplicationDraftForm',
  title: m.applicationName,
  mode: FormModes.APPLYING,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: m.externalDataSection,
      children: [
        ...(ALLOW_FAKE_DATA
          ? [
              buildSubSection({
                id: 'fakeData',
                title: 'Gervigögn',
                children: [
                  buildMultiField({
                    id: 'shouldFake',
                    title: 'Gervigögn',
                    children: [
                      buildDescriptionField({
                        id: 'gervigognDesc',
                        title: 'Viltu nota gervigögn?',
                        titleVariant: 'h5',
                        // Note: text is rendered by a markdown component.. and when
                        // it sees the indented spaces it seems to assume this is code
                        // and so it will wrap the text in a <code> block when the double
                        // spaces are not removed.
                        description: `
                          Ath. gervigögn eru eingöngu notuð í stað þess að sækja
                          forsendugögn í staging umhverfi (dev x-road) hjá RLS, auk þess
                          sem hægt er að senda inn umsóknina í "þykjó" - þeas. allt hagar sér
                          eins nema að RLS tekur ekki við umsókninni.

                          Öll önnur gögn eru ekki gervigögn og er þetta eingöngu gert
                          til að hægt sé að prófa ferlið án þess að vera með tilheyrandi
                          ökuréttindi í staging grunni RLS.
                        `.replace(/\s{2}/g, ''),
                      }),
                      buildRadioField({
                        id: 'fakeData.useFakeData',
                        title: '',
                        width: 'half',
                        options: [
                          {
                            value: YES,
                            label: 'Já',
                          },
                          {
                            value: NO,
                            label: 'Nei',
                          },
                        ],
                      }),
                      buildRadioField({
                        id: 'fakeData.currentLicense',
                        title: 'Réttindi umsækjanda',
                        width: 'half',
                        condition: allowFakeCondition(YES),
                        options: [
                          {
                            value: 'student',
                            label: 'Nemi',
                          },
                          {
                            value: 'temp',
                            label: 'Bráðabyrgða',
                          },
                        ],
                      }),
                      buildRadioField({
                        id: 'fakeData.qualityPhoto',
                        title: 'Gervimynd eða enga mynd?',
                        width: 'half',
                        condition: allowFakeCondition(YES),
                        options: [
                          {
                            value: 'yes',
                            label: 'Mynd',
                          },
                          {
                            value: 'no',
                            label: 'Engin mynd',
                          },
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ]
          : []),
        buildExternalDataProvider({
          title: m.externalDataTitle,
          id: 'approveExternalData',
          subTitle: m.externalDataSubTitle,
          checkboxLabel: m.externalDataAgreement,
          dataProviders: [
            buildDataProviderItem({
              id: 'nationalRegistry',
              type: 'NationalRegistryProvider',
              title: m.nationalRegistryTitle,
              subTitle: m.nationalRegistrySubTitle,
            }),
            buildDataProviderItem({
              id: 'userProfile',
              type: 'UserProfileProvider',
              title: m.userProfileInformationTitle,
              subTitle: m.userProfileInformationSubTitle,
            }),
            buildDataProviderItem({
              id: 'qualityPhoto',
              type: 'QualityPhotoProvider',
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              id: 'eligibility',
              type: 'EligibilityProvider',
              title: m.infoFromLicenseRegistry,
              subTitle: m.confirmationStatusOfEligability,
            }),
            buildDataProviderItem({
              id: 'studentAssessment',
              type: 'DrivingAssessmentProvider',
              title: '',
            }),
            buildDataProviderItem({
              id: 'juristictions',
              type: 'JuristictionProvider',
              title: '',
            }),
            buildDataProviderItem({
              id: 'payment',
              type: 'PaymentCatalogProvider',
              title: '',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'requirements',
      title: m.applicationEligibilityTitle,
      children: [
        buildMultiField({
          id: 'info',
          title: m.eligibilityRequirementTitle,
          children: [
            buildCustomField({
              title: m.eligibilityRequirementTitle,
              component: 'EligibilitySummary',
              id: 'eligsummary',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'photoStep',
      title: m.applicationQualityPhotoTitle,
      children: [
        buildMultiField({
          id: 'info',
          title: m.qualityPhotoTitle,
          condition: (_, externalData) => {
            return (
              (externalData.qualityPhoto as QualityPhotoData)?.data?.success ===
              true
            )
          },
          children: [
            buildCustomField({
              title: m.eligibilityRequirementTitle,
              component: 'QualityPhoto',
              id: 'qphoto',
            }),
            buildRadioField({
              id: 'willBringQualityPhoto',
              title: '',
              disabled: false,
              options: [
                { value: NO, label: m.qualityPhotoNoAcknowledgement },
                { value: YES, label: m.qualityPhotoAcknowledgement },
              ],
            }),
            buildCustomField({
              id: 'photdesc',
              title: '',
              component: 'Bullets',
              condition: (answers) => {
                try {
                  return answers.willBringQualityPhoto === YES
                } catch (error) {
                  return false
                }
              },
            }),
          ],
        }),
        buildMultiField({
          id: 'info',
          title: m.qualityPhotoTitle,
          condition: (_, externalData) => {
            return (
              (externalData.qualityPhoto as QualityPhotoData)?.data?.success ===
              false
            )
          },
          children: [
            buildCustomField({
              title: m.eligibilityRequirementTitle,
              component: 'QualityPhoto',
              id: 'qphoto',
            }),
            buildCustomField({
              id: 'photodescription',
              title: '',
              component: 'Bullets',
            }),
            buildCheckboxField({
              id: 'willBringQualityPhoto',
              title: '',
              options: [
                {
                  value: YES,
                  label: m.qualityPhotoAcknowledgement,
                },
              ],
            }),
          ],
        }),
      ],
    }),

    buildSection({
      id: 'user',
      title: m.informationSectionTitle,
      children: [
        buildMultiField({
          id: 'info',
          title: m.pickupLocationTitle,
          children: [
            buildKeyValueField({
              label: m.informationApplicant,
              value: ({ externalData: { nationalRegistry } }) =>
                (nationalRegistry.data as NationalRegistryUser).fullName,
            }),
            buildDividerField({
              title: '',
              color: 'dark400',
            }),
            buildDescriptionField({
              id: 'afhending',
              title: 'Afhending',
              titleVariant: 'h4',
              description: m.chooseDistrictCommisioner,
            }),
            buildSelectField({
              id: 'juristiction',
              title: 'Afhending',
              disabled: false,
              options: ({
                externalData: {
                  juristictions: { data },
                },
              }) => {
                return (data as Juristiction[]).map(({ id, name, zip }) => ({
                  value: id,
                  label: name,
                  tooltip: `Póstnúmer ${zip}`,
                }))
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'healthDeclaration',
      title: m.healthDeclarationSectionTitle,
      children: [
        buildMultiField({
          id: 'overview',
          title: m.healthDeclarationMultiFieldTitle,
          space: 1,
          children: [
            buildCustomField(
              {
                id: 'healthDeclaration.usesContactGlasses',
                title: '',
                component: 'HealthDeclaration',
              },
              {
                title: m.healthDeclarationMultiFieldSubTitle,
                label: m.healthDeclaration1,
              },
            ),
            buildCustomField(
              {
                id: 'healthDeclaration.hasReducedPeripheralVision',
                title: '',
                component: 'HealthDeclaration',
              },
              {
                label: m.healthDeclaration2,
              },
            ),
            buildCustomField(
              {
                id: 'healthDeclaration.hasEpilepsy',
                title: '',
                component: 'HealthDeclaration',
              },
              {
                label: m.healthDeclaration3,
              },
            ),
            buildCustomField(
              {
                id: 'healthDeclaration.hasHeartDisease',
                title: '',
                component: 'HealthDeclaration',
              },
              {
                label: m.healthDeclaration4,
              },
            ),
            buildCustomField(
              {
                id: 'healthDeclaration.hasMentalIllness',
                title: '',
                component: 'HealthDeclaration',
              },
              {
                label: m.healthDeclaration5,
              },
            ),
            buildCustomField(
              {
                id: 'healthDeclaration.usesMedicalDrugs',
                title: '',
                component: 'HealthDeclaration',
              },
              {
                label: m.healthDeclaration6,
              },
            ),
            buildCustomField(
              {
                id: 'healthDeclaration.isAlcoholic',
                title: '',
                component: 'HealthDeclaration',
              },
              {
                label: m.healthDeclaration7,
              },
            ),
            buildCustomField(
              {
                id: 'healthDeclaration.hasDiabetes',
                title: '',
                component: 'HealthDeclaration',
              },
              {
                label: m.healthDeclaration8,
              },
            ),
            buildCustomField(
              {
                id: 'healthDeclaration.isDisabled',
                title: '',
                component: 'HealthDeclaration',
              },
              {
                label: m.healthDeclaration9,
              },
            ),
            buildCustomField(
              {
                id: 'healthDeclaration.hasOtherDiseases',
                title: '',
                component: 'HealthDeclaration',
              },
              {
                label: m.healthDeclaration10,
              },
            ),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'overview',
      title: m.overviewSectionTitle,
      children: [
        buildMultiField({
          id: 'overview',
          title: m.overviewMultiFieldTitle,
          space: 1,
          description: m.overviewMultiFieldDescription,
          children: [
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: m.orderDrivingLicense,
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.PAYMENT,
                  name: m.continue,
                  type: 'primary',
                },
              ],
            }),
            buildKeyValueField({
              label: m.overviewSubType,
              value: ({ answers: { subType } }) => subType as string[],
            }),
            buildDividerField({}),
            buildKeyValueField({
              label: m.overviewName,
              width: 'half',
              value: ({ externalData: { nationalRegistry } }) =>
                (nationalRegistry.data as NationalRegistryUser).fullName,
            }),
            buildKeyValueField({
              label: m.overviewPhoneNumber,
              width: 'half',
              value: ({ externalData: { userProfile } }) =>
                (userProfile.data as UserProfile).mobilePhoneNumber as string,
            }),
            buildKeyValueField({
              label: m.overviewStreetAddress,
              width: 'half',
              value: ({ externalData: { nationalRegistry } }) =>
                (nationalRegistry.data as NationalRegistryUser).address
                  ?.streetAddress,
            }),
            buildKeyValueField({
              label: m.overviewNationalId,
              width: 'half',
              value: ({ externalData: { nationalRegistry } }) =>
                formatKennitala(
                  (nationalRegistry.data as NationalRegistryUser).nationalId,
                ),
            }),
            buildKeyValueField({
              label: m.overviewPostalCode,
              width: 'half',
              value: ({ externalData: { nationalRegistry } }) =>
                (nationalRegistry.data as NationalRegistryUser).address
                  ?.postalCode,
            }),
            buildKeyValueField({
              label: m.overviewEmail,
              width: 'half',
              value: ({ externalData: { userProfile } }) =>
                (userProfile.data as UserProfile).email as string,
            }),
            buildKeyValueField({
              label: m.overviewCity,
              width: 'half',
              value: ({ externalData: { nationalRegistry } }) =>
                (nationalRegistry.data as NationalRegistryUser).address?.city,
            }),
            buildDividerField({}),
            buildKeyValueField({
              label: m.overviewTeacher,
              width: 'half',
              value: ({ externalData: { studentAssessment } }) =>
                (studentAssessment.data as StudentAssessment).teacherName,
            }),
            buildDividerField({
              condition: (answers) => {
                return Object.values(answers?.healthDeclaration || []).includes(
                  YES,
                )
              },
            }),
            buildDescriptionField({
              id: 'bringalong',
              title: m.overviewBringAlongTitle,
              titleVariant: 'h4',
              description: '',
              condition: needsHealthCertificateCondition(YES),
            }),
            buildCheckboxField({
              id: 'certificate',
              title: '',
              defaultValue: [],
              options: [
                {
                  value: YES,
                  label: m.overviewBringCertificateData,
                },
              ],
              condition: (answers) => {
                try {
                  return Object.values(answers?.healthDeclaration).includes(YES)
                } catch (error) {
                  return false
                }
              },
            }),
            buildDividerField({}),
            buildKeyValueField({
              label: m.overviewPaymentCharge,
              value: ({ externalData }) => {
                const str = Object.values(externalData.payment.data as object)
                // more refactoring
                return (parseInt(str[1], 10) + ' kr.') as StaticText
              },
              width: 'full',
            }),
          ],
        }),
      ],
    }),
  ],
})
