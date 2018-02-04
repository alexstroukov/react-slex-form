import PropTypes from 'prop-types'
import React, { Component } from 'react'
import _ from 'lodash'
import selectors from './form.selectors'
import actions from './form.actions'
import * as statuses from './form.statuses'
import formSubscribers from './formSubscribers'

function withFormState (formName) {
  return WrappedComponent => {
    class ConnectedForm extends Component {
      constructor (props, context) {
        super(props, context)
        this.store = this.props.store || this.context.formStore
        this.state = {
          form: selectors.getForm(this.store.getState(), { formName })
        }
      }
      componentDidMount () {
        formSubscribers.subscribe(formName, this.updateForm)
      }
      componentWillUnmount () {
        formSubscribers.unsubscribe(formName, this.updateForm)
      }
      updateForm = ({ form }) => {
        this.setState({ form })
      }
      render () {
        const { submitting = false, canSubmit = false, submitError } = this.state.form || {}
        return (
          <WrappedComponent
            {...this.props}
            submitting={submitting}
            canSubmit={canSubmit}
            submitError={submitError}
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
}

export default withFormState
