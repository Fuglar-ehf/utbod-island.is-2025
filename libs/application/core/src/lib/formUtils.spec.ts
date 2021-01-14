import {
  extractRepeaterIndexFromField,
  formatText,
  getFormNodeLeaves,
} from './formUtils'
import {
  Application,
  ApplicationTypes,
  buildCheckboxField,
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildTextField,
  Comparators,
  Form,
  StaticText,
  TextField,
} from '@island.is/application/core'

const ExampleForm: Form = buildForm({
  id: ApplicationTypes.EXAMPLE,
  title: 'Atvinnuleysisbætur',
  children: [
    buildSection({
      id: 'intro',
      title: 'name',
      children: [
        buildDescriptionField({
          id: 'field',
          title: 'name',
          description: 'Þessi umsókn snýr að atvinnuleysisbótum',
        }),
        buildMultiField({
          id: 'about',
          title: 'name',
          children: [
            buildTextField({
              id: 'person.name',
              title: 'name',
            }),
            buildTextField({
              id: 'person.nationalId',
              title: 'name',
            }),
            buildTextField({
              id: 'person.phoneNumber',
              title: 'name',
              condition: {
                questionId: 'person.age',
                isMultiCheck: false,
                comparator: Comparators.GTE,
                value: '18',
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'career',
      title: 'name',
      children: [
        buildRadioField({
          id: 'careerHistory',
          title: 'name',
          options: [
            { value: 'yes', label: 'name' },
            { value: 'no', label: 'name' },
          ],
        }),
        buildCheckboxField({
          id: 'careerHistoryCompanies',
          title: 'name',
          options: [
            { value: 'government', label: 'name' },
            { value: 'aranja', label: 'Aranja' },
            { value: 'advania', label: 'Advania' },
          ],
        }),
        buildTextField({
          id: 'dreamJob',
          title: 'name',
        }),
      ],
    }),
  ],
})

describe('application schema utility functions', () => {
  it('should get all screens in a form', () => {
    const screens = getFormNodeLeaves(ExampleForm)

    expect(screens.length).toBe(5)
    expect(screens[0].id).toBe('field')
    expect(screens[1].id).toBe('about')
    expect(screens[2].id).toBe('careerHistory')
    expect(screens[3].id).toBe('careerHistoryCompanies')
    expect(screens[4].id).toBe('dreamJob')
  })
  it('can get all screens for a given form node', () => {
    const screens = getFormNodeLeaves(ExampleForm.children[0])

    expect(screens.length).toBe(2)
    expect(screens[0].id).toBe('field')
    expect(screens[1].id).toBe('about')

    const otherScreens = getFormNodeLeaves(ExampleForm.children[1])

    expect(otherScreens.length).toBe(3)
    expect(otherScreens[0].id).toBe('careerHistory')
    expect(otherScreens[1].id).toBe('careerHistoryCompanies')
    expect(otherScreens[2].id).toBe('dreamJob')
  })
})

describe('formatText', () => {
  const application: Application = {
    answers: { someAnswer: 'awesome' },
    assignees: [],
    applicant: '',
    attachments: {},
    created: new Date(),
    externalData: {},
    id: '',
    modified: new Date(),
    state: '',
    typeId: ApplicationTypes.EXAMPLE,
  }
  const formatMessage: (descriptor: StaticText, values?: any) => string = (
    descriptor,
  ) => descriptor as string
  it('should return plain text as is', () => {
    expect(formatText('text', application, formatMessage)).toBe('text')
    expect(formatText('blabbb', application, formatMessage)).toBe('blabbb')
  })
  it('should use the passed in application to format dynamic strings', () => {
    expect(
      formatText(
        (a) => `Hello mr. ${a.answers.someAnswer}`,
        application,
        formatMessage,
      ),
    ).toBe('Hello mr. awesome')

    expect(
      formatText(
        (a) => `Oh you are ${a.answers.someAnswer} too!`,
        application,
        formatMessage,
      ),
    ).toBe('Oh you are awesome too!')
  })
})

describe('extractRepeaterIndexFromField', () => {
  it('should return the valid repeater index from a field inside a repeater', () => {
    const field = {
      ...buildTextField({ id: 'periods[123].id', title: '' }),
      isPartOfRepeater: true,
    } as TextField
    expect(extractRepeaterIndexFromField(field)).toBe(123)
  })
  it('should return the first valid repeater index from a field inside a repeater', () => {
    const field = {
      ...buildTextField({ id: 'periods[123].id[456].asIso[789]', title: '' }),
      isPartOfRepeater: true,
    } as TextField
    expect(extractRepeaterIndexFromField(field)).toBe(123)
  })
  it('should return -1 if the field is not inside a repeater', () => {
    const field = {
      ...buildTextField({ id: 'periods[123].id', title: '' }),
      isPartOfRepeater: false,
    } as TextField
    expect(extractRepeaterIndexFromField(field)).toBe(-1)
  })
  it('should return -1 if the field has invalid index', () => {
    const field = {
      ...buildTextField({ id: 'periods[1a1].id', title: '' }),
      isPartOfRepeater: true,
    } as TextField
    expect(extractRepeaterIndexFromField(field)).toBe(-1)
  })
})
