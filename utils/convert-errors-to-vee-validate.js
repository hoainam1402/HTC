import { isArray } from 'lodash'

export function convertErrorsToVeeValidate(errors) {
  const obj = {}
  if (isArray(errors)) {
    errors.forEach((e) => {
      obj[e.members[0]] = [e.message]
    })
  }
  return obj
}
