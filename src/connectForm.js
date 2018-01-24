import PropTypes from 'prop-types'
import React, { Component } from 'react'
import _ from 'lodash'
import selectors from './form.selectors'
import actions from './form.actions'
import * as statuses from './form.statuses'
import formSubscribers from './formSubscribers'

function connectForm (formName) {
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
      resetForm = () => {
        this.store.dispatch(actions.resetForm({ formName }))
      }
      _validateForm = ({ formName, form }) => {
        return _.chain(form)
          .omit(['error', 'status'])
          .map((field, fieldName) => _validateField({ formName, fieldName, form, field }))
          .thru(promises => Promise
            .all(promises)
            .then(validationResults => _.chain(validationResults)
              .filter(validationResult => validationResult.error)
              .reduce((memo, { fieldName, error }) => ({ ...memo, [fieldName]: error }), {})
              .value()
            )
          )
          .value()
        function _validateField ({ formName, fieldName, form, field }) {
          if (field.validate) {
            return Promise
              .resolve(field.validate(field.value, form))
              .then(error => {
                return {
                  fieldName,
                  error: _.isError(error)
                    ? error.message
                    : undefined
                }
              })
              .catch(error => {
                return {
                  fieldName,
                  error: error.message
                }
              })
          } else {
            return Promise
              .resolve({
                fieldName,
                error: undefined
              })
          }
        }
      }
      submitForm = (submitServiceFn) => {
        const form = _.get(this.store.getState(), `form.${formName}`)
        const canSubmit = form.status === statuses.VALID
        if (canSubmit) {
          this.store.dispatch(actions.submitForm({ formName }))
          return this._validateForm({ formName, form })
            .then(validationErrors => {
              if (_.isEmpty(validationErrors)) {
                const formValues = _.chain(form)
                  .omit(['error', 'status']) 
                  .map(({ value }, fieldName) => ({ fieldName, value }))
                  .reduce((memo, { fieldName, value }) => ({ ...memo, [fieldName]: value }), {})
                  .value()
                return Promise
                  .resolve(submitServiceFn(formValues))
                  .then(result => {
                    this.store.dispatch(actions.submitFormSuccess({ formName, result }))
                    return result
                  })
              } else {
                this.store.dispatch(actions.submitFormFail({ formName, validationErrors }))
              }
            })
            .catch(error => {
              this.store.dispatch(actions.submitFormFail({ formName, error: error.message }))
            })
        } else {
          return Promise.reject(new Error('Cannot submit form while submit in progress'))
        }
      }
      render () {
        const { submitting = false, canSubmit = false, submitError } = this.state.form || {}
        return (
          <WrappedComponent
            {...this.props}
            submitting={submitting}
            canSubmit={canSubmit}
            submitError={submitError}
            getFormState={this.store.getState}
            dispatchForm={this.store.dispatch}
            submitForm={this.submitForm}
            resetForm={this.resetForm}
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

export default connectForm
