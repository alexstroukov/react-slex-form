import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import _ from 'lodash'
import connectForm from './connectForm'
import actions from './form.actions'
import selectors from './form.selectors'
import * as statuses from './form.statuses'

class Field extends PureComponent {
  state = {
    field: this.props.field
  }
  componentDidMount () {
    this.register(this.props)
    this.subscribe()
  }
  componentWillReceiveProps (nextProps) {
    const { formName, fieldName } = nextProps
    const { formName: prevFormName, fieldName: prevFieldName } = this.props
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
    this.unsubscribe()
  }
  updateField = ({ field }) => {
    this.setState({ field })
  }
  subscribe = () => {
    const { subscribe, formName, fieldName } = this.props
    this._unsubscribe = subscribe({ formName, fieldName, callback: this.updateField })
  }
  unsubscribe = () => {
    this._unsubscribe && this._unsubscribe()
  }
  changeInitialValue = (props) => {
    const { formName, fieldName, meta, changeInitialValue, initialValue } = props
    const initialValueHasChanged = !_.isEqual(initialValue, _.get(this.props.field, 'initialValue'))
    if (initialValueHasChanged) {
      changeInitialValue({ formName, fieldName, value: initialValue, meta })
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
    const { render, component, ...rest } = this.props
    const nextProps = _.chain(rest)
      .omit([
        'subscribe',
        'field',
        'register',
        'unregister',
        'validate',
        'stayRegistered',
        'changeInitialValue'
      ])
      .assign(this.state.field)
      .value()
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
  value: PropTypes.object,
  stayRegistered: PropTypes.bool,
  formName: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  changeValue: PropTypes.func.isRequired,

  validate: PropTypes.string,
  render: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  component: PropTypes.any,
  changeInitialValue: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  unregister: PropTypes.func.isRequired
}

export { Field }

export default connectForm((formContext, ownProps) => {
  const { dispatch, getState, subscribe } = formContext
  const { formName, fieldName } = ownProps
  const field = selectors.getField(getState(), { formName, fieldName })
  const register = ({ formName, fieldName, value, validate, meta }) => dispatch(actions.registerField({ formName, fieldName, value, validate, meta }))
  const unregister = ({ formName, fieldName }) => dispatch(actions.unregisterField({ formName, fieldName }))
  const changeValue = nextValue => dispatch(actions.changeValue({ formName, fieldName, value: nextValue }))
  const changeInitialValue = ({ formName, fieldName, value, meta }) => dispatch(actions.changeInitialValue({ formName, fieldName, value, meta }))
  return {
    ...ownProps,
    subscribe,
    field,
    register,
    unregister,
    changeValue,
    changeInitialValue
  }
})(Field)