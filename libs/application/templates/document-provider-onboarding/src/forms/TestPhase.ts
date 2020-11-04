import {
  ApplicationTypes,
  buildForm,
  buildIntroductionField,
  buildMultiField,
  buildSection,
  buildCustomField,
  buildSubmitField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from './messages'

export const TestPhase: Form = buildForm({
  id: ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING,
  name: 'Útfærsla og prófanir.',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'testIntroSection',
      name: m.testIntroSection,
      children: [
        buildCustomField(
          {
            id: 'testPhaseIntro',
            name: 'Upplýsingar um prufuaðgang',
            component: 'TestPhaseInfoScreen',
          },
          {},
        ),
      ],
    }),
    buildSection({
      id: 'testSection',
      name: m.testSection,
      children: [
        buildCustomField(
          {
            id: 'test',
            name: 'Sjálfvirkar prófanir',
            component: 'AutomatedTests',
          },
          {},
        ),
      ],
    }),
    buildSection({
      id: 'testsFinished',
      name: m.testOutroSection,
      children: [
        buildMultiField({
          id: 'testsFinishedMulti',
          name: 'Aðgangur að raun',
          description:
            'Hér getur þú búið til aðgang að raunumhverfi. Athugið að afrita og geyma þessar upplýsingar því þær eru ekki geymdar hér í þessari umsókn.',
          children: [
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              name: 'Senda inn umsókn',

              actions: [
                { event: 'SUBMIT', name: 'Ljúka umsókn', type: 'primary' },
              ],
            }),
          ],
        }),
        buildIntroductionField({
          id: 'finalTestPhase',
          name: 'Takk',
          introduction:
            'Þú hefur nú fengið aðgang að umsjónarkerfi skajalveitenda. Það má finna á þínum síðum á ísland.is',
        }),
      ],
    }),
  ],
})
