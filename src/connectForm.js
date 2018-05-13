import PropTypes from 'prop-types'
import React, { Component } from 'react'
import _ from 'lodash'
import selectors from './form.selectors'
import actions from './form.actions'
import * as statuses from './form.statuses'

function connectForm (formName) {
  return WrappedComponent => {
    class ConnectedForm extends Component {
      constructor (props, context) {
        super(props, context)
        this.store = props.store || context.store
        this.state = {
          form: selectors.getForm(this.store.getState(), { formName })
        }
      }
      componentDidMount () {
        this.subscribeForm()
      }
      componentWillUnmount () {
        this.unsubscribe && this.unsubscribe()
      }
      subscribeForm = (props) => {
        this.unsubscribe = this.store.subscribe((state) => {
          const nextForm = selectors.getForm(state, { formName })
          if (this.state.form !== nextForm) {
            this.updateForm({ form: nextForm })
          }
        })
      }
      unsubscribeForm = (props) => {
        this.unsubscribe && this.unsubscribe()
      }
      updateForm = ({ form }) => {
        this.setState({ form })
      }
      resetForm = () => {
        this.store.dispatch(actions.resetForm({ formName }))
      }
      submitForm = (props) => {
        this.store.dispatch(actions.submitForm({ formName, props }))
      }
      render () {
        const { submitting = false, canSubmit = false, submitError } = this.state.form || {}
        return (
          <WrappedComponent
            {...this.props}
            submitting={submitting}
            canSubmit={canSubmit}
            submitError={submitError}
            submitForm={this.submitForm}
            resetForm={this.resetForm}
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
}

export default connectForm
