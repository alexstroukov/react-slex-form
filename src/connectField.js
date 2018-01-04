import PropTypes from 'prop-types'
import React, { Component } from 'react'

function connectField (fn) {
  return WrappedComponent => {
    class ConnectedField extends Component {
      render () {
        const formContext = this.props.formContext || this.context.formContext
        const nextProps = fn(formContext, this.props)
        return <WrappedComponent {...nextProps} />
      }
    }
    ConnectedField.propTypes = {
      formContext: PropTypes.object
    }
    ConnectedField.contextTypes = {
      formContext: PropTypes.object
    }
    return ConnectedField
  }
}

export default connectField
