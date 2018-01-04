import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import _ from 'lodash'
import connectField from './connectField'
import actions from './form.actions'
import selectors from './form.selectors'
import * as statuses from './form.statuses'

class Field extends PureComponent {
  state = {
    field: this.props.field
  }
  componentDidMount () {
    this.register(this.props)
    this.subscribe(this.props)
  }
  componentWillReceiveProps (nextProps) {
    const { formName, fieldName } = nextProps
    const { formName: prevFormName, fieldName: prevFieldName } = this.props
    if (formName !== prevFormName || fieldName !== prevFieldName) {
      this.register(nextProps)
      this.subscribe(nextProps)
      this.unsubscribe(this.props)
      this.unregister(this.props)
    }
  }
  componentDidUpdate () {
    this.changeInitialValue(this.props)
  }
  componentWillUnmount () {
    this.unsubscribe(this.props)
    this.unregister(this.props)
  }
  updateField = ({ field }) => {
    this.setState({ field })
  }
  subscribe = (props) => {
    const { subscribe, formName, fieldName } = props
    subscribe({ formName, fieldName, callback: this.updateField })
  }
  unsubscribe = (props) => {
    const { unsubscribe, formName, fieldName } = props
    unsubscribe({ formName, fieldName, callback: this.updateField })
  }
  changeInitialValue = (props) => {
    const { formName, fieldName, meta, changeInitialValue, value } = props
    const initialValueHasChanged = !_.isEqual(value, _.get(this.props.field, 'initialValue'))
    if (initialValueHasChanged) {
      changeInitialValue({ formName, fieldName, value, meta })
    }
  }
  register = (props) => {
    const { register, formName, fieldName, field, value, validate, meta } = props
    if (!field) {
      register({ formName, fieldName, value, validate, meta })
    }  
  }
  unregister = (props) => {
    const { unregister, stayRegistered, formName, fieldName } = props
    if (!stayRegistered) {
      unregister({ formName, fieldName })
    }
  }
  _getFieldProps = () => {
    const { render, component, changeValue, subscribe, unsubscribe, field, register, unregister, validate, stayRegistered, changeInitialValue, ...rest } = this.props
    const nextProps = {
      changeValue,
      ...rest,
      ...(this.state.field || field)
    }
    return nextProps
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
  value: PropTypes.any,
  stayRegistered: PropTypes.bool,
  formName: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  changeValue: PropTypes.func.isRequired,

  validate: PropTypes.func,
  render: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  component: PropTypes.any,
  changeInitialValue: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  unregister: PropTypes.func.isRequired
}

export { Field }

export default connectField((formContext, ownProps) => {
  const { dispatch, getState } = formContext.store
  const { formName, fieldName } = ownProps
  const field = selectors.getField(getState(), { formName, fieldName })
  const register = ({ formName, fieldName, value, validate, meta }) => dispatch(actions.registerField({ formName, fieldName, value, validate, meta }))
  const unregister = ({ formName, fieldName }) => dispatch(actions.unregisterField({ formName, fieldName }))
  const changeValue = nextValue => dispatch(actions.changeValue({ formName, fieldName, value: nextValue }))
  const changeInitialValue = ({ formName, fieldName, value, meta }) => dispatch(actions.changeInitialValue({ formName, fieldName, value, meta }))
  const subscribe = ({ formName, fieldName, callback }) => dispatch(actions.subscribe({ formName, fieldName, callback }))
  const unsubscribe = ({ formName, fieldName, callback }) => dispatch(actions.unsubscribe({ formName, fieldName, callback }))
  return {
    ...ownProps,
    subscribe,
    unsubscribe,
    field,
    register,
    unregister,
    changeValue,
    changeInitialValue
  }
})(Field)