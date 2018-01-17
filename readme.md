# Slex Form

```
$ npm install slex-form
```

`react-slex-form` is a component driven form implementation for `react`. It is connected to `slex-store` via context through a `FormProvider` but usues a completely separate store from the rest of the application. Field updates are propagated via subscriptions to ensure only relevant UI is updated.

## Example Usage

### Creating form store

```javascript
import slexStore from 'slex-store'
import formReducer, { actionTypes as formActionTypes, middleware as formMiddleware, sideEffects as formSideEffects } from 'react-slex-form'

const createFormStore = () => {
  const store =
    slexStore.createStore(
      slexStore.createDispatch({
        reducer: slexStore.createReducer({
          form: formReducer
        }),
        middleware: [
          formMiddleware.validateFieldOnChangeValueMiddleware
        ],
        sideEffects: [
          formSideEffects.notifyFieldSubscribersOnFieldChangeSideEffect,
          formSideEffects.notifyFieldSubscribersOnFormChangeSideEffect,
          formSideEffects.notifyFormSubscribersOnChangeSideEffect
        ]
      })
    )
  return store
}

export default createFormStore
```

### Connecting form via FormProvider

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-slex-store'
import { FormProvider } from 'react-slex-form'
import { createApplicationStore, createFormStore } from 'react-slex-form'

const applicationStore = createApplicationStore()
const formStore = createFormStore()

applicationStore.subscribe(renderApp)

function renderApp () {
  ReactDOM.render((
    <Provider store={applicationStore}>
      <FormProvider store={formStore}>
        ...
      </FormProvider>
    </Provider>
  ), document.getElementById('...'))
}

```


### Registering forms using `<Field />` component

```javascript
import React, { Component } from 'react'
import { Field, connectForm, statuses as formStatuses, actions as formActions } from 'react-slex-form'

const formName = 'login'

const Form = (props) => {
  const { login, loading, submitting, canSubmit, submitError, resetForm } = this.props
  const login = () => submitForm(form => {
    const { username, password } = form
    return loginService.login({ username, password })
  })
  return (
    <div>
      <Field
        formName={formName}
        fieldName={'username'}
        render={TextInput}
      />
      <Field
        formName={formName}
        fieldName={'password'}
        render={TextInput}
      />
      <Button onClick={resetForm}>
        Reset
      </Button>
      <Button disabled={!canSubmit} onClick={login}>
        {submitting
          ? 'Logging in'
          : 'Login'
        }
      </Button>
      {submitError}
    </div>
  )
}

export default connectForm(formName)(Form)

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
