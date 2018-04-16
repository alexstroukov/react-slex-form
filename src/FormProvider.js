import PropTypes from 'prop-types'
import React, { Component, Children } from 'react'
import _ from 'lodash'
import selectors from './form.selectors'
import actions from './form.actions'
import * as statuses from './form.statuses'
import validatorsStore from './validatorsStore'

export class FormProvider extends Component {
  constructor (props, context) {
    super(props, context)
    this.store = context.store || props.store
  }
  getChildContext () {
    return {
      form: {
        registerField: this.registerField,
        unregisterField: this.unregisterField,
        changeValue: this.changeValue,
        changeInitialValue: this.changeInitialValue,
        getField: this.getField
      }
    }
  }
  getField = ({ formName, fieldName }) => {
    return selectors.getField(this.store.getState(), { formName, fieldName })
  }
  changeValue = ({ formName, fieldName, value }) => {
    this.store.dispatch(actions.changeValue({ formName, fieldName, value }))
    const validate = validatorsStore.getValidator({ formName, fieldName })
    if (validate) {
      const [ form, status ] = _.at(this.store.getState(), [
        `form.${formName}`,
        `form.${formName}.${fieldName}.status`
      ])
      return Promise
        .resolve(validate(value, form))
        .then(validationResult => {
          const currentValue = _.get(this.store.getState(), `form.${formName}.${fieldName}.value`)
          const currentStatus = _.get(this.store.getState(), `form.${formName}.${fieldName}.status`)
          if (currentValue === value && currentStatus !== statuses.INITIAL) {
            if (_.isError(validationResult)) {
              this.store.dispatch(actions.isInvalid({ formName, fieldName, error: validationResult.message }))
            } else {
              this.store.dispatch(actions.isValid({ formName, fieldName }))
            }
          }
        })
        .catch(error => {
          const currentValue = _.get(this.store.getState(), `form.${formName}.${fieldName}.value`)
          const currentStatus = _.get(this.store.getState(), `form.${formName}.${fieldName}.status`)
          if (currentValue === value && currentStatus !== statuses.INITIAL) {
            this.store.dispatch(actions.isInvalid({ formName, fieldName, error: error.message }))
          }
        })
    }
  }
  changeInitialValue = ({ formName, fieldName, value, meta }) => {
    this.store.dispatch(actions.changeInitialValue({ formName, fieldName, value, meta }))
  }
  registerField = ({ formName, fieldName, value, validate, meta }) => {    
    const fieldIsRegistered = selectors.getFieldIsRegistered(this.store.getState(), { formName, fieldName })
    if (!fieldIsRegistered) {
      this.store.dispatch(actions.registerField({ formName, fieldName, value, meta }))
      validatorsStore.setValidator({ formName, fieldName, validate })
    }
  }
  unregisterField = ({ formName, fieldName }) => {
    this.store.dispatch(actions.unregisterField({ formName, fieldName }))
    validatorsStore.removeValidator({ formName, fieldName })
  }
  render () {
    debugger
    return this.props.children
      ? Children.only(this.props.children)
      : null
  }
}

FormProvider.propTypes = {
  children: PropTypes.element.isRequired
}

FormProvider.childContextTypes = {
  form: PropTypes.object
}

FormProvider.contextTypes = {
  store: PropTypes.object
}

export default FormProvider
