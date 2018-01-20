import PropTypes from 'prop-types'
import React, { Component, Children } from 'react'

export class FormProvider extends Component {
  constructor (props, context) {
    super(props, context)
    this.store = props.store
  }
  getChildContext () {
    return {
      formStore: this.store
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
  formStore: PropTypes.object
}

export default FormProvider
