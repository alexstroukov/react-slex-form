import _ from 'lodash'
import * as actionTypes from './form.actionTypes'
import * as statuses from './form.statuses'

class FormActions {
  resetFormStore = () => {
    const action = {
      type: actionTypes.RESET_FORM_STORE
    }
    return action
  }
  changeInitialValue = ({ formName, fieldName, value, meta }) => {
    const action = {
      type: actionTypes.CHANGE_INITIAL_VALUE,
      formName,
      fieldName,
      value,
      meta
    }
    return action
  }
  submitForm = ({ formName, props }) => {
    const action = {
      type: actionTypes.SUBMIT_FORM,
      formName,
      props
    }
    return action
  }
  submitFormSuccess = ({ formName, result }) => {
    const action = {
      type: actionTypes.SUBMIT_FORM_SUCCESS,
      formName,
      result
    }
    return action
  }
  submitFormFail = ({ formName, error, validationErrors }) => {
    const action = {
      type: actionTypes.SUBMIT_FORM_FAIL,
      formName,
      error,
      validationErrors
    }
    return action
  }
  resetForm = ({ formName }) => {
    const action = {
      type: actionTypes.RESET_FORM,
      formName
    }
    return action
  }
  resetField = ({ formName, fieldName }) => {
    const action = {
      type: actionTypes.RESET_FIELD,
      formName,
      fieldName
    }
    return action
  }
  changeValue = ({ formName, fieldName, value, isSilent = true, meta }) => {
    const action = {
      type: actionTypes.CHANGE_VALUE,
      formName,
      fieldName,
      isSilent,
      value,
      meta
    }
    return action
  }
  isValid = ({ formName, fieldName }) => {
    const action = {
      type: actionTypes.IS_VALID,
      formName,
      fieldName
    }
    return action
  }
  isInvalid = ({ formName, fieldName, error }) => {
    const action = {
      type: actionTypes.IS_INVALID,
      formName,
      fieldName,
      error
    }
    return action
  }
  registerField = ({ formName, fieldName, validate, value, meta }) => {
    const action = {
      type: actionTypes.REGISTER_FIELD,
      formName,
      fieldName,
      value,
      validate,
      meta
    }
    return action
  }
  unregisterField = ({ formName, fieldName }) => {
    const action = {
      type: actionTypes.UNREGISTER_FIELD,
      formName,
      fieldName
    }
    return action
  }
  updateMeta = ({ formName, fieldName, meta }) => {
    const action = {
      type: actionTypes.UPDATE_META,
      formName,
      fieldName,
      meta
    }
    return action
  }
}

export default new FormActions()
