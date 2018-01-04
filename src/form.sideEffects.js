import _ from 'lodash'
import * as actionTypes from './form.actionTypes'
import * as statuses from './form.statuses'
import actions from './form.actions'
import selectors from './form.selectors'

class FormSideEffects {
  notifySubscribersOnFieldChangeSideEffect = ({ prevState, nextState, action, dispatch }) => {
    if (
      action.type === actionTypes.CHANGE_VALUE ||
      action.type === actionTypes.CHANGE_INITIAL_VALUE ||
      action.type === actionTypes.RESET_FIELD ||
      action.type === actionTypes.IS_INVALID ||
      action.type === actionTypes.IS_VALID ||
      action.type === actionTypes.SUBMIT_FORM_SUCCESS ||
      action.type === actionTypes.SUBMIT_FORM_FAIL
    ) {
      const { formName, fieldName } = action
      const field = selectors.getField(nextState, { formName, fieldName })
      const subscribers = selectors.getFieldSubscribers(nextState, { formName, fieldName })
      for (const subscriber of subscribers) {
        subscriber({ field })
      }
    }
  }
}

return new FormSideEffects()


