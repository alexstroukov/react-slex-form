import _ from 'lodash'
import actions from './form.actions'
import statuses from './form.statuses'

function submitForm ({ formValidators, dispatch, getState, formName, submitServiceFn = () => {} }) {
  const form = _.get(getState(), `form.${formName}`)
  if (form.status === statuses.VALIDATING) {
    return Promise.reject(new Error('Cannot submit form while validating'))
  }
  if (form.status === statuses.SUBMITTING) {
    return Promise.reject(new Error('Cannot submit form while already submitting'))
  }
  const validateFormPromise = _.chain(form)
    .map((field, fieldName) => {
      const validateField = formValidators[field.validate]
      if (validateField) {
        return Promise
          .resolve(validateField(value, form))
          .then(validationResult => {
            return {
              fieldName,
              validationResult
            }
          })
          .catch(error => {
            return {
              fieldName,
              validationResult: error
            }
          })
      } else {
        return {
          fieldName,
          validationResult: true
        }
      }
    })
    .thru(promises => Promise
      .all(promises)
      .then(validationResults => _.chain(validationResults)
        .filter(({ validationResult }) => _.isError(validationResult))
        .value()
      )
    )
    .value()

    dispatch(actions.submitForm({ formName }))
    return validateFormPromise
      .then(validationErrors => {
        if (_.isEmpty(validationErrors.length)) {
          const formValues = _.chain(form)
            .omit('status')
            .map(({ value }, fieldName) => ({ fieldName, value }))
            .reduce((memo, { fieldName, value }) => ({ ...memo, [fieldName]: value }), {})
            .value()
          return Promise
            .resolve(submitServiceFn(formValues))
            .then(result => {
              dispatch(actions.submitFormSuccess({ formName }))
              return result
            })
        } else {
          dispatch(actions.submitFormFail({ formName, validationErrors }))
          return Promise.reject(new Error('Form validation failed'))
        }
      })
}