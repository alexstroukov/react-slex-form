import _ from 'lodash'
import * as actionTypes from './form.actionTypes'
import * as statuses from './form.statuses'
import actions from './form.actions'

export default function createFormMiddleware ({ forms = {} }) {
  class FormMiddleware {
    _validateForm = ({ formName, form }) => {
      return _.chain(form)
        .omit(['error', 'status'])
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
      function _validateField ({ formName, fieldName, form, field }) {
        const validateField = _.get(forms, `${formName}.validators.${field.validate}`)
        if (validateField) {
          return Promise
            .resolve(validateField(field.value, form))
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
    }

    submitFormMiddleware = (dispatch, getState, action) => {
      if (action.type === actionTypes.SUBMIT_FORM) {
        const { formName } = action
        const form = _.get(getState(), `form.${formName}`)
        const submitServiceFn = _.get(forms, `${formName}.submit`)
        const canSubmit = form.status === statuses.VALID
        if (canSubmit) {
          return this._validateForm({ formName, form })
            .then(validationErrors => {
              if (_.isEmpty(validationErrors)) {
                const formValues = _.chain(form)
                  .omit(['error', 'status']) 
                  .map(({ value }, fieldName) => ({ fieldName, value }))
                  .reduce((memo, { fieldName, value }) => ({ ...memo, [fieldName]: value }), {})
                  .value()
                return Promise
                  .resolve(submitServiceFn(formValues, getState))
                  .then(result => {
                    dispatch(actions.submitFormSuccess({ formName, result }))
                  })
                  .catch(error => {
                    dispatch(actions.submitFormFail({ formName, error: error.message }))
                  })
              } else {
                dispatch(actions.submitFormFail({ formName, validationErrors }))
              }
            })
            .catch(error => {
              dispatch(actions.submitFormFail({ formName, error: error.message }))
            })
        }
      }
    }

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
        const validateField = _.get(forms, `${formName}.validators.${validate}`)
        if (validateField) {
          return Promise
            .resolve(validateField(value, form))
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

    // validateFieldOnChangeInitialValueMiddleware = (dispatch, getState, action) => {
    //   if (action.type === actionTypes.CHANGE_INITIAL_VALUE) {
    //     const { formName, fieldName, value } = action
    //     const fieldIsCurrentlyValidating = _.chain(getState())
    //       .get(`form.${formName}.${fieldName}.status`)
    //       .eq(statuses.VALIDATING)
    //       .value()

    //     const [ form, validate, status ] = _.chain(getState())
    //       .at([
    //         `form.${formName}`,
    //         `form.${formName}.${fieldName}.validate`,
    //         `form.${formName}.${fieldName}.status`
    //       ])
    //       .value()
    //     if (fieldIsCurrentlyValidating) {
    //       dispatch(this.validate({ formName, fieldName, value }))
    //     }
    //   }
    // }


    // validateFormOnRegisterFieldMiddleware (dispatch, getState, action) => {
    //   if (action.type === actionTypes.REGISTER_FIELD) {
    //     const { formName, fieldName } = action
    //     const pristine = _.chain(getState())
    //       .get(`form.${formName}.status`, statuses.INITIAL)
    //       .thru(status => status === statuses.INITIAL)
    //       .value()
    //     if (!pristine) {
    //       dispatch(this.validate({ formName, fieldName, value }))
    //     }
    //   }
    // }
  }
  
  return new FormMiddleware()
}

