import axios from 'axios'

import {
  IForm,
  IFormApplicantType,
  IFormBuilder,
  IGroup,
  IInput,
  IInputSettings,
  ILanguage,
  IStep,
  ItemType,
} from '../types/interfaces'
import { groupSchema, stepSchema } from './zodValidation'

const BASEURL = 'https://profun.island.is/umsoknarkerfi/api'

export async function getForm(id: unknown): Promise<IFormBuilder> {
  try {
    const response = await axios.get(`${BASEURL}/Forms/${id}`)
    // const validatedFormData: IFormBuilder = formFormBuilderSchema.parse(response.data)
    // return validatedFormData
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function updateForm(
  form: IForm,
  steps: IStep[],
  groups: IGroup[],
  inputs: IInput[],
) {
  const updatedForm: IForm = {
    ...form,
    stepsList: steps.map((s, i) => {
      return {
        ...s,
        displayOrder: i,
      }
    }),
    groupsList: groups.map((g, i) => {
      return {
        ...g,
        displayOrder: i,
      }
    }),
    inputsList: inputs.map((i, index) => {
      return {
        ...i,
        displayOrder: index,
      }
    }),
  }

  try {
    const response = await axios.put(
      `${BASEURL}/Forms/${form.id}`,
      updatedForm,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    return response
  } catch (error) {
    console.error('Error in updateNavbar:', error)
    throw error
  }
}

export async function updateItem(type: string, data: IStep | IGroup | IInput) {
  const url = `${BASEURL}/${type}s/${data.id}`

  try {
    const response = await axios.put(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return response
  } catch (error) {
    console.error('Error in updateItem: ', error)
    throw error
  }
}

export async function getNewForm(organisationId: number): Promise<IForm> {
  try {
    const response = await axios.post(`${BASEURL}/Forms/${organisationId}`)
    return response.data
  } catch (error) {
    console.error('Error in getNewForm: ', error)
    throw error
  }
}

export async function getAllFormsFromOrganisation(
  organisationId: number,
): Promise<IFormBuilder> {
  try {
    const response = await axios.get(
      `${BASEURL}/Forms/Organization/${organisationId}`,
    )
    return response.data
  } catch (error) {
    console.error('Error in getAllFormsFromOrganisation: ', error)
    throw error
  }
}

export async function addStep(
  formId: number,
  name: ILanguage,
  displayOrder: number,
  stepType: number,
  waitingText: ILanguage,
  callRuleset: boolean,
): Promise<IStep> {
  try {
    const response = await axios.post(`${BASEURL}/Steps`, {
      formId,
      name,
      displayOrder,
      stepType,
      waitingText,
      callRuleset,
    })

    const validatedStep: IStep = stepSchema.parse(response.data)
    return validatedStep
  } catch (error) {
    console.error('Error in addStep: ', error)
    throw error
  }
}

export async function addGroup(
  displayOrder: number,
  parentId: number,
): Promise<IGroup> {
  try {
    const response = await axios.post(`${BASEURL}/Groups`, {
      displayOrder: displayOrder,
      stepId: parentId,
    })

    const validatedGroup: IGroup = groupSchema.parse(response.data)

    return validatedGroup
  } catch (error) {
    console.error('Error in addGroup: ', error)
    throw error
  }
}

export async function addInput(
  displayOrder: number,
  parentId: number,
): Promise<IInput | null> {
  const requestBody = {
    displayOrder: displayOrder,
    groupId: parentId,
  }

  try {
    const response = await axios.post(`${BASEURL}/Inputs`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = response.data

    return data
  } catch (error) {
    console.error('Error in addInput: ', error)
    throw error
  }
}

export async function deleteItem(type: ItemType, id: number) {
  try {
    const response = await axios.delete(`${BASEURL}/${type}s/${id}`)
    return response
  } catch (error) {
    console.error('Error in deleteItem: ', error)
    throw error
  }
}

export async function saveFormSettings(id: number, settings: IInputSettings) {
  try {
    const response = await axios.put(
      `${BASEURL}/Forms/${id}/Settings`,
      settings,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    return response
  } catch (error) {
    console.error('Error in saveFormSettings: ', error)
    throw error
  }
}

export async function saveApplicantTypes(
  id: number,
  types: IFormApplicantType[],
) {
  const requestData = {
    id: id,
    formApplicantTypes: types,
  }
  try {
    const response = await axios.put(
      `${BASEURL}/Forms/${id}/Settings`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    return response
  } catch (error) {
    console.error('Error in saveApplicantTypes: ', error)
    throw error
  }
}
export async function getList(type: string) {
  try {
    const response = await axios.get(`${BASEURL}/Services/${type}`)
    return response.data
  } catch (error) {
    console.error('Error in getList: ', error)
    throw error
  }
}
