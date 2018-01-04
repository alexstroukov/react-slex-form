import _ from 'lodash'
import * as statuses from './form.statuses'
import initialState from './initialState'

class FormSelectors {
  getCanSubmit = (state, { formName }) => {
    const {
      form: {
        [formName]: {
          status
        } = {}
      }
    } = state
    const canSubmit = status === statuses.VALID
    return canSubmit
  }
  getSubmitting = (state, { formName }) => {
    const {
      form: {
        [formName]: {
          status
        } = {}
      }
    } = state
    const submitting = status === statuses.SUBMITTING
    return submitting
  }
  getSubmitError = (state, { formName }) => {
    const {
      form: {
        [formName]: {
          error
        } = {}
      }
    } = state
    return error
  }
  getFieldValue (state, { formName, fieldName }) {
    const {
      form: {
        [formName]: {
          [fieldName]: {
            value: fieldValue
          } = {}          
        } = {}
      }
    } = state
    return fieldValue
  }
  getFieldSubscribers (state, { formName, fieldName }) {
    const {
      form: {
        [formName]: {
          [fieldName]: {
            subscribers: []
          } = {}          
        } = {}
      }
    } = state
    return subscribers
  }
  getField (state, { formName, fieldName }) {
    const {
      form: {
        [formName]: {
          [fieldName]: field
        } = {}
      }
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
