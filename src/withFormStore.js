import PropTypes from 'prop-types'
import React, { Component } from 'react'
import selectors from './form.selectors'
import actions from './form.actions'

function withFormStore (WrappedComponent) {
  class ConnectedForm extends Component {
    render () {
      const store = this.props.store || this.context.store
      return (
        <WrappedComponent
          {...this.props}
          getFormState={store.getState}
          dispatchForm={store.dispatch}
        />
      )
    }
  }
  ConnectedForm.propTypes = {
    store: PropTypes.object
  }
  ConnectedForm.contextTypes = {
    store: PropTypes.object
  }
  return ConnectedForm
}

export default withFormStore
