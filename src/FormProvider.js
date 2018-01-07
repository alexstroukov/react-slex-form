import PropTypes from 'prop-types'
import { connect } from 'react-slex-store'
import actions from './form.actions'
import * as actionTypes from './form.actionTypes'
import reducers from './form.reducers'
import * as statuses from './form.statuses'
import selectors from './form.selectors'
import React, { Component, Children } from 'react'

export class FormProvider extends Component {
  constructor (props, context) {
    super(props, context)
    this.store = props.store
  }
  getChildContext () {
    return {
      formContext: {
        store: this.store,
        submitForm: this.submitForm
      }
    }
  }
  _validateForm = ({ formName, form }) => {
    return _.chain(form)
      .omit(['error', 'status', 'subscribers'])
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
      if (field.validate) {
        return Promise
          .resolve(field.validate(field.value, form))
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
  submitForm = (formName, submitServiceFn) => {
    const form = _.get(this.store.getState(), `form.${formName}`)
    const canSubmit = form.status === statuses.VALID
    if (canSubmit) {
      this.store.dispatch(actions.submitForm({ formName }))
      return this._validateForm({ formName, form })
        .then(validationErrors => {
          if (_.isEmpty(validationErrors)) {
            const formValues = _.chain(form)
              .omit(['error', 'status', 'subscribers']) 
              .map(({ value }, fieldName) => ({ fieldName, value }))
              .reduce((memo, { fieldName, value }) => ({ ...memo, [fieldName]: value }), {})
              .value()
            return Promise
              .resolve(submitServiceFn(formValues))
              .then(result => {
                this.store.dispatch(actions.submitFormSuccess({ formName, result }))
                return result
              })
              .catch(error => {
                this.store.dispatch(actions.submitFormFail({ formName, error: error.message }))
                throw error
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
  render () {
    return Children.only(this.props.children)
  }
}

FormProvider.propTypes = {
  children: PropTypes.element.isRequired
}

FormProvider.childContextTypes = {
  formContext: PropTypes.object
}

export default FormProvider
