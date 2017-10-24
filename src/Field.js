import PropTypes from 'prop-types'
import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-slex-store'
import actions from './form.actions'
import * as statuses from './form.statuses'

class Field extends Component {

  componentDidMount () {
    const { register } = this.props
    register()
  }

  componentWillReceiveProps (nextProps) {
    const { register, formName, fieldName } = nextProps
    const { formName: prevFormName, fieldName: prevFieldName } = this.props
    if (formName !== prevFormName || fieldName !== prevFieldName) {
      register()
    }
  }

  componentDidUpdate (nextProps) {
    const { changeInitialValue } = this.props
    changeInitialValue()
  }

  componentWillUnmount () {
    const { unregister, stayRegistered } = this.props
    if (!stayRegistered) {
      unregister()
    }
  }

  render () {
    const { render, ...rest } = this.props
    return render
      ? render({ ..._.omit(rest, 'register', 'unregister', 'validate', 'changeInitialValue') })
      : null
  }
}

Field.propTypes = {
  value: PropTypes.object,
  stayRegistered: PropTypes.bool,
  loading: PropTypes.bool.isRequired,
  touched: PropTypes.bool.isRequired,
  formName: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  value: PropTypes.any,
  messages: PropTypes.arrayOf(PropTypes.string),
  status: PropTypes.string.isRequired,
  changeValue: PropTypes.func.isRequired,

  validate: PropTypes.func,
  render: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  changeInitialValue: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  unregister: PropTypes.func.isRequired
}

export { Field }

export default connect((dispatch, getState, ownProps) => {
  const { formName, fieldName, value: componentInitialValue, validate, meta: registrationMeta } = ownProps
  const { value, status, touched, initialValue, loading, messages, meta } = getField()
  const register = () => {
    const fieldIsRegistered = _.chain(getState())
      .has(`form.${formName}.${fieldName}`)
      .value()
    if (!fieldIsRegistered) {
      dispatch(actions.registerField({ formName, fieldName, value: componentInitialValue, validate, meta: registrationMeta }))
    }
  }
  const unregister = () => dispatch(actions.unregisterField({ formName, fieldName }))
  const changeValue = nextValue => dispatch(actions.changeValue({ formName, fieldName, value: nextValue }))
  const changeInitialValue = () => {
    const [ initialValue, valueInStore ] = _.at(getState(), [
      `form.${formName}.${fieldName}.initialValue`,
      `form.${formName}.${fieldName}.value`
    ])
    if (_.isEqual(initialValue, valueInStore) && !_.isEqual(initialValue, componentInitialValue)) {
      dispatch(actions.changeInitialValue({ formName, fieldName, value: componentInitialValue, meta: registrationMeta }))
    }
  }

  return {
    ...ownProps,
    meta,
    register,
    unregister,
    changeValue,
    changeInitialValue,
    value,
    status,
    messages,
    touched,
    loading
  }

  function getField () {
    return _.chain(getState())
      .get(`form.${formName}.${fieldName}`)
      .at(['value', 'status', 'error', 'touched', 'initialValue', 'meta'])
      .thru(([ value, status = statuses.INITIAL, error, touched = false, initialValue, meta = {} ]) => {
        const loading = status === statuses.VALIDATING
        const submitting = status === statuses.SUBMITTING
        const messages = _.chain([error])
          .flatten()
          .reject(_.isUndefined)
          .filter(error => error.message != null)
          .map(error => error.message)
          .value() 
        return {
          meta,
          messages,
          loading,
          submitting,
          status,
          error,
          touched,
          initialValue,
          value: status === statuses.INITIAL
            ? value || initialValue || componentInitialValue
            : value
        }
      })
      .value()
  }
})(Field)
