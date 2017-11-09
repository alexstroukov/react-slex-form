import PropTypes from 'prop-types'
import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-slex-store'
import actions from './form.actions'
import * as statuses from './form.statuses'

class Field extends Component {
  componentDidMount () {
    this.register(this.props)
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
  }
  changeInitialValue = (props) => {
    const { formName, fieldName, componentInitialValue, meta, changeInitialValue, initialValue } = props
    const shouldChangeInitialValue = !_.isEqual(initialValue, componentInitialValue)
    if (shouldChangeInitialValue) {
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
  render () {
    const { render, ...rest } = this.props
    return render
      ? render({ ..._.omit(rest, 'register', 'unregister', 'validate', 'changeInitialValue', 'shouldChangeInitialValue') })
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

  validate: PropTypes.string,
  render: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
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

// import PropTypes from 'prop-types'
// import React, { Component } from 'react'
// import _ from 'lodash'
// import { connect } from 'react-slex-store'
// import actions from './form.actions'
// import * as statuses from './form.statuses'

// class Field extends Component {

//   componentDidMount () {
//     const { register } = this.props
//     register()
//   }

//   componentWillReceiveProps (nextProps) {
//     const { register, formName, fieldName } = nextProps
//     const { formName: prevFormName, fieldName: prevFieldName } = this.props
//     if (formName !== prevFormName || fieldName !== prevFieldName) {
//       register()
//     }
//   }

//   componentDidUpdate (nextProps) {
//     const { changeInitialValue } = this.props
//     changeInitialValue()
//   }

//   componentWillUnmount () {
//     const { unregister, stayRegistered } = this.props
//     if (!stayRegistered) {
//       unregister()
//     }
//   }

//   render () {
//     const { render, ...rest } = this.props
//     return render
//       ? render({ ..._.omit(rest, 'register', 'unregister', 'validate', 'changeInitialValue') })
//       : null
//   }
// }

// Field.propTypes = {
//   value: PropTypes.object,
//   stayRegistered: PropTypes.bool,
//   loading: PropTypes.bool.isRequired,
//   touched: PropTypes.bool.isRequired,
//   formName: PropTypes.string.isRequired,
//   fieldName: PropTypes.string.isRequired,
//   value: PropTypes.any,
//   messages: PropTypes.arrayOf(PropTypes.string),
//   status: PropTypes.string.isRequired,
//   changeValue: PropTypes.func.isRequired,

//   validate: PropTypes.string,
//   render: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
//   changeInitialValue: PropTypes.func.isRequired,
//   register: PropTypes.func.isRequired,
//   unregister: PropTypes.func.isRequired
// }

// export { Field }

// export default connect((dispatch, getState, ownProps) => {
//   const { formName, fieldName, value: componentInitialValue, validate, meta: componentInitialMeta } = ownProps
//   const { value, status, touched, initialValue, loading, messages, meta, submitting } = getField()
//   const register = () => {
//     const fieldIsRegistered = _.chain(getState())
//       .has(`form.${formName}.${fieldName}`)
//       .value()
//     if (!fieldIsRegistered) {
//       dispatch(actions.registerField({ formName, fieldName, value: componentInitialValue, validate, meta: componentInitialMeta }))
//     }
//   }
//   const unregister = () => dispatch(actions.unregisterField({ formName, fieldName }))
//   const changeValue = nextValue => dispatch(actions.changeValue({ formName, fieldName, value: nextValue }))
//   const changeInitialValue = () => {
//     const [ initialValue, valueInStore ] = _.at(getState(), [
//       `form.${formName}.${fieldName}.initialValue`,
//       `form.${formName}.${fieldName}.value`
//     ])
//     if (_.isEqual(initialValue, valueInStore) && !_.isEqual(initialValue, componentInitialValue)) {
//       dispatch(actions.changeInitialValue({ formName, fieldName, value: componentInitialValue, meta: componentInitialMeta }))
//     }
//   }

//   return {
//     ...ownProps,
//     meta,
//     register,
//     unregister,
//     changeValue,
//     changeInitialValue,
//     value,
//     status,
//     messages,
//     touched,
//     loading,
//     submitting
//   }

//   function getField () {
//     return _.chain(getState())
//       .at([
//         `form.${formName}.${fieldName}.value`,
//         `form.${formName}.${fieldName}.status`,
//         `form.${formName}.${fieldName}.error`,
//         `form.${formName}.${fieldName}.touched`,
//         `form.${formName}.${fieldName}.initialValue`,
//         `form.${formName}.${fieldName}.meta`,
//         `form.${formName}.status`
//       ])
//       .thru(([ value, status = statuses.INITIAL, error, touched = false, initialValue, meta = {}, formStatus ]) => {
//         const loading = status === statuses.VALIDATING
//         const submitting = formStatus === statuses.SUBMITTING
//         const messages = _.chain([error])
//           .flatten()
//           .reject(_.isUndefined)
//           .value() 
//         return {
//           meta,
//           messages,
//           loading,
//           submitting,
//           status,
//           error,
//           touched,
//           initialValue,
//           value: status === statuses.INITIAL
//             ? value || initialValue || componentInitialValue
//             : value
//         }
//       })
//       .value()
//   }
// })(Field)
