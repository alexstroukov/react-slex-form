import FormProvider from './FormProvider'
import Field from './Field'
import * as statuses from './form.statuses'
import * as actionTypes from './form.actionTypes'
import reducers from './form.reducers'
import selectors from './form.selectors'
import sideEffects from './form.sideEffects'
import actions from './form.actions'
import connectForm from './connectForm'
import withFormState from './withFormState'
import initialState from './initialState'
import editable from './editable'
import editableShared from './editableShared'
import editableConnected from './editableConnected'

function reduceFormClient (state = initialState, action) {
  switch (action.type) {
    // case actionTypes.REGISTER_FIELD:
    //   return reducers.registerField(state, action)
    // case actionTypes.UNREGISTER_FIELD:
    //   return reducers.unregisterField(state, action)
    // case actionTypes.CHANGE_INITIAL_VALUE:
    //   return reducers.changeInitialValue(state, action)
    // case actionTypes.CHANGE_VALUE:
    //   return reducers.changeValue(state, action)
    default:
      return state
  }
}

function reduceFormWorker (state = initialState, action) {
  switch (action.type) {
    case actionTypes.REGISTER_FIELD:
      return reducers.registerField(state, action)
    case actionTypes.UNREGISTER_FIELD:
      return reducers.unregisterField(state, action)
    case actionTypes.RESET_FORM_STORE:
      return reducers.resetFormStore(state, action)
    case actionTypes.SUBMIT_FORM:
      return reducers.submitForm(state, action)
    case actionTypes.SUBMIT_FORM_SUCCESS:
      return reducers.submitFormSuccess(state, action)
    case actionTypes.SUBMIT_FORM_FAIL:
      return reducers.submitFormFail(state, action)
    case actionTypes.CHANGE_VALUE:
      return reducers.changeValue(state, action)
    case actionTypes.RESET_FIELD:
      return reducers.resetField(state, action)
    case actionTypes.RESET_FORM:
      return reducers.resetForm(state, action)
    case actionTypes.CHANGE_INITIAL_VALUE:
      return reducers.changeInitialValue(state, action)
    case actionTypes.IS_VALID:
      return reducers.isValid(state, action)
    case actionTypes.IS_INVALID:
      return reducers.isInvalid(state, action)
    case actionTypes.UPDATE_META:
      return reducers.updateMeta(state, action)
    default:
      return state
  }
}


export { editable, reduceFormClient, reduceFormWorker, editableShared, editableConnected, Field, FormProvider, statuses, actionTypes, actions, sideEffects, selectors, connectForm, withFormState }


