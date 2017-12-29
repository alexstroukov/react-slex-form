import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import _ from 'lodash'
import { connect } from 'react-slex-store'
import actions from './form.actions'
import * as statuses from './form.statuses'

class Field extends PureComponent {
  componentInitialValue = this.props.componentInitialValue

  componentDidMount () {
    this.register(this.props)
  }
  componentWillReceiveProps (nextProps) {
    const { formName, fieldName } = nextProps
    const { formName: prevFormName, fieldName: prevFieldName } = this.props
    this.componentInitialValue = this.props.componentInitialValue
    if (formName !== prevFormName || fieldName !== prevFieldName) {
      this.register(nextProps)
      this.unregister(this.props)
    }
  }
  componentDidUpdate () {
    this.changeInitialValue(this.props)
  }
  componentWillUnmount () {
    this.unregister(this.props)
  }
  changeInitialValue = (props) => {
    const { formName, fieldName, componentInitialValue, meta, changeInitialValue, initialValue } = props
    const shouldChangeInitialValue = !_.isEqual(initialValue, componentInitialValue)
    const initialValueChanged = !_.isEqual(this.componentInitialValue, componentInitialValue)
    if (shouldChangeInitialValue && initialValueChanged) {
      changeInitialValue({ formName, fieldName, componentInitialValue, meta })
    }
  }
  register = (props) => {
    const { register, formName, fieldName, componentInitialValue, validate, componentInitialMeta } = props
    register({ formName, fieldName, componentInitialValue, validate, componentInitialMeta })
  }
  unregister = (props) => {
    const { unregister, stayRegistered, formName, fieldName } = props
    if (!stayRegistered) {
      unregister({ formName, fieldName })
    }
  }
  _getFieldProps = () => {
    const { render, component, ...rest } = this.props
    return _.omit(rest, [
      'register',
      'unregister',
      'validate',
      'changeInitialValue',
      'shouldChangeInitialValue',
      'componentInitialValue',
      'componentInitialMeta',
      'initialValue',
      'stayRegistered'
    ])
  }
  render () {
    const { render, component: FieldComponent } = this.props
    if (FieldComponent) {
      return <FieldComponent {...this._getFieldProps()} />
    } else if (render) {
      return render({ ...this._getFieldProps() })
    } else {
      return null
    }
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

  validate: PropTypes.string,
  render: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  component: PropTypes.any,
  changeInitialValue: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  unregister: PropTypes.func.isRequired
}

export { Field }

export default connect((dispatch, getState, ownProps) => {
  const { formName, fieldName, value: componentInitialValue, validate, meta: componentInitialMeta } = ownProps
  const { value, status, touched, initialValue, loading, messages, meta, submitting } = getField()
  const register = ({ formName, fieldName, componentInitialValue, validate, componentInitialMeta }) => {
    const fieldIsRegistered = _.chain(getState())
      .has(`form.${formName}.${fieldName}`)
      .value()
    if (!fieldIsRegistered) {
      dispatch(actions.registerField({ formName, fieldName, value: componentInitialValue, validate, meta: componentInitialMeta }))
    }
  }
  const unregister = ({ formName, fieldName }) => dispatch(actions.unregisterField({ formName, fieldName }))
  const changeValue = nextValue => dispatch(actions.changeValue({ formName, fieldName, value: nextValue }))
  const changeInitialValue = ({ formName, fieldName, componentInitialValue, meta }) => {
    dispatch(actions.changeInitialValue({ formName, fieldName, value: componentInitialValue, meta }))
  }
  return {
    ...ownProps,
    componentInitialMeta,
    initialValue,
    componentInitialValue,
    meta,
    register,
    unregister,
    changeValue,
    changeInitialValue,
    value,
    status,
    messages,
    touched,
    loading,
    submitting
  }

  function getField () {
    return _.chain(getState())
      .at([
        `form.${formName}.${fieldName}.value`,
        `form.${formName}.${fieldName}.status`,
        `form.${formName}.${fieldName}.error`,
        `form.${formName}.${fieldName}.touched`,
        `form.${formName}.${fieldName}.initialValue`,
        `form.${formName}.${fieldName}.meta`,
        `form.${formName}.status`
      ])
      .thru(([ value, status = statuses.INITIAL, error, touched = false, initialValue, meta = {}, formStatus ]) => {
        const loading = status === statuses.VALIDATING
        const submitting = formStatus === statuses.SUBMITTING
        const messages = _.chain([error])
          .flatten()
          .reject(_.isUndefined)
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