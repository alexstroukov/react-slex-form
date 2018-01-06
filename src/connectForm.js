import PropTypes from 'prop-types'
import React, { Component } from 'react'
import selectors from './form.selectors'
import actions from './form.actions'

function connectForm (formName) {
  return WrappedComponent => {
    class ConnectedForm extends Component {
      constructor (props, context) {
        super(props, context)
        const formContext = this.props.formContext || this.context.formContext
        this.store = formContext.store
        this.state = {
          form: selectors.getForm(this.store.getState(), { formName })
        }
      }
      componentDidMount () {
        this.store.dispatch(actions.subscribeForm({ formName, callback: this.updateForm }))
      }
      componentWillUnmount () {
        this.store.dispatch(actions.unsubscribeForm({ formName, callback: this.updateForm }))
      }
      updateForm = ({ form }) => {
        this.setState({ form })
      }
      resetForm = () => {
        this.store.dispatch(actions.resetForm({ formName }))
      }
      render () {
        const formContext = this.props.formContext || this.context.formContext
        const { store, submitForm } = formContext
        const { submitting = false, canSubmit = false, submitError } = this.state.form || {}
        return (
          <WrappedComponent
            {...this.props}
            submitting={submitting}
            canSubmit={canSubmit}
            submitError={submitError}
            getFormState={store.getState}
            dispatchForm={store.dispatch}
            submitForm={_.partial(submitForm, formName)}
            resetForm={this.resetForm}
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
}

export default connectForm
