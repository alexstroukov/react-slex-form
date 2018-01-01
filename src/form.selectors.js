import _ from 'lodash'
import * as statuses from './form.statuses'
import initialState from './initialState'

class FormSelectors {
  getCanSubmit = (state, { formName }) => {
    const {
      [formName]: {
        status
      } = {}
    } = state
    const canSubmit = status === statuses.VALID
    return canSubmit
  }
  getSubmitting = (state, { formName }) => {
    const {
      [formName]: {
        status
      } = {}
    } = state
    const submitting = status === statuses.SUBMITTING
    return submitting
  }
  getSubmitError = (state, { formName }) => {
    const {
      [formName]: {
        error
      } = {}
    } = state
    return error
  }
  getFieldValue (state, { formName, fieldName }) {
    const {
      [formName]: {
        [fieldName]: {
          value: fieldValue
        } = {}          
      } = {}
    } = state
    return fieldValue
  }
  getField (state, { formName, fieldName }) {
    const {
      [formName]: {
        [fieldName]: field
      } = {}
    } = state
    if (field) {
      const { status, error, touched = false, initialValue, meta = {}, formStatus } = field
      const loading = status === statuses.VALIDATING
      const submitting = formStatus === statuses.SUBMITTING
      const messages = _.chain([error])
        .flatten()
        .reject(_.isUndefined)
        .value()
      return {
        ...field,
        meta,
        messages,
        loading,
        submitting,
        touched
      }
    } else {
      return field
    }
  }
}

export default new FormSelectors()
