import _ from 'lodash'
import * as statuses from './form.statuses'
import initialState from './initialState'
import { memoizeOptions } from 'slex-memoize'

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
    return this._getFormFieldNames({ form })
  }
  getField = (state, { formName, fieldName }) => {
    const {
      form: {
        [formName]: {
          status: formStatus,
          [fieldName]: field
        } = {}
      }
    } = state
    if (field) {
      return this._getField({ field, formStatus })
    } else {
      return undefined
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
      return this._getForm({ form })
    } else {
      return undefined
    }
  }
  getFieldValidatorName = (state, { formName, fieldName }) => {
    const {
      form: {
        [formName]: {
          status: formStatus,
          [fieldName]: field
        } = {}
      }
    } = state
    if (field) {
      return field.validate
    } else {
      return undefined
    }
  }
  _getFormFieldNames = memoizeOptions(({ form }) => {
    return _.chain(form)
      .omit(['error', 'status', 'validate'])
      .keys()
      .value()
  })
  _getForm = memoizeOptions(({ form }) => {
    const { status, error: submitError } = form
    const canSubmit = status === statuses.VALID
    const submitting = status === statuses.SUBMITTING
    return {
      ...form,
      submitError,
      canSubmit,
      submitting
    }
  })
  _getField = memoizeOptions(({ field, formStatus }) => {
    const { value, status, error, touched = false, initialValue, meta = {}, validate } = field
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
  })
}

export default new FormSelectors()
