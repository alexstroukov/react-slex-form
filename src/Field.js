import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import _ from 'lodash'
import actions from './form.actions'
import selectors from './form.selectors'
import fieldValueSubscribers from './fieldValueSubscribers'
import initialValuesStore from './initialValuesStore'
import * as statuses from './form.statuses'

class Field extends PureComponent {
  constructor (props, context) {
    super(props, context)
    this.store = props.store || context.store
    this.form = props.form || context.form
    const { formName, fieldName, value, meta } = props
    initialValuesStore.set(formName + fieldName, value)
    this.state = {
      value,
      meta,
      error: undefined,
      loading: false,
      submitting: false,
      touched: false
    }
  }
  componentDidMount () {
    this._updateValue = ({ value }) => {
      const valueIsDifferent = this.state.value !== value || !_.isEqual(this.state.value, value)
      if (valueIsDifferent) {
        this.setState({ value })
      }
    }
    this._updateField = ({ value, meta, error, loading, submitting, touched }) => {
      const valueIsDifferent = this.state.value !== value || !_.isEqual(this.state.value, value)
      const metaIsDifferent = !_.isEqual(this.state.meta, meta)
      const errorIsDifferent = this.state.error !== error
      const loadingIsDifferent = this.state.loading !== loading
      const submittingIsDifferent = this.state.submitting !== submitting
      const touchedIsDifferent = this.state.touched !== touched
      if (valueIsDifferent || metaIsDifferent || errorIsDifferent || loadingIsDifferent || submittingIsDifferent || touchedIsDifferent) {
        this.setState({
          value: valueIsDifferent ? value : this.state.value,
          meta: metaIsDifferent ? meta : this.state.meta,
          error: errorIsDifferent ? error : this.state.error,
          loading: loadingIsDifferent ? loading : this.state.loading,
          submitting: submittingIsDifferent ? submitting : this.state.submitting,
          touched: touchedIsDifferent ? touched : this.state.touched
        })
      }
    }
    this.updateValue({ value: this.props.value })
    this.register(this.props)
    this.subscribeField(this.props)
  }
  componentWillReceiveProps (nextProps) {
    const { formName, fieldName, value } = nextProps
    const { formName: prevFormName, fieldName: prevFieldName } = this.props
    if (formName !== prevFormName || fieldName !== prevFieldName) {
      this.unregister(this.props)
      this.register(nextProps)
      this.unsubscribeField(this.props)
      this.subscribeField(nextProps)
      initialValuesStore.set(formName + fieldName, value)
      this.updateValue({ value })
    }
  }
  componentDidUpdate () {
    this.changeInitialValue(this.props)
  }
  componentWillUnmount () {
    this._updateValue = undefined
    this._updateField = undefined
    this.unsubscribeField(this.props)
    this.unregister(this.props)
  }
  updateValue = ({ value }) => {
    this._updateValue && this._updateValue({ value })
  }
  updateField = ({ value, meta, error, loading, submitting, touched }) => {
    this._updateField && this._updateField({ value, meta, error, loading, submitting, touched })
  }
  subscribeField = (props) => {
    const { formName, fieldName, value } = props
    this.unsubscribeStore = this.store.subscribe((state) => {
      const field = selectors.getField(state, { formName, fieldName })
      if (field) {
        this.updateField(field)
      }
    })
    this.unsubscribeFieldValue = fieldValueSubscribers.subscribe(formName + fieldName, this.updateValue)
  }
  unsubscribeField = (props) => {
    const { formName, fieldName } = props
    this.unsubscribeFieldValue && this.unsubscribeFieldValue()
    this.unsubscribeFieldValue = undefined
    this.unsubscribeStore && this.unsubscribeStore()
    this.unsubscribeStore = undefined
  }
  changeInitialValue = (props) => {
    const { formName, fieldName, value, meta } = props
    const currentInitialValue = initialValuesStore.get(formName + fieldName)
    const initialValueHasChanged = currentInitialValue !== value && !_.isEqual(currentInitialValue, value)
    if (initialValueHasChanged) {
      initialValuesStore.set(formName + fieldName, value)
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
    fieldValueSubscribers.notifySubscribers(formName + fieldName, (updateValue) => {
      if (updateValue !== this.updateValue) {
        updateValue({ value })
      }
    })
    this.updateValue({ value })
    this.form.changeValue({ formName, fieldName, value })
  }

  _getFieldProps = () => {
    const { render, component, validate, stayRegistered, ...rest } = this.props
    const nextProps = {
      changeValue: this.changeValue,
      initialValue: initialValuesStore.get(this.props.formName + this.props.fieldName),
      ...rest,
      ...this.state
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
