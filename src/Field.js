import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import _ from 'lodash'
import connectField from './connectField'
import actions from './form.actions'
import selectors from './form.selectors'
import * as statuses from './form.statuses'
import fieldSubscribers from './fieldSubscribers'

class Field extends PureComponent {
  state = {
    field: this.props.getField({ formName: this.props.formName, fieldName: this.props.fieldName })
  }
  componentDidMount () {
    this._updateField = ({ field }) => this.setState({ field })
    this.register(this.props)
    this.subscribeField(this.props)
  }
  componentWillReceiveProps (nextProps) {
    const { formName, fieldName } = nextProps
    const { formName: prevFormName, fieldName: prevFieldName } = this.props
    if (formName !== prevFormName || fieldName !== prevFieldName) {
      const nextField = nextProps.getField({ formName: nextProps.formName, fieldName: nextProps.fieldName })
      this.register(nextProps)
      this.subscribeField(nextProps)
      this.updateField({ field: nextField})
      this.unsubscribeField(this.props)
      this.unregister(this.props)
    }
  }
  componentDidUpdate () {
    this.changeInitialValue(this.props)
  }
  componentWillUnmount () {
    this._updateField = undefined
    this.unsubscribeField(this.props)
    this.unregister(this.props)
  }
  updateField = ({ field }) => {
    this._updateField && this._updateField({ field })
  }
  subscribeField = (props) => {
    const { formName, fieldName } = props
    fieldSubscribers.subscribe(formName + fieldName, this.updateField)
  }
  unsubscribeField = (props) => {
    const { formName, fieldName } = props
    fieldSubscribers.unsubscribe(formName + fieldName, this.updateField)
  }
  changeInitialValue = (props) => {
    const { formName, fieldName, meta, changeInitialValue, value, getField } = props
    const field = getField({ formName, fieldName })
    const initialValueHasChanged = !_.isEqual(value, _.get(field, 'initialValue'))
    if (initialValueHasChanged) {
      changeInitialValue({ formName, fieldName, value, meta })
    }
  }
  register = (props) => {
    const { register, formName, fieldName, value, validate, meta } = props
    register({ formName, fieldName, value, validate, meta })
  }
  unregister = (props) => {
    const { unregister, stayRegistered, formName, fieldName } = props
    if (!stayRegistered) {
      unregister({ formName, fieldName })
    }
  }
  _getFieldProps = () => {
    const { render, component, changeValue, getField, register, unregister, validate, stayRegistered, changeInitialValue, ...rest } = this.props
    const nextProps = {
      changeValue,
      ...rest,
      ...(this.state.field || getField({ formName: this.props.formName, fieldName: this.props.fieldName }))
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

export default connectField((store, ownProps) => {
  const { dispatch, getState } = store
  const { formName, fieldName } = ownProps
  const getField = ({ formName, fieldName }) => selectors.getField(getState(), { formName, fieldName })
  const register = ({ formName, fieldName, value, validate, meta }) => {
    const fieldIsRegistered = selectors.getFieldIsRegistered(getState(), { formName, fieldName })
    if (!fieldIsRegistered) {
      dispatch(actions.registerField({ formName, fieldName, value, validate, meta }))
    }
  }
  const unregister = ({ formName, fieldName }) => dispatch(actions.unregisterField({ formName, fieldName }))
  const changeValue = nextValue => dispatch(actions.changeValue({ formName, fieldName, value: nextValue }))
  const changeInitialValue = ({ formName, fieldName, value, meta }) => dispatch(actions.changeInitialValue({ formName, fieldName, value, meta }))
  return {
    ...ownProps,
    getField,
    register,
    unregister,
    changeValue,
    changeInitialValue
  }
})(Field)