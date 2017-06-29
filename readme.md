# Slex Router

```
$ npm install slex-router
```

`react-slex-form` is a component driven router implementation for `react`. It is connected to `slex-store` via `react-slex-store` and its state is kept in its own store similar to `redux-form`.

Sync and async validation is built into the value change workflow by default.

1. A form value starts of in INITIAL status

2. Update value sets status to VALIDATING

3. Validation is run. Field is set to either VALID or INVALID. Validation messages are passed to FIELD

## Example Usage

### 1. Connect to store

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import createStore from 'slex-store'
import { Provider } from 'react-slex-store'
import form from 'react-slex-form'

const store = createStore({
  reducers: {
    form
  }
})

```

### Using in a form

Rendering the field component automatically registers the field against the form in the `slex-store`. To prevent fields from being unregistered when they are unmmounted use the `stayRegistered` prop.

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import createStore from 'slex-store'
import { Provider } from 'react-slex-store'
import form from 'react-slex-form'

class Form extends Component {

  _renderField ({ formName, fieldName, value, status, changeValue, isLoading, isTouched, messages }) {
   return (
     ...
   ) 
  }

  render () {
    // for how to submit form see example below
    const { canSubmit, submitting, submitForm } = this.props
    return (
      <Field
        formName='loginForm'
        fieldName={'username'}
        render={this._renderField}
        validate={validateUsername}
      />
      <Button disabled={!canSubmit || submitting} onClick={submitForm} />
    )
  }
}
```

## Submitting form

To submit the form you will need to connect to `slex-store` and dispatch `submitForm`. `submitForm` accepts a callback `(form) => Promise<any>` which allows you to perform an asynchronous submit. Its good practice to also dispatch `resetForm` upon successful form submission.

```javascript
import _ from 'lodash'
import Form from './Form'
import { statuses as formStatuses, actions as formActions } from 'react-slex-form'
import { connect } from 'react-slex-store'

export default connect((dispatch, getState, ownProps) => {
  const {
    form: {
      loginForm: {
        status: loginFormStatus
      } = {}
    }
  } = getState()
  const canSubmit = loginFormStatus === formStatuses.VALID
  const submitting = loginFormStatus === formStatuses.VALIDATING || loggingIn

  const submitForm = () => {
    return dispatch(formActions.submitForm('loginForm', form => {
      const { username, password } = form
      return login({ username, password })
        .then(() => {
          return dispatch(formActions.resetForm({ formName: 'loginForm' }))
        })
    }))
  }
 
  return {
    ...ownProps,
    canSubmit,
    submitForm,
    submitting
  }
})(Form)

```


## Field Validation

You can validate field values by providing a validate function to `Field`. It can be be sync or async and resolve `Error` for any invalid values `(value, form) => Promise<Error|any> || Error|any`

```
<Field validate={validateUsername} formName={formName} fieldName={fieldName} />
```

## Useful middleware

### Resetting form store upon logout

Usually when a user logs out out want to reset your stores back to their initial states. In `react-slex-form` you can dispatch `resetFormStore`.

```javascript
import { actions as formActions } from 'react-slex-form'

function resetFormStoreOnLogoutMiddleware (dispatch, getState, action) {
  const { type: actionType } = action
  if (actionType === 'LOGOUT') {
    dispatch(formActions.resetFormStore())
  }
}
```

## Function Reference

### Actions

`resetFormStore()` - sets store back to its initial state and clears all forms

`submitForm(formName, submitCallback)` - validates all form fields before resolving with the result of `submitCallback`

`validateForm({ formName })` - validates all form fields

`resetForm({ formName })` - resets a form back to its initial state

`resetField({ formName, fieldName })` - resets a field back to its initial state

`changeValue ({ formName, fieldName, value, isSilent })` - updates value for form field. Using `isSilent` means the field will not change its `isTouched` value.
