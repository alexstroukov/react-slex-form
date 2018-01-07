import PropTypes from 'prop-types'
import React, { Component } from 'react'
import selectors from './form.selectors'
import actions from './form.actions'

function withForm (WrappedComponent) {
  class ConnectedForm extends Component {
    constructor (props, context) {
      super(props, context)
      const formContext = this.props.formContext || this.context.formContext
      this.store = formContext.store
    }
    render () {
      return (
        <WrappedComponent
          {...this.props}
          getFormState={this.store.getState}
          dispatchForm={this.store.dispatch}
        />
      )
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

export default withForm
