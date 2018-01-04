import _ from 'lodash'
import * as actionTypes from './form.actionTypes'
import * as statuses from './form.statuses'
import actions from './form.actions'

class FormMiddleware {
  validateFieldOnChangeValueMiddleware = (dispatch, getState, action) => {
    if (action.type === actionTypes.CHANGE_VALUE) {
      const { formName, fieldName, value } = action
      const [ form, validate, status ] = _.chain(getState())
        .at([
          `form.${formName}`,
          `form.${formName}.${fieldName}.validate`,
          `form.${formName}.${fieldName}.status`
        ])
        .value()
      if (validate) {
        return Promise
          .resolve(validate(value, form))
          .then(validationResult => {
            const currentValue = _.get(getState(), `form.${formName}.${fieldName}.value`)
            const currentStatus = _.get(getState(), `form.${formName}.${fieldName}.status`)
            if (currentValue === value && currentStatus !== statuses.INITIAL) {
              if (_.isError(validationResult)) {
                dispatch(actions.isInvalid({ formName, fieldName, error: validationResult.message }))
              } else {
                dispatch(actions.isValid({ formName, fieldName }))
              }
            }
          })
          .catch(error => {
            const currentValue = _.get(getState(), `form.${formName}.${fieldName}.value`)
            const currentStatus = _.get(getState(), `form.${formName}.${fieldName}.status`)
            if (currentValue === value && currentStatus !== statuses.INITIAL) {
              dispatch(actions.isInvalid({ formName, fieldName, error: error.message }))
            }
          })
      }
    }
  }
}

return new FormMiddleware()


