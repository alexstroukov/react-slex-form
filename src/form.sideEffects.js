import _ from 'lodash'
import * as actionTypes from './form.actionTypes'
import * as statuses from './form.statuses'
import actions from './form.actions'
import selectors from './form.selectors'

class FormSideEffects {
  createFormSideEffects = ({ validators, submitters }) => {
    const validateFieldOnChangeValue = this.validateFieldOnChangeValue({ validators })
    const submitForm = this.submitForm({ validators, submitters })
    return ({ dispatch, prevState, nextState, action, getState }) => {
      validateFieldOnChangeValue({ dispatch, prevState, nextState, action, getState })
      submitForm({ dispatch, prevState, nextState, action, getState })
    }
  }
  _validateForm = ({ formName, form, prevState, validators }) => {
    const _validateField = ({ formName, fieldName, form, field }) => {
      const validatorName = selectors.getFieldValidatorName(prevState, { formName, fieldName })
      const validate = this._getValidator({ validators, validatorName })
      if (validate) {
        return Promise
          .resolve(validate(field.value, form))
          .then(error => {
            return {
              fieldName,
              error: _.isError(error)
                ? error.message
                : undefined
            }
          })
          .catch(error => {
            return {
              fieldName,
              error: error.message
            }
          })
      } else {
        return Promise
          .resolve({
            fieldName,
            error: undefined
          })
      }
    }
    return _.chain(form)
      .omit(['error', 'status', 'validate'])
      .map((field, fieldName) => _validateField({ formName, fieldName, form, field }))
      .thru(promises => Promise
        .all(promises)
        .then(validationResults => _.chain(validationResults)
          .filter(validationResult => validationResult.error)
          .reduce((memo, { fieldName, error }) => ({ ...memo, [fieldName]: error }), {})
          .value()
        )
      )
      .value()
  }
  submitForm  = ({ validators = {}, submitters = {} }) => {
    return ({ dispatch, prevState, nextState, action, getState }) => {
      if (action.type === actionTypes.SUBMIT_FORM) {
        const form = _.get(prevState, `form.${formName}`)
        return this._validateForm({ formName, form, prevState, validators })
          .then(validationErrors => {
            if (_.isEmpty(validationErrors)) {
              const formValues = _.chain(form)
                .omit(['error', 'status', 'validate']) 
                .map(({ value }, fieldName) => ({ fieldName, value }))
                .reduce((memo, { fieldName, value }) => ({ ...memo, [fieldName]: value }), {})
                .value()
              const submitServiceFn = this._getSubmitter({ submitters, formName }) || _.noop
              return Promise
                .resolve(submitServiceFn({ form: formValues, dispatch, getState, ...action.props }))
                .then(result => {
                  this.store.dispatch(actions.submitFormSuccess({ formName, result }))
                  return result
                })
            } else {
              this.store.dispatch(actions.submitFormFail({ formName, validationErrors }))
            }
          })
          .catch(error => {
            this.store.dispatch(actions.submitFormFail({ formName, error: error.message }))
          })
      }
    }
  }
  validateFieldOnChangeValue = ({ validators = {} }) => {
    return ({ dispatch, prevState, nextState, action, getState }) => {
      if (action.type === actionTypes.CHANGE_VALUE) {
        const { formName, fieldName } = action
        const validatorName = selectors.getFieldValidatorName(prevState, { formName, fieldName })
        const validate = this._getValidator({ validators, validatorName })
        if (validate) {
          const [ form, status ] = _.at(prevState, [
            `form.${formName}`,
            `form.${formName}.${fieldName}.status`
          ])
          return Promise
            .resolve(validate(value, form))
            .then(validationResult => {
              const currentValue = _.get(getState(), `form.${formName}.${fieldName}.value`)
              const currentStatus = _.get(getState(), `form.${formName}.${fieldName}.status`)
              if (currentValue === value && currentStatus !== statuses.INITIAL) {
                if (_.isError(validationResult)) {
                  this.store.dispatch(actions.isInvalid({ formName, fieldName, error: validationResult.message }))
                } else {
                  this.store.dispatch(actions.isValid({ formName, fieldName }))
                }
              }
            })
            .catch(error => {
              const currentValue = _.get(getState(), `form.${formName}.${fieldName}.value`)
              const currentStatus = _.get(getState(), `form.${formName}.${fieldName}.status`)
              if (currentValue === value && currentStatus !== statuses.INITIAL) {
                this.store.dispatch(actions.isInvalid({ formName, fieldName, error: error.message }))
              }
            })
        }
      }
    }
  }
  _getValidator = ({ validators, validatorName }) => {
    return validators[validatorName]
  }
  _getSubmitter = ({ submitters, formName }) => {
    return submitters[formName]
  }
}

export default new FormSideEffects()


