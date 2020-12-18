import {
  convertFormToScreens,
  findCurrentScreen,
  getNavigableSectionsInForm,
} from './reducerUtils'
import {
  buildForm,
  buildIntroductionField,
  buildMultiField,
  buildRepeater,
  buildSection,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { FormScreen, MultiFieldScreen, RepeaterScreen } from '../types'

describe('reducerUtils', () => {
  describe('find current screen', () => {
    const buildIntroScreen = (
      id: string,
      isNavigable = true,
      sectionIndex = -1,
      subSectionIndex = -1,
    ) => ({
      ...buildIntroductionField({
        id,
        name: 'Introduction',
        introduction: 'welcome',
      }),
      isNavigable,
      sectionIndex,
      subSectionIndex,
    })
    const buildTextScreen = (
      id: string,
      isNavigable = true,
      sectionIndex = -1,
      subSectionIndex = -1,
    ) => ({
      ...buildTextField({
        id: id,
        name: 'What is the family name?',
      }),
      isNavigable,
      sectionIndex,
      subSectionIndex,
    })
    const screens: FormScreen[] = [
      buildIntroScreen('intro'),
      buildTextScreen('a'),
      buildTextScreen('b'),
      buildTextScreen('c'),
    ]
    it('should default to the first screen if there are no answers', () => {
      expect(findCurrentScreen(screens, {})).toBe(0)
    })
    it('should default to the first screen if the answers dont really match the list of screens', () => {
      expect(findCurrentScreen(screens, { random: 'asdf', notThis: '4' })).toBe(
        0,
      )
    })
    it('should go to the screen where the last answer belongs to the screen before', () => {
      expect(findCurrentScreen(screens, { a: 'answer' })).toBe(2)
      expect(findCurrentScreen(screens, { b: 'answer' })).toBe(3)
    })
    it('should go to the last screen if the last question has an answer', () => {
      expect(findCurrentScreen(screens, { a: 'answer', c: 'answer' })).toBe(3)
    })
    it('should, if the last answer is in a partially answered multifield, go to that screen', () => {
      const screens: FormScreen[] = [
        buildIntroScreen('intro'),
        buildMultiField({
          id: 'multifield',
          children: [buildTextScreen('a'), buildTextScreen('b')],
          name: 'This is a great screen',
        }) as MultiFieldScreen,
        buildTextScreen('c'),
      ]
      expect(findCurrentScreen(screens, { a: 'sick' })).toBe(1)
      expect(findCurrentScreen(screens, { b: 'very sick' })).toBe(1)
    })
    it('should, if the last answer is in a fully answered multifield, go to the next screen after', () => {
      const screens: FormScreen[] = [
        buildIntroScreen('intro'),
        buildMultiField({
          id: 'multifield',
          children: [buildTextScreen('a'), buildTextScreen('b')],
          name: 'This is a great screen',
        }) as MultiFieldScreen,
        buildTextScreen('c'),
      ]
      expect(findCurrentScreen(screens, { a: 'sick', b: 'very sick' })).toBe(2)
    })
    it('should, if the last answer is a fully built repeater, go to the repeater screen', () => {
      const screens: FormScreen[] = [
        buildIntroScreen('intro'),
        buildTextScreen('first'),
        buildRepeater({
          id: 'person',
          children: [buildTextScreen('a'), buildTextScreen('b')],
          name: 'This is a great screen',
          component: 'SomeComponent',
        }) as RepeaterScreen,
        buildTextScreen('c'),
      ]
      expect(findCurrentScreen(screens, { person: [{ a: '1', b: '2' }] })).toBe(
        2,
      )
      expect(findCurrentScreen(screens, { person: [] })).toBe(2)
      expect(findCurrentScreen(screens, { first: 'asdf' })).toBe(2)
    })
  })
  describe('get navigable sections in form', () => {
    const firstSection = buildSection({
      id: '1',
      name: 'first',
      children: [],
    })
    const secondSection = buildSection({
      id: '2',
      name: 'second',
      children: [],
    })
    const thirdSection = buildSection({
      id: '3',
      name: 'third',
      children: [],
    })
    it('should return all sections if no section has a condition', () => {
      const sections = [firstSection, secondSection, thirdSection]
      const form = buildForm({
        id: 'ExampleForm',
        children: sections,
        name: 'asdf',
      })

      expect(getNavigableSectionsInForm(form, {}, {})).toEqual(sections)
    })
    it('should only return sections that have non-violated conditions', () => {
      const sections = [
        firstSection,
        buildSection({
          id: '2',
          name: 'second',
          children: [],
          condition: () => false,
        }),
        thirdSection,
      ]
      const form = buildForm({
        id: 'ExampleForm',
        children: sections,
        name: 'asdf',
      })

      expect(getNavigableSectionsInForm(form, {}, {})).toEqual([
        firstSection,
        thirdSection,
      ])
    })
    it('should only return non-condition-violating sub-sections of sections', () => {
      const subSection = buildSubSection({
        id: 'sub1',
        name: 'sub1',
        children: [],
        condition: () => false,
      })
      const subSection2 = buildSubSection({
        id: 'sub2',
        name: 'sub2',
        children: [],
        condition: () => true,
      })
      const subSection3 = buildSubSection({
        id: 'sub3',
        name: 'sub3',
        children: [],
      })

      const sections = [
        firstSection,
        secondSection,
        buildSection({
          id: 'withSubsections',
          name: 'sick',
          children: [subSection, subSection2, subSection3],
        }),
      ]
      const form = buildForm({
        id: 'ExampleForm',
        children: sections,
        name: 'asdf',
      })

      expect(getNavigableSectionsInForm(form, {}, {})).toEqual([
        firstSection,
        secondSection,
        buildSection({
          id: 'withSubsections',
          name: 'sick',
          children: [subSection2, subSection3],
        }),
      ])
    })
  })
  describe('convert form to screens', () => {
    describe('conditions', () => {
      it('should hide all fields that belong to a section that violates condition', () => {
        const invisibleSection = buildSection({
          id: '1',
          name: 'where am i',
          condition: () => false,
          children: [
            buildTextField({ id: '1', name: '1' }),
            buildTextField({ id: '2', name: '2' }),
          ],
        })
        const visibleSection = buildSection({
          id: '2',
          name: 'visible',
          condition: () => true,
          children: [
            buildTextField({ id: '3', name: '3' }),
            buildTextField({ id: '4', name: '4' }),
            buildTextField({ id: '5', name: '5' }),
          ],
        })
        const form = buildForm({
          id: 'ExampleForm',
          name: 'asdf',
          children: [invisibleSection, visibleSection],
        })
        const screens = convertFormToScreens(form, {}, {})
        expect(screens.length).toBe(5)
        expect(screens[0].isNavigable).toBe(false)
        expect(screens[0].id).toBe('1')
        expect(screens[1].isNavigable).toBe(false)
        expect(screens[1].id).toBe('2')
        expect(screens[2].isNavigable).toBe(true)
        expect(screens[2].id).toBe('3')
        expect(screens[3].isNavigable).toBe(true)
        expect(screens[3].id).toBe('4')
        expect(screens[4].isNavigable).toBe(true)
        expect(screens[4].id).toBe('5')
      })
    })
    describe('multifield', () => {
      it('should convert multifield to a single screen', () => {
        const multifield = buildMultiField({
          id: 'multi',
          name: 'multi',
          children: [
            buildTextField({ id: '1', name: '1' }),
            buildTextField({ id: '2', name: '2' }),
            buildTextField({ id: '3', name: '3' }),
            buildTextField({ id: '4', name: '4' }),
            buildTextField({ id: '5', name: '5' }),
          ],
        })
        const form = buildForm({
          id: 'ExampleForm',
          name: 'asdf',
          children: [multifield],
        })
        const screens = convertFormToScreens(form, {}, {})
        expect(screens.length).toBe(1)
        expect(screens[0].id).toBe('multi')
      })
    })
    describe('repeaters', () => {
      const children = [
        buildTextField({ id: '1', name: '1' }),
        buildTextField({ id: '2', name: '2' }),
      ]
      const repeater = {
        ...buildRepeater({
          id: 'id',
          name: 'repeater',
          component: 'asdf',
          children,
        }),
      }
      it('should only include the repeater screen if it has not been expanded', () => {
        const form = buildForm({
          id: 'ExampleForm',
          name: 'asdf',
          children: [repeater],
        })
        const screens = convertFormToScreens(form, {}, {})
        expect(screens.length).toBe(1)
        expect(screens[0]).toEqual({
          ...repeater,
          sectionIndex: -1,
          subSectionIndex: -1,
          isNavigable: true,
        })
      })
    })
    describe('sections and subsections', () => {
      it('should attach the index of the section and possibly subsections which own the screens', () => {
        const invisibleSection = buildSection({
          id: '1',
          name: 'where am i',
          condition: () => false,
          children: [
            buildTextField({ id: '1', name: '1' }),
            buildSubSection({
              id: 'sub1',
              name: 'sub1',
              children: [buildTextField({ id: '2', name: '2' })],
            }),
          ],
        })
        const visibleSection = buildSection({
          id: '2',
          name: 'visible',
          condition: () => true,
          children: [
            buildSubSection({
              id: 'sub2',
              name: 'sub2',
              children: [
                buildTextField({ id: '3', name: '3' }),
                buildTextField({ id: '4', name: '4' }),
              ],
            }),
            buildSubSection({
              id: 'sub3',
              name: 'sub3',
              children: [buildTextField({ id: '5', name: '5' })],
            }),
          ],
        })
        const form = buildForm({
          id: 'ExampleForm',
          name: 'asdf',
          children: [
            invisibleSection,
            visibleSection,
            buildTextField({
              id: 'noSection',
              name: 'Part of no section nor parent',
            }),
          ],
        })
        const screens = convertFormToScreens(form, {}, {})
        expect(screens.length).toBe(6)
        expect(screens[0].sectionIndex).toBe(0)
        expect(screens[0].subSectionIndex).toBe(-1)
        expect(screens[0].id).toBe('1')
        expect(screens[1].sectionIndex).toBe(0)
        expect(screens[1].subSectionIndex).toBe(0)
        expect(screens[1].id).toBe('2')
        expect(screens[2].sectionIndex).toBe(1)
        expect(screens[2].subSectionIndex).toBe(0)
        expect(screens[2].id).toBe('3')
        expect(screens[3].sectionIndex).toBe(1)
        expect(screens[3].subSectionIndex).toBe(0)
        expect(screens[3].id).toBe('4')
        expect(screens[4].sectionIndex).toBe(1)
        expect(screens[4].subSectionIndex).toBe(1)
        expect(screens[4].id).toBe('5')
        expect(screens[5].sectionIndex).toBe(1) // a orphaned field will inherit the last section before
        expect(screens[5].subSectionIndex).toBe(-1)
        expect(screens[5].id).toBe('noSection')
      })
    })
  })
})
