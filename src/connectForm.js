import PropTypes from 'prop-types'
import React, { Component } from 'react'

function connectForm (fn) {
  return WrappedComponent => {
    class ConnectedForm extends Component {
      render () {
        const formContext = this.props.formContext || this.context.formContext
        const nextProps = fn(formContext, this.props)
        return <WrappedComponent {...nextProps} />
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
}

export default connectForm
