import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import { connect } from 'react-slex-store'
import actions from './form.actions'
import * as statuses from './form.statuses'

class Field extends Component {

  componentDidMount () {
    const { register } = this.props
    register()
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
    const { render } = this.props
    return render
      ? render({ ..._.omit(this.props, 'render', 'register', 'unregister', 'validate', 'changeInitialValue') })
      : null
  }
}

Field.propTypes = {
  stayRegistered: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  isTouched: PropTypes.bool.isRequired,
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
  const { formName, fieldName, value: componentInitialValue, validate } = ownProps
  const [ value = initialValue || componentInitialValue, status = statuses.INITIAL, error, isTouched = false, initialValue ] = _.chain(getState())
    .get(`form.${formName}.${fieldName}`)
    .at(['value', 'status', 'error', 'isTouched', 'initialValue'])
    .value()

  const isLoading = status === statuses.VALIDATING
  const messages = _.chain([error])
    .flatten()
    .reject(_.isUndefined)
    .filter(error => error.message != null)
    .map(error => error.message)
    .value()
  const register = () => dispatch(actions.registerField({ formName, fieldName, value: componentInitialValue, validate }))
  const unregister = () => dispatch(actions.unregisterField({ formName, fieldName }))
  const changeValue = nextValue => dispatch(actions.changeValue({ formName, fieldName, value: nextValue }))
  const changeInitialValue = () => {
    const [ initialValue, valueInStore ] = _.at(getState(), [
      `form.${formName}.${fieldName}.initialValue`,
      `form.${formName}.${fieldName}.value`
    ])
    if (initialValue === valueInStore && initialValue !== componentInitialValue) {
      dispatch(actions.changeInitialValue({ formName, fieldName, value: componentInitialValue }))
    }
  }

  return {
    ...ownProps,
    register,
    unregister,
    changeValue,
    changeInitialValue,
    value,
    status,
    messages,
    isTouched,
    isLoading
  }
})(Field)
