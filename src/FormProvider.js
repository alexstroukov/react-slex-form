import PropTypes from 'prop-types'
import React, { Component, Children } from 'react'
import _ from 'lodash'
import selectors from './form.selectors'
import actions from './form.actions'
import * as statuses from './form.statuses'
import { buffer } from './utils'

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
        changeInitialValue: this.changeInitialValue
      }
    }
  }
  bufferedDispatch = buffer(actions => {
    this.store.dispatch(actions)
  })
  changeValue = ({ formName, fieldName, value }) => {
    this.bufferedDispatch(actions.changeValue({ formName, fieldName, value }))
  }
  changeInitialValue = ({ formName, fieldName, value, meta }) => {
    this.bufferedDispatch(actions.changeInitialValue({ formName, fieldName, value, meta }))
  }
  registerField = ({ formName, fieldName, value, validate, meta }) => {    
    const fieldIsRegistered = selectors.getFieldIsRegistered(this.store.getState(), { formName, fieldName })
    if (!fieldIsRegistered) {
      this.bufferedDispatch(actions.registerField({ formName, fieldName, value, validate, meta }))
    }
  }
  unregisterField = ({ formName, fieldName }) => {
    this.bufferedDispatch(actions.unregisterField({ formName, fieldName }))
  }
  render () {
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
