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
  getFieldValue = (state, { formName, fieldName }) => {
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
  getFormFieldNames = (state, { formName }) => {
    const {
      form: {
        [formName]: form = {}
      }
    } = state
    return _.chain(form)
      .omit(['error', 'status'])
      .keys()
      .value()
  }
  getField = (state, { formName, fieldName }) => {
    const {
      form: {
        [formName]: {
          [fieldName]: field
        } = {}
      }
    } = state
    if (field) {
      const { value, status, error, touched = false, initialValue, meta = {}, validate, formStatus } = field
      const loading = status === statuses.VALIDATING
      const submitting = formStatus === statuses.SUBMITTING
      const messages = _.chain([error])
        .flatten()
        .reject(_.isUndefined)
        .value()
      return {
        value,
        initialValue,
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
  getFieldIsRegistered = (state, { formName, fieldName }) => {
    const {
      form: {
        [formName]: {
          [fieldName]: field
        } = {}
      }
    } = state
    return !!field
  }
  getForm = (state, { formName }) => {
    const {
      form: {
        [formName]: form
      }
    } = state
    if (form) {
      const { status, error: submitError } = form
      const canSubmit = status === statuses.VALID
      const submitting = status === statuses.SUBMITTING
      return {
        ...form,
        submitError,
        canSubmit,
        submitting
      }
    } else {
      return form
    }
  }
}

export default new FormSelectors()
