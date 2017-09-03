import _ from 'lodash'
import * as statuses from './form.statuses'
import initialState from './initialState'

class FormReducers {
  resetFormStore = (state, action) => {
    return initialState
  }

  validating = (state, action) => {
    const { formName, fieldName } = action
    const form = state[formName]
    const field = form && form[fieldName]
    const nextState = {
      ...state,
      [formName]: {
        ...form,
        status: statuses.VALIDATING,
        [fieldName]: {
          ...field,
          status: statuses.VALIDATING
        }
      }
    }
    return nextState
  }

  updateValue = (state, action) => {
    const { formName, fieldName, value, isSilent = false } = action
    const form = state[formName]
    const field = form && form[fieldName]
    const isTouched = isSilent ? _.get(field, `isTouched`, false) : true
    const nextState = {
      ...state,
      [formName]: {
        ...form,
        status: statuses.VALIDATING,
        [fieldName]: {
          ...field,
          status: statuses.VALIDATING,
          value,
          isTouched
        }
      }
    }
    return nextState
  }

  registerField = (state, action) => {
    const { formName, fieldName, value, validate } = action
    const form = state[formName]
    const field = form && form[fieldName]
    const nextState = {
      ...state,
      [formName]: {
        status: statuses.INITIAL, // will get overwritten if form exists with a status
        ...form,
        [fieldName]: {
          status: statuses.INITIAL,
          error: undefined,
          isTouched: false,
          initialValue: value,
          value,
          validate,
          ...field
        }
      }
    }
    return nextState
  }

  updateInitialValue = (state, action) => {
    const { formName, fieldName, value: nextInitialValue } = action
    const form = state[formName]
    const field = form && form[fieldName]
    const nextValue = _.get(field, 'isTouched') === false ? nextInitialValue : _.get(field, 'value')
    const nextState = {
      ...state,
      [formName]: {
        ...form,
        [fieldName]: {
          ...field,
          initialValue: nextInitialValue,
          value: nextValue
        }
      }
    }
    return nextState
  }

  unregisterField = (state, action) => {
    const { formName, fieldName } = action
    const form = _.omit({ ...state[formName] }, fieldName)
    const formHasNoMoreRegisteredFields = _.keys(form).length === 0
    if (formHasNoMoreRegisteredFields) {
      return _.omit(state, formName)
    } else {
      const nextState = {
        ...state,
        [formName]: form
      }
      return nextState
    }
  }

  isValid = (state, action) => {
    const { formName, fieldName } = action
    const form = state[formName]
    const field = form && form[fieldName]
    const nextStatus = this._getNextFormStatus({ form, omitFieldName: fieldName, defaultStatus: statuses.VALID })
    const nextState = {
      ...state,
      [formName]: {
        ...form,
        status: nextStatus,
        [fieldName]: {
          ...field,
          error: undefined,
          status: statuses.VALID
        }
      }
    }
    return nextState
  }

  _getNextFormStatus = ({ form, omitFieldName, replaceFieldName, replaceFieldValue, defaultStatus }) => {
    return _.chain(form)
      .omit(omitFieldName, 'status')
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

  resetField = (state, action) => {
    const { formName, fieldName } = action
    const form = state[formName]
    const field = form && form[fieldName]
    if (field) {
      const nextStatus = this._getNextFormStatus({ form, omitFieldName: fieldName, defaultStatus: statuses.INITIAL })
      const nextState = {
        ...state,
        [formName]: {
          ...form,
          status: nextStatus,
          [fieldName]: {
            ...field,
            error: undefined,
            status: statuses.INITIAL,
            value: field.initialValue,
            isTouched: false
          }
        }
      }
      return nextState
    } else {
      return state
    }
  }

  resetForm = (state, action) => {
    const { formName } = action
    const nextState = _.chain(state)
        .get(formName)
        .omit('status')
        .map((field, fieldName) => fieldName)
        .reduce((state, fieldName) => {
          return this.resetField(state, { formName, fieldName })
        }, state)
        .value()
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
    const nextStatus = this._getNextFormStatus({ form, replaceFieldName: fieldName, replaceFieldValue: nextField, defaultStatus: statuses.INVALID })
    const nextState = {
      ...state,
      [formName]: {
        ...form,
        status: nextStatus,
        [fieldName]: nextField
      }
    }
    return nextState
  }
}

export default new FormReducers()
