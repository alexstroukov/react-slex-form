import _ from 'lodash'
import * as actionTypes from './form.actionTypes'
import * as statuses from './form.statuses'
import actions from './form.actions'
import selectors from './form.selectors'
import formSubscribers from './formSubscribers'
import fieldSubscribers from './fieldSubscribers'

class FormSideEffects {
  shareFormActionsWithApplicationStore = applicationStore => ({ action }) => {
    if (
      action.type === actionTypes.SUBMIT_FORM ||
      action.type === actionTypes.SUBMIT_FORM_SUCCESS ||
      action.type === actionTypes.SUBMIT_FORM_FAIL
    ) {
      applicationStore.dispatch(action)
    }
  }
  notifyFieldSubscribersOnFieldChangeSideEffect = ({ prevState, nextState, action, dispatch }) => {
    if (
      action.type === actionTypes.CHANGE_INITIAL_VALUE ||
      action.type === actionTypes.CHANGE_VALUE ||
      action.type === actionTypes.RESET_FIELD ||
      action.type === actionTypes.IS_INVALID ||
      action.type === actionTypes.IS_VALID ||
      action.type === actionTypes.SUBMIT_FORM_SUCCESS ||
      action.type === actionTypes.SUBMIT_FORM_FAIL ||
      action.type === actionTypes.UPDATE_META
    ) {
      const { formName, fieldName } = action
      this._notifyField({ nextState, formName, fieldName })
    }
  }
  notifyFieldSubscribersOnFormChangeSideEffect = ({ prevState, nextState, action, dispatch }) => {
    if (
      action.type === actionTypes.RESET_FORM
    ) {
      const { formName } = action
      const fieldNames = selectors.getFormFieldNames(nextState, { formName })
      for (const fieldName of fieldNames) {
        this._notifyField({ nextState, formName, fieldName })
      }
    }
  }
  notifyFormSubscribersOnChangeSideEffect = ({ prevState, nextState, action, dispatch }) => {
    if (
      action.type === actionTypes.RESET_FORM ||
      action.type === actionTypes.CHANGE_VALUE ||
      action.type === actionTypes.RESET_FIELD ||
      action.type === actionTypes.IS_INVALID ||
      action.type === actionTypes.IS_VALID ||
      action.type === actionTypes.SUBMIT_FORM ||
      action.type === actionTypes.SUBMIT_FORM_SUCCESS ||
      action.type === actionTypes.SUBMIT_FORM_FAIL
    ) {
      const { formName } = action
      this._notifyForm({ nextState, formName })
    }
  }
  _notifyField = ({ nextState, formName, fieldName }) => {
    const field = selectors.getField(nextState, { formName, fieldName })
    fieldSubscribers.notifySubscribers(formName + fieldName, subscriber => {
      subscriber({ field })
    })
  }
  _notifyForm = ({ nextState, formName }) => {
    const form = selectors.getForm(nextState, { formName })
    formSubscribers.notifySubscribers(formName, subscriber => {
      subscriber({ form })
    })
  }
}

export default new FormSideEffects()


