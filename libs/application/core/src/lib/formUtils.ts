/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const merge = require('deepmerge')

import { FormValue } from '../types/Application'
import {
  Form,
  FormNode,
  FormLeaf,
  FormItemTypes,
  Section,
  SubSection,
} from '../types/Form'

export function getValueViaPath(
  obj: {},
  path: string,
  defaultValue: unknown = undefined,
): unknown | undefined {
  try {
    const travel = (regexp: RegExp) =>
      String.prototype.split
        .call(path, regexp)
        .filter(Boolean)
        .reduce(
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          (res, key) => (res !== null && res !== undefined ? res[key] : res),
          obj,
        )
    const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/)
    return result === undefined || result === obj ? defaultValue : result
  } catch (e) {
    return undefined
  }
}

export function findNode(
  id: string,
  type: FormItemTypes,
  formNode: FormNode,
): FormNode | undefined {
  if (id === formNode.id && type === formNode.type) {
    return formNode
  }
  const { children } = formNode
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const foundNode = findNode(id, type, children[i])
      if (foundNode) {
        return foundNode
      }
    }
  }
  return undefined
}
export const isValidScreen = (node: FormNode): boolean => {
  switch (node.type) {
    case FormItemTypes.FORM: {
      return false
    }
    case FormItemTypes.SECTION: {
      return false
    }

    case FormItemTypes.SUB_SECTION: {
      return false
    }
    default: {
      return true
    }
  }
}

export const getFormNodeLeaves = (node: FormNode): FormLeaf[] => {
  const { children } = node
  if (isValidScreen(node)) {
    return [node as FormLeaf]
  }

  let leaves: FormLeaf[] = []
  let newLeaves: FormLeaf[] = []
  if (children) {
    for (let i = 0; i < children.length; i++) {
      newLeaves = getFormNodeLeaves(children[i])
      if (newLeaves.length) {
        leaves = [...leaves, ...newLeaves]
      }
    }
  }
  return leaves
}

export function getSectionsInForm(form: Form): Section[] {
  const sections: Section[] = []
  form.children.forEach((child) => {
    if (child.type === FormItemTypes.SECTION) {
      sections.push(child as Section)
    }
  })
  return sections
}
export function getSubSectionsInSection(section: Section): SubSection[] {
  const subSections: SubSection[] = []
  section.children.forEach((child) => {
    if (child.type === FormItemTypes.SUB_SECTION) {
      subSections.push(child as SubSection)
    }
  })
  return subSections
}

export function findSectionIndexForScreen(
  form: Form,
  screen: FormLeaf,
): number {
  const sections = getSectionsInForm(form)
  if (!sections.length) {
    return -1
  }
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    const screensInSection = getFormNodeLeaves(section)
    if (screensInSection.find(({ id }) => id === screen.id) !== undefined) {
      return i
    }
  }
  return -1
}

export function findSubSectionIndexForScreen(
  section: Section,
  screen: FormLeaf,
): number {
  const subSections = getSubSectionsInSection(section)
  if (!subSections.length) {
    return -1
  }
  for (let i = 0; i < subSections.length; i++) {
    const subSection = subSections[i]
    const screensInSection = getFormNodeLeaves(subSection)
    if (screensInSection.find(({ id }) => id === screen.id) !== undefined) {
      return i
    }
  }
  return -1
}
const overwriteMerge = (
  destinationArray: unknown[],
  sourceArray: unknown[],
) => {
  if (typeof sourceArray[sourceArray.length - 1] !== 'object') {
    return sourceArray
  }
  const result = []
  for (
    let i = 0;
    i < Math.max(destinationArray.length, sourceArray.length);
    i++
  ) {
    result[i] = merge(sourceArray[i] ?? {}, destinationArray[i] ?? {}, {
      arrayMerge: overwriteMerge,
    })
  }

  return result
}

export function mergeAnswers(
  currentAnswers: object,
  newAnswers: object,
): FormValue {
  return merge(currentAnswers, newAnswers, {
    arrayMerge: overwriteMerge,
  })
}
