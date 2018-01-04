import PropTypes from 'prop-types'
import React, { Component } from 'react'

function connectForm (WrappedComponent) {
  class ConnectedForm extends Component {
    render () {
      const formContext = this.props.formContext || this.context.formContext
      const { store, submitForm } = formContext
      return <WrappedComponent {...this.props} getFormState={store.getState} dispatchForm={store.dispatch} submitForm={submitForm} />
    }
  }
  ConnectedForm.propTypes = {
    formContext: PropTypes.object
  }
  ConnectedForm.contextTypes = {
    formContext: PropTypes.object
  }
  return ConnectedForm
}

export default connectForm
