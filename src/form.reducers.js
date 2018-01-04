import _ from 'lodash'
import * as statuses from './form.statuses'
import initialState from './initialState'

class FormReducers {
  resetFormStore = (state, action) => {
    return initialState
  }
  submitForm = (state, action) => {
    const { formName } = action
    const form = state[formName]
    const nextForm = {
      ...form,
      status: statuses.SUBMITTING
    }
    const nextState = {
      ...state,
      [formName]: nextForm
    }
    return nextState
  }
  submitFormSuccess = (state, action) => {
    return this.resetForm(state, action)
  }
  submitFormFail = (state, action) => {
    const { formName, validationErrors, error } = action
    const form = state[formName]
    if (_.isEmpty(validationErrors)) {
      const nextForm = {
        ...form,
        status: statuses.VALID,
        error
      }
      const nextState = {
        ...state,
        [formName]: nextForm
      }
      return nextState
    } else {
      const nextForm = _.chain(form)
        .thru(this._getFields)
        .map((field, fieldName) => {
          const error = validationErrors ? validationErrors[fieldName] : undefined
          const nextField = !error
            ? field
            : {
              ...field,
              error,
              status: statuses.INVALID
            }
          return {
            fieldName,
            field: nextField
          }
        })
        .reduce((memo, { fieldName, field }) => ({ ...memo, [fieldName]: field }), { ...form, status: statuses.INVALID, error })
        .value()
      const nextState = {
        ...state,
        [formName]: nextForm
      }
      return nextState
    }
  }
  unsubscribe = (state, action) => {
    const { formName, fieldName, callback } = action
    const form = state[formName]
    const field = form && form[fieldName]
    const subscribers = field.subscribers || []
    const index = subscribers.indexOf(callback)
    if (index !== -1) {
      const nextSubscribers = [ ...subscribers.slice(0, index), ...subscribers.slice(index + 1)]
      const nextField = {
        ...field,
        subscribers: nextSubscribers
      }
      const nextForm = {
        ...form,
        [fieldName]: nextField
      }
      const nextState = {
        ...state,
        [formName]: nextForm
      }
      return nextState
    } else {
      return state
    }
  }
  subscribe = (state, action) => {
    const { formName, fieldName, callback } = action
    const form = state[formName]
    const field = form && form[fieldName]
    const subscribers = field.subscribers || []
    const nextSubscribers = [
      ...subscribers,
      callback
    ]
    const nextField = {
      ...field,
      subscribers: nextSubscribers
    }
    const nextForm = {
      ...form,
      [fieldName]: nextField
    }
    const nextState = {
      ...state,
      [formName]: nextForm
    }
    return nextState
  }
  changeValue = (state, action) => {
    const { formName, fieldName, value, isSilent = false, meta } = action
    const form = state[formName]
    const field = form && form[fieldName]
    const currentFieldStatus = _.get(field, 'status') 
    const currentFormStatus = _.get(form, 'status') 
    const existingMeta = _.get(field, 'meta', {})
    const touched = isSilent ? _.get(field, `touched`, false) : true
    const hasValidator = !!_.get(field, `validate`)
    const nextFieldStatus = hasValidator
      ? statuses.VALIDATING
      : statuses.VALID
    const nextFormStatus = hasValidator
      ? statuses.VALIDATING
      : this._getNextFormStatus({ form, omitFieldName: fieldName, defaultStatus: statuses.VALID })
  
    const nextMeta = {
      ...existingMeta,
      ...meta
    }
    const nextField = {
      ...field,
      meta: nextMeta,
      status: nextFieldStatus,
      value,
      touched
    }
    const nextForm = {
      ...form,
      status: nextFormStatus,
      [fieldName]: nextField
    }
    const nextState = {
      ...state,
      [formName]: nextForm
    }
    return nextState
  }
  registerField = (state, action) => {
    const { formName, fieldName, value, validate, meta } = action
    const form = state[formName]
    const field = form && form[fieldName]
    const existingMeta = field && field.meta ? field.meta : {}
    const nextMeta = {
      ...existingMeta,
      ...meta
    }
    const nextField = {
      status: statuses.INITIAL,
      error: undefined,
      touched: false,
      initialValue: value,
      value,
      validate,
      subscribers: [],
      ...field,
      meta: nextMeta
    }
    const nextState = {
      ...state,
      [formName]: {
        status: statuses.INITIAL, // will get overwritten if form exists with a status
        ...form,
        [fieldName]: nextField
      }
    }
    return nextState
  }
  changeInitialValue = (state, action) => {
    const { formName, fieldName, value: nextInitialValue, meta } = action
    const form = state[formName]
    const field = form && form[fieldName]
    const existingMeta = _.get(field, 'meta', {})
    const nextMeta = {
      ...existingMeta,
      ...meta
    }
    const nextValue = _.get(field, 'touched') === false ? nextInitialValue : _.get(field, 'value')
    const nextField = {
      ...field,
      meta: nextMeta,
      initialValue: nextInitialValue,
      value: nextValue
    }
    const nextForm = {
      ...form,
      [fieldName]: nextField
    }

    const nextState = {
      ...state,
      [formName]: nextForm
    }
    return nextState
  }
  unregisterField = (state, action) => {
    const { formName, fieldName } = action
    const form = state[formName]
    const nextFormStatus = this._getNextFormStatus({ form, omitFieldName: fieldName, defaultStatus: statuses.INITIAL })
    const nextForm = _.chain(form)
      .omit(fieldName)
      .assign({ status: nextFormStatus })
      .value()

    const formHasNoMoreRegisteredFields = _.isEmpty(this._getFields(nextForm))
    if (formHasNoMoreRegisteredFields) {
      return _.omit(state, formName)
    } else {
      const nextState = {
        ...state,
        [formName]: nextForm
      }
      return nextState
    }
  }
  isValid = (state, action) => {
    const { formName, fieldName } = action
    const form = state[formName]
    const field = form && form[fieldName]
    const nextFormStatus = this._getNextFormStatus({ form, omitFieldName: fieldName, defaultStatus: statuses.VALID })
    const nextState = {
      ...state,
      [formName]: {
        ...form,
        status: nextFormStatus,
        [fieldName]: {
          ...field,
          error: undefined,
          status: statuses.VALID
        }
      }
    }
    return nextState
  }
  resetField = (state, action) => {
    const { formName, fieldName } = action
    const form = state[formName]
    const field = form && form[fieldName]
    if (field) {
      const nextFormStatus = this._getNextFormStatus({ form, omitFieldName: fieldName, defaultStatus: statuses.INITIAL })
      const nextState = {
        ...state,
        [formName]: {
          ...form,
          status: nextFormStatus,
          [fieldName]: this._resetField({ field })
        }
      }
      return nextState
    } else {
      return state
    }
  }
  resetForm = (state, action) => {
    const { formName } = action
    const form = state[formName]
    const nextForm = _.chain(form)
        .thru(this._getFields)
        .map((field, fieldName) => {
          const nextField = this._resetField({ field })
          return {
            fieldName,
            field: nextField
          }
        })
        .reduce((memo, next) => {
          const { fieldName, field } = next
          return {
            ...memo,
            [fieldName]: field
          }
        }, { ...form, error: undefined, status: statuses.INITIAL })
        .value()
    const nextState = {
      [formName]: nextForm
    }
    return nextState
  }
  isInvalid = (state, action) => {
    const { formName, fieldName, error } = action
    const form = state[formName]
    const field = form && form[fieldName]
    const nextField = {
      ...field,
      error,
      status: statuses.INVALID
    }
    const nextFormStatus = this._getNextFormStatus({ form, replaceFieldName: fieldName, replaceFieldValue: nextField, defaultStatus: statuses.INVALID })
    const nextState = {
      ...state,
      [formName]: {
        ...form,
        status: nextFormStatus,
        [fieldName]: nextField
      }
    }
    return nextState
  }
  updateMeta = (state, action) => {
    const { formName, fieldName, meta } = action
    const form = state[formName]
    const field = form && form[fieldName]
    const existingMeta = _.get(field, 'meta', {})
    const nextMeta = {
      ...existingMeta,
      ...meta
    }
    const nextField = {
      ...field,
      meta: nextMeta
    }
    const nextForm = {
      ...form,
      [fieldName]: nextField
    }
    const nextState = {
      ...state,
      [formName]: nextForm
    }
    return nextState
  }
  _getFields = (form) => {
    return _.chain(form)
      .omit(['error', 'status'])
      .value()
  }
  _getNextFormStatus = ({ form, omitFieldName, replaceFieldName, replaceFieldValue, defaultStatus }) => {
    return _.chain(form)
      .thru(this._getFields)
      .omit([omitFieldName])
      .thru(form => {
        if (replaceFieldName) {
          return {
            ...form,
            [replaceFieldName]: replaceFieldValue
          }
        } else {
          return form
        }
      })
      .map(field => field.status)
      .reduce((memo, next) => ({ ...memo, [next]: memo[next] + 1 }), _.reduce(statuses, (memo, next) => ({ ...memo, [next]: 0 }), {}))
      .thru(statusCounts => {
        if (statusCounts.VALIDATING > 0) {
          return statuses.VALIDATING
        } else if (statusCounts.INVALID > 0) {
          return statuses.INVALID
        } else if (statusCounts.VALID > 0) {
          return statuses.VALID
        } else {
          return defaultStatus || statuses.INITIAL
        }
      })
      .value()
  }
  _resetField = ({ field }) => {
    return {
      ...field,
      error: undefined,
      status: statuses.INITIAL,
      value: field.initialValue,
      touched: false
    }
  }

}

export default new FormReducers()
