import PropTypes from 'prop-types'
import React, { Component } from 'react'

function connectField (fn) {
  return WrappedComponent => {
    class ConnectedField extends Component {
      render () {
        const store = this.props.store || this.context.formStore
        const nextProps = fn(store, this.props)
        return <WrappedComponent {...nextProps} />
      }
    }
    ConnectedField.propTypes = {
      formStore: PropTypes.object
    }
    ConnectedField.contextTypes = {
      formStore: PropTypes.object
    }
    return ConnectedField
  }
}

export default connectField
