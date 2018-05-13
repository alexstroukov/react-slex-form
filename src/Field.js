import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import _ from 'lodash'
import actions from './form.actions'
import selectors from './form.selectors'
import * as statuses from './form.statuses'

class Field extends PureComponent {
  constructor (props, context) {
    super(props, context)
    this.store = props.store || context.store
    this.form = props.form || context.form
    this.state = {
      field: this.form.getField({ formName: this.props.formName, fieldName: this.props.fieldName })
    }
  }
  componentDidMount () {
    this._initialValue = this.props.value
    this._updateField = ({ field, fieldName }) => this.setState({ field, fieldName })
    this.register(this.props)
    this.subscribeField(this.props)
    this.updateField({ field: this.form.getField({ formName: this.props.formName, fieldName: this.props.fieldName }) })
  }
  componentWillReceiveProps (nextProps) {
    const { formName, fieldName } = nextProps
    const { formName: prevFormName, fieldName: prevFieldName } = this.props
    if (formName !== prevFormName || fieldName !== prevFieldName) {
      const nextField = this.form.getField({ formName: nextProps.formName, fieldName: nextProps.fieldName })
      this.register(nextProps)
      this.unsubscribeField(this.props)
      this.subscribeField(nextProps)
      this.updateField({ field: nextField })
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
    const isSameValue = _.isEqual(field, this.state.field)
    !isSameValue && this._updateField && this._updateField({ field, fieldName: this.props.fieldName })
  }
  subscribeField = (props) => {
    const { formName, fieldName } = props
    this.unsubscribe = this.store.subscribe((state) => {
      const nextField = this.form.getField({ formName, fieldName })
      if (this.state.field !== nextField) {
        this.updateField({ field: nextField })
      }
    })
  }
  unsubscribeField = (props) => {
    const { formName, fieldName } = props
    this.unsubscribe && this.unsubscribe()
  }
  changeInitialValue = (props) => {
    const { formName, fieldName, meta, value } = props
    const field = this.form.getField({ formName, fieldName })
    const initialValueHasChanged = !_.isEqual(value, _.get(field, 'initialValue'))
    const hasBeenSet = this._initialValue === value
    if (initialValueHasChanged && !hasBeenSet) {
      this._initialValue = value
      this.form.changeInitialValue({ formName, fieldName, value, meta })
    }
  }
  register = (props) => {
    const { formName, fieldName, value, validate, meta } = props
    this.form.registerField({ formName, fieldName, value, validate, meta })
  }
  unregister = (props) => {
    const { unregister, stayRegistered, formName, fieldName } = props
    if (!stayRegistered) {
      this.form.unregisterField({ formName, fieldName })
    }
  }
  changeValue = (value) => {
    const { formName, fieldName } = this.props
    this.form.changeValue({ formName, fieldName, value })
  }
  _getFieldProps = () => {
    const { render, component, validate, stayRegistered, ...rest } = this.props
    const field = this.state.field || this.form.getField({ formName: this.props.formName, fieldName: this.props.fieldName })
    const nextProps = {
      changeValue: this.changeValue,
      ...rest,
      ...field
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

  validate: PropTypes.string,
  render: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  component: PropTypes.any,
  store: PropTypes.object
}

Field.contextTypes = {
  form: PropTypes.object,
  store: PropTypes.object
}

export { Field }
export default Field
