# Slex Form

```
$ npm install slex-form
```

`react-slex-form` is a component driven form implementation for `react`. It is connected to `slex-store` via `react-slex-store` and its state is kept in its own store similar to `redux-form`.

## Example Usage

### Adding to store

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import slexStore from 'slex-store'
import form, { createFormMiddleware } from 'react-slex-form'

const formMiddleware = createFormMiddleware({
  forms: {
    formName: {
      submit: function formSubmitFunction (formValues) {
        // do async submission here
        return Promise.resolve('Returning a promise will wait until submitter completes before dispatching submitFormSuccess or submitFormFail actions')
      },
      validators: {
        validate1: function forceValidateFail (value, form) {
          return new Error('Return Error object when validation fails')
        },
        validate2: function forceValidatePass (value, form) {
          return 'Return anything else when validation resolves with no errors'
        }
      }
    }
  }
})

const store =
  slexStore.createStore(
    slexStore.createDispatch({
      reducer: slexStore.createReducer({
        form
      }),
      middleware: [
        formMiddleware.submitFormMiddleware,
        formMiddleware.validateFieldOnChangeValueMiddleware
      ]
    })
  )

```

Rendering the field component automatically registers the field against the form in the `slex-store`. To prevent fields from being unregistered when they are unmmounted use the `stayRegistered` prop. Submitting the form will asynchronously run the registered form `submitter`


```javascript
import React, { Component } from 'react'
import { Field, statuses as formStatuses, actions as formActions } from 'react-slex-form'
import { connect } from 'react-slex-store'

class Form extends Component {
  _renderField ({ formName, fieldName, value, status, changeValue, loading, submitting, touched, messages }) {
   return (
     ...
   ) 
  }

  render () {
    const { submitForm } = this.props
    return (
      <Field
        formName='formName'
        fieldName={'fieldName'}
        render={this._renderField}
        validate={'validate1'}
      />
      <Button disabled={loading || submitting} onClick={submitForm} />
    )
  }
}

export default connect((dispatch, getState, ownProps) => {
  const {
    form: {
      loginForm: {
        status: loginFormStatus
      } = {}
    }
  } = getState()
  const canSubmit = loginFormStatus === formStatuses.VALID
  const submitting = loginFormStatus === formStatuses.SUBMITTING
  const validating = loginFormStatus === formStatuses.VALIDATING
  const submitForm = () => {
    dispatch(formActions.submitForm('loginForm'))
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

You can validate field values by providing a key for a `validator` to `Field`. It can be be sync or async and resolve `Error` for any invalid values `(value, form) => Promise<Error|any> || Error|any`

```
<Field validate={'validateUsername'} formName={formName} fieldName={fieldName} />
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

`submitForm({ formName })` - revalidates and submits form using validators and submitters

`resetForm({ formName })` - resets a form back to its initial state

`resetField({ formName, fieldName })` - resets a field back to its initial state

`changeValue ({ formName, fieldName, value, isSilent })` - updates value for form field. Using `isSilent` means the field will not change its `touched` value.
