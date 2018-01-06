import _ from 'lodash'
import * as actionTypes from './form.actionTypes'
import * as statuses from './form.statuses'
import actions from './form.actions'
import selectors from './form.selectors'

class FormSideEffects {
  notifyFieldSubscribersOnFieldChangeSideEffect = ({ prevState, nextState, action, dispatch }) => {
    if (
      action.type === actionTypes.CHANGE_VALUE ||
      action.type === actionTypes.RESET_FIELD ||
      action.type === actionTypes.IS_INVALID ||
      action.type === actionTypes.IS_VALID ||
      action.type === actionTypes.SUBMIT_FORM_SUCCESS ||
      action.type === actionTypes.SUBMIT_FORM_FAIL
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
    const fieldSubscribers = selectors.getFieldSubscribers(nextState, { formName, fieldName })
    for (const subscriber of fieldSubscribers) {
      subscriber({ field })
    }
  }
  _notifyForm = ({ nextState, formName }) => {
    const form = selectors.getForm(nextState, { formName })
    const formSubscribers = selectors.getFormSubscribers(nextState, { formName })
    for (const subscriber of formSubscribers) {
      subscriber({ form })
    }
  }
}

export default new FormSideEffects()


