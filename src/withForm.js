import PropTypes from 'prop-types'
import React, { Component } from 'react'
import selectors from './form.selectors'
import actions from './form.actions'

function withForm (WrappedComponent) {
  class ConnectedForm extends Component {
    render () {
      const store = this.props.store || this.context.formStore
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
    formStore: PropTypes.object
  }
  ConnectedForm.contextTypes = {
    formStore: PropTypes.object
  }
  return ConnectedForm
}

export default withForm
