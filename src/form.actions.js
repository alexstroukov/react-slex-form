import _ from 'lodash'
import * as actionTypes from './form.actionTypes'
import * as statuses from './form.statuses'

class FormActions {

  constructor () {
    this.resetFormStore = this.resetFormStore.bind(this)
    this.submitForm = this.submitForm.bind(this)
    this.resetForm = this.resetForm.bind(this)
    this.resetField = this.resetField.bind(this)
    this.validateForm = this.validateForm.bind(this)
    this.changeValue = this.changeValue.bind(this)
    this.registerField = this.registerField.bind(this)
    this.unregisterField = this.unregisterField.bind(this)
    this.changeInitialValue = this.changeInitialValue.bind(this)
    this.updateInitialValue = this.updateInitialValue.bind(this) // _
    this.isValid = this.isValid.bind(this)
    this.isInvalid = this.isInvalid.bind(this)
    this.updateValue = this.updateValue.bind(this) // _
    this.validate = this.validate.bind(this) // _
    this.validating = this.validating.bind(this)
    this.addFormField = this.addFormField.bind(this) // _
  }

  resetFormStore () {
    const action = {
      type: actionTypes.RESET_FORM_STORE
    }
    return action
  }

  changeInitialValue ({ formName, fieldName, value }) {
    return (dispatch, getState) => {
      dispatch(this.updateInitialValue({ formName, fieldName, value }))
      const fieldIsCurrentlyValidating = _.chain(getState())
        .get(`form.${formName}.${fieldName}.status`)
        .eq(statuses.VALIDATING)
        .value()
      if (fieldIsCurrentlyValidating) {
        dispatch(this.validate({ formName, fieldName, value }))
      }
    }
  }

  updateInitialValue ({ formName, fieldName, value }) {
    const action = {
      type: actionTypes.UPDATE_INITIAL_VALUE,
      formName,
      fieldName,
      value
    }
    return action
  }

  submitForm (formName, submitServiceFn = () => {}) {
    return (dispatch, getState) => {
      return dispatch(this.validateForm({ formName }))
        .then(formErrors => {
          if (_.isEmpty(formErrors)) {
            const formValues = _.chain(_.get(getState(), `form.${formName}`), {})
              .omit('status')
              .map(({ value }, fieldName) => ({ fieldName, value }))
              .reduce((memo, { fieldName, value }) => ({ ...memo, [fieldName]: value }), {})
              .value()
            return Promise.resolve(submitServiceFn(formValues))
          } else {
            return Promise.reject(formErrors)
          }
        })
    }
  }

  validateForm ({ formName }) {
    return (dispatch, getState) => {
      const validateFormPromise = _.chain(getState())
          .get(`form.${formName}`)
          .map((field, fieldName) => ({ fieldName, ...field }))
          .map(({ fieldName, value }) => dispatch(this.validate({ formName, fieldName, value })))
          .thru(promises => Promise
            .all(promises)
            .then(() => _.chain(getState())
              .get(`form.${formName}`)
              .map(field => field.error)
              .reject(_.isUndefined)
              .flatten()
              .value()
            )
          )
          .value()
      return validateFormPromise
    }
  }

  resetForm ({ formName }) {
    const action = {
      type: actionTypes.RESET_FORM,
      formName
    }
    return action
  }

  resetField ({ formName, fieldName }) {
    const action = {
      type: actionTypes.RESET_FIELD,
      formName,
      fieldName
    }
    return action
  }

  validate ({ formName, fieldName, value }) {
    return (dispatch, getState) => {
      const [ form, validate, status ] = _.at(getState(), [`form.${formName}`, `form.${formName}.${fieldName}.validate`, `form.${formName}.${fieldName}.status`])
      if (validate) {
        if (status !== statuses.VALIDATING) {
          dispatch(this.validating({ formName, fieldName }))
        }
        return Promise.resolve(validate(value, form))
          .then(validationResult => {
            const currentValue = _.get(getState(), `form.${formName}.${fieldName}.value`)
            const currentStatus = _.get(getState(), `form.${formName}.${fieldName}.status`)
            if (currentValue === value && currentStatus !== statuses.INITIAL) {
              if (_.isError(validationResult)) {
                dispatch(this.isInvalid({ formName, fieldName, error: validationResult }))
              } else {
                dispatch(this.isValid({ formName, fieldName }))
              }
            }
          })
          .catch(error => {
            const currentValue = _.get(getState(), `form.${formName}.${fieldName}.value`)
            const currentStatus = _.get(getState(), `form.${formName}.${fieldName}.status`)
            if (currentValue === value && currentStatus !== statuses.INITIAL) {
              dispatch(this.isInvalid({ formName, fieldName, error }))
            }
          })
      } else {
        return Promise.resolve(dispatch(this.isValid({ formName, fieldName })))
      }
    }
  }

  updateValue ({ formName, fieldName, value, isSilent }) {
    const action = {
      type: actionTypes.UPDATE_VALUE,
      formName,
      fieldName,
      isSilent,
      value
    }
    return action
  }

  changeValue ({ formName, fieldName, value, isSilent = true }) {
    return (dispatch, getState) => {
      dispatch(this.updateValue({ formName, fieldName, value, isSilent }))
      dispatch(this.validate({ formName, fieldName, value }))
    }
  }

  validating ({ formName, fieldName }) {
    const action = {
      type: actionTypes.VALIDATING,
      formName,
      fieldName
    }
    return action
  }

  isValid ({ formName, fieldName }) {
    const action = {
      type: actionTypes.IS_VALID,
      formName,
      fieldName
    }
    return action
  }

  isInvalid ({ formName, fieldName, error }) {
    const action = {
      type: actionTypes.IS_INVALID,
      formName,
      fieldName,
      error
    }
    return action
  }

  registerField ({ formName, fieldName, value, validate }) {
    return (dispatch, getState) => {
      const pristine = _.chain(getState())
        .get(`form.${formName}.status`, statuses.INITIAL)
        .thru(status => status === statuses.INITIAL)
        .value()
      dispatch(this.addFormField({ formName, fieldName, value, validate }))
      if (!pristine) {
        dispatch(this.validate({ formName, fieldName, value }))
      }
    }
  }


  addFormField ({ formName, fieldName, value, validate }) {
    const action = {
      type: actionTypes.REGISTER_FIELD,
      formName,
      fieldName,
      value,
      validate
    }
    return action
  }

  unregisterField ({ formName, fieldName }) {
    const action = {
      type: actionTypes.UNREGISTER_FIELD,
      formName,
      fieldName
    }
    return action
  }
}

export default new FormActions()
