import { Schema } from '../types/Form'
import { Answer, FormValue } from '../types/Application'
import { RecordObject } from '../types/Fields'
import { ZodSuberror } from 'zod/lib/src/ZodError'
import isNumber from 'lodash/isNumber'
import has from 'lodash/has'
import set from 'lodash/set'
import merge from 'lodash/merge'
import { AnswerValidationError } from './AnswerValidator'

function populateError(
  currentError: RecordObject = {},
  newError: ZodSuberror[],
  pathToError?: string,
) {
  let errorObject = {}
  newError.forEach((element) => {
    errorObject = set(errorObject, pathToError || element.path, element.message)
  })
  return merge(currentError, errorObject)
}

function constructPath(currentPath: string, newKey: string) {
  if (currentPath === '') {
    return newKey
  }
  return `${currentPath}.${newKey}`
}

function partialSchemaValidation(
  answers: FormValue,
  originalSchema: Schema,
  error: RecordObject | undefined,
  currentPath = '',
  sendConstructedPath?: boolean,
): RecordObject | undefined {
  Object.keys(answers).forEach((key) => {
    const constructedErrorPath = constructPath(currentPath, key)
    const answer = answers[key]

    // ZodUnions do not have .pick method
    const trimmedSchema = originalSchema.pick
      ? originalSchema.pick({ [key]: true })
      : originalSchema

    try {
      trimmedSchema.parse({ [key]: answer })
    } catch (e) {
      const zodErrors: ZodSuberror[] = e.errors
      if (!has(error, constructedErrorPath)) {
        error = populateError(
          error,
          zodErrors,
          sendConstructedPath ? constructedErrorPath : undefined,
        )
      }
      if (Array.isArray(answer)) {
        const arrayElements = answer as Answer[]
        arrayElements.forEach((el, index) => {
          try {
            trimmedSchema.parse({ [key]: [el] })
          } catch (e) {
            if (el !== null && typeof el === 'object') {
              partialSchemaValidation(
                el as FormValue,
                trimmedSchema?.shape[key]?._def?.type,
                error,
                `${constructedErrorPath}[${index}]`,
                true,
              )
            }
          }
        })
      } else if (typeof answer === 'object') {
        partialSchemaValidation(
          answer as FormValue,
          originalSchema.shape[key],
          error,
          constructedErrorPath,
        )
      }
    }
  })

  return error
}

export function validateAnswers(
  dataSchema: Schema,
  answers: FormValue,
  isFullSchemaValidation?: boolean,
): RecordObject | undefined {
  if (!isFullSchemaValidation) {
    return partialSchemaValidation(answers, dataSchema, undefined)
  }

  try {
    dataSchema.parse(answers)
  } catch (e) {
    return e
  }
  return undefined
}

export const buildValidationError = (
  path: string,
  index?: number,
): ((message: string, field?: string) => AnswerValidationError) => (
  message,
  field,
) => {
  if (field && isNumber(index)) {
    return {
      message,
      path: `${path}[${index}].${field}`,
    }
  }

  return {
    message,
    path,
  }
}
