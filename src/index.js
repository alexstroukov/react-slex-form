import Field from './Field'
import * as statuses from './form.statuses'
import * as actionTypes from './form.actionTypes'
import reducers from './form.reducers'
import actions from './form.actions'
import intitialState from './initialState'

export { Field, statuses, actionTypes, actions, reduceForm }

export default function reduceForm (state = intitialState, action) {
  switch (action.type) {
    case actionTypes.RESET_FORM_STORE:
      return reducers.resetFormStore(state, action)
    case actionTypes.UPDATE_VALUE:
      return reducers.updateValue(state, action)
    case actionTypes.REGISTER_FIELD:
      return reducers.registerField(state, action)
    case actionTypes.UNREGISTER_FIELD:
      return reducers.unregisterField(state, action)
    case actionTypes.RESET_FIELD:
      return reducers.resetField(state, action)
    case actionTypes.RESET_FORM:
      return reducers.resetForm(state, action)
    case actionTypes.UPDATE_INITIAL_VALUE:
      return reducers.updateInitialValue(state, action)
    case actionTypes.IS_VALID:
      return reducers.isValid(state, action)
    case actionTypes.IS_INVALID:
      return reducers.isInvalid(state, action)
    case actionTypes.VALIDATING:
      return reducers.validating(state, action)
    case actionTypes.UPDATE_META:
      return reducers.updateMeta(state, action)
    default:
      return state
  }
}
