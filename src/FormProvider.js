import PropTypes from 'prop-types'
import { connect } from 'react-slex-store'
import actions from './form.actions'
import * as actionTypes from './form.actionTypes'
import reducers from './form.reducers'
import selectors from './form.selectors'
import React, { Component, Children } from 'react'

export class FormProvider extends Component {
  static state = {}
  forms = this.props.forms || {}
  subscribers = {}
  getChildContext () {
    return {
      formContext: {
        subscribe: this.subscribe,
        dispatch: this.dispatch,
        getState: this.getState
      }
    }
  }
  subscribe = ({ formName, fieldName, callback }) => {
    const formSubscribers = this.subscribers[formName] || {}
    const fieldSubscribers = formSubscribers[fieldName] || []
    this.subscribers = {
      ...this.subscribers,
      [formName]: {
        ...formSubscribers,
        [fieldName]: [
          ...fieldSubscribers,
          callback
        ]
      }
    }
    return () => {
      const formSubscribers = this.subscribers[formName] || {}
      const fieldSubscribers = formSubscribers[fieldName] || []
      const index = fieldSubscribers.indexOf(callback)      
      if (index !== -1) {
        const nextFieldSubscribers = [ ...fieldSubscribers.slice(0, index), ...fieldSubscribers.slice(index + 1)]
        this.subscribers = {
          ...this.subscribers,
          [formName]: {
            ...formSubscribers,
            [fieldName]: nextFieldSubscribers
          }
        }
      }
    }
  }
  dispatch = (action) => {
    const appliedAction = this._createApplyMiddleware()(action)
    const prevState = FormProvider.state
    const nextState = this.reduceForm(prevState, appliedAction)
    this._createApplySideEffects()({ prevState, nextState, action: appliedAction })
    FormProvider.state = nextState
    return appliedAction
  }
  getState = () => {
    return FormProvider.state
  }
  _createApplySideEffects = _.once(() => {
    return _.chain([
        this.notifySubscribersOnChangeValueSideEffect
      ])
      .concat(this.props.sideEffects)
      .filter(_.isFunction)
      .reduce((memo, sideEffect) => {
        return ({ prevState, nextState, action }) => {
          sideEffect({ prevState, nextState, action, dispatch: this.dispatch })
          memo({ prevState, nextState, action, dispatch: this.dispatch })
        }
      }, _.noop)
      .value()
  })
  _createApplyMiddleware = _.once(() => {
    return _.chain([
        this.submitFormMiddleware,
        this.validateFieldOnChangeValueMiddleware
      ])
      .concat(this.props.middleware)
      .filter(_.isFunction)
      .map(middlewareFn => _.chain(middlewareFn)
        .partial(this.dispatch, this.getState)
        .wrap((func, action) => {
          const appliedAction = func(action)
          if (appliedAction && !appliedAction.then) {
            return appliedAction
          } else {
            return action
          }
        })
        .value()
      )
      .thru(middlewareFns => _.flow(middlewareFns))
      .value()
  })
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
      const validateField = _.get(this.forms, `${formName}.validators.${field.validate}`)
      if (validateField) {
        return Promise
          .resolve(validateField(field.value, form))
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
  updateField = ({ formName, fieldName, field }) => {
    const subscribers = _.get(this.subscribers, `${formName}.${fieldName}`, [])
    for (const subscriber of subscribers) {
      subscriber({ field })
    }
  }
  notifySubscribersOnChangeValueSideEffect = ({ nextState, action }) => {
    if (action.type === actionTypes.CHANGE_VALUE) {
      const { formName, fieldName } = action
      const field = selectors.getField(nextState, { formName, fieldName })
      this.updateField({ formName, fieldName, field })
    }
  }
  submitFormMiddleware = (dispatch, getState, action) => {
    if (action.type === actionTypes.SUBMIT_FORM) {
      const { formName } = action
      const form = _.get(getState(), `form.${formName}`)
      const submitServiceFn = _.get(this.forms, `${formName}.submit`)
      const canSubmit = form.status === statuses.VALID
      if (canSubmit) {
        return this._validateForm({ formName, form })
          .then(validationErrors => {
            if (_.isEmpty(validationErrors)) {
              const formValues = _.chain(form)
                .omit(['error', 'status']) 
                .map(({ value }, fieldName) => ({ fieldName, value }))
                .reduce((memo, { fieldName, value }) => ({ ...memo, [fieldName]: value }), {})
                .value()
              return Promise
                .resolve(submitServiceFn(formValues, getState))
                .then(result => {
                  dispatch(actions.submitFormSuccess({ formName, result }))
                })
                .catch(error => {
                  dispatch(actions.submitFormFail({ formName, error: error.message }))
                })
            } else {
              dispatch(actions.submitFormFail({ formName, validationErrors }))
            }
          })
          .catch(error => {
            dispatch(actions.submitFormFail({ formName, error: error.message }))
          })
      }
    }
  }
  validateFieldOnChangeValueMiddleware = (dispatch, getState, action) => {
    if (action.type === actionTypes.CHANGE_VALUE) {
      const { formName, fieldName, value } = action
      const [ form, validate, status ] = _.chain(getState())
        .at([
          `form.${formName}`,
          `form.${formName}.${fieldName}.validate`,
          `form.${formName}.${fieldName}.status`
        ])
        .value()
      const validateField = _.get(this.forms, `${formName}.validators.${validate}`)
      if (validateField) {
        return Promise
          .resolve(validateField(value, form))
          .then(validationResult => {
            const currentValue = _.get(getState(), `form.${formName}.${fieldName}.value`)
            const currentStatus = _.get(getState(), `form.${formName}.${fieldName}.status`)
            if (currentValue === value && currentStatus !== statuses.INITIAL) {
              if (_.isError(validationResult)) {
                dispatch(actions.isInvalid({ formName, fieldName, error: validationResult.message }))
              } else {
                dispatch(actions.isValid({ formName, fieldName }))
              }
            }
          })
          .catch(error => {
            const currentValue = _.get(getState(), `form.${formName}.${fieldName}.value`)
            const currentStatus = _.get(getState(), `form.${formName}.${fieldName}.status`)
            if (currentValue === value && currentStatus !== statuses.INITIAL) {
              dispatch(actions.isInvalid({ formName, fieldName, error: error.message }))
            }
          })
      }
    }
  }
  reduceForm = (state, action) => {
    switch (action.type) {
      case actionTypes.RESET_FORM_STORE:
        return reducers.resetFormStore(state, action)
      case actionTypes.SUBMIT_FORM:
        return reducers.submitForm(state, action)
      case actionTypes.SUBMIT_FORM_SUCCESS:
        return reducers.submitFormSuccess(state, action)
      case actionTypes.SUBMIT_FORM_FAIL:
        return reducers.submitFormFail(state, action)
      case actionTypes.CHANGE_VALUE:
        return reducers.changeValue(state, action)
      case actionTypes.REGISTER_FIELD:
        return reducers.registerField(state, action)
      case actionTypes.UNREGISTER_FIELD:
        return reducers.unregisterField(state, action)
      case actionTypes.RESET_FIELD:
        return reducers.resetField(state, action)
      case actionTypes.RESET_FORM:
        return reducers.resetForm(state, action)
      case actionTypes.CHANGE_INITIAL_VALUE:
        return reducers.changeInitialValue(state, action)
      case actionTypes.IS_VALID:
        return reducers.isValid(state, action)
      case actionTypes.IS_INVALID:
        return reducers.isInvalid(state, action)
      case actionTypes.UPDATE_META:
        return reducers.updateMeta(state, action)
      default:
        return state
    }
  }
  render () {
    return Children.only(this.props.children)
  }
}

FormProvider.propTypes = {
  forms: PropTypes.object,
  middleware: PropTypes.array,
  sideEffects: PropTypes.array,
  children: PropTypes.element.isRequired
}

FormProvider.childContextTypes = {
  formContext: PropTypes.object
}

export default FormProvider
