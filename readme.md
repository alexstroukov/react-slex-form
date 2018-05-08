[![CircleCI](https://circleci.com/gh/alexstroukov/react-slex-form.svg?style=svg)](https://circleci.com/gh/alexstroukov/react-slex-form)

# Slex Form

```
$ npm install slex-form
```

`react-slex-form` is a component driven form implementation for `react`. It is connected to `slex-store` via context through a `Provider` (`react-slex-store`). Field updates are propagated via subscriptions to ensure only relevant UI is updated.

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
        })
      })
    )
  return store
}

export default createFormStore
```

### Connecting form via Provider

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-slex-store'
import { FormProvider } from 'react-slex-form'
import { createApplicationStore, createFormStore } from 'react-slex-form'

const applicationStore = createApplicationStore()

applicationStore.subscribe(renderApp)

function renderApp () {
  ReactDOM.render((
    <Provider store={applicationStore}>
        ...
    </Provider>
  ), document.getElementById('...'))
}

```

### Creating a form

```javascript
import React, { Component } from 'react'
import { Field, connectForm, statuses as formStatuses, actions as formActions } from 'react-slex-form'

const formName = 'register'

const Form = (props) => {
  const { submitForm, loading, submitting, canSubmit, submitError, resetForm } = this.props
  const register = () => submitForm(form => {
    const { username, password } = form
    return registerService.register({ username, password })
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
      <Button disabled={!canSubmit} onClick={register}>
        {submitting
          ? 'Registering'
          : 'Register'
        }
      </Button>
      {submitError}
    </div>
  )
}

export default connectForm(formName)(Form)

```

### Creating an editable form

To create an editable from wrap your form in an `editable` higher order component. It provides two properties to your form: `editing` and `toggleEdit`. `toggleEdit` works in conjunction with connect form and also resets the form when going from editing to non editing state.

```javascript
import React, { Component } from 'react'
import { Field, connectForm, statuses as formStatuses, actions as formActions } from 'react-slex-form'

const formName = 'register'

const Form = (props) => {
  const { submitForm, loading, submitting, canSubmit, submitError, resetForm, editing, toggleEdit } = this.props
  const register = () => submitForm(form => {
    const { username, password } = form
    return registerService.register({ username, password })
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
      <Button onClick={toggleEdit}>
        {editing
          ? 'Editing'
          : 'Edit'
        }
      </Button>
      <Button disabled={!canSubmit} onClick={register}>
        {submitting
          ? 'Registering'
          : 'Register'
        }
      </Button>
      {submitError}
    </div>
  )
}

export default connectForm(formName)(editable(Form))

```


### Creating form with validation

You can validate field values by providing a `validator` function as a prop to `Field`. 

Validation supports both sync and async validators out of the box. A failed validation must return or resolve an `Error` for any invalid values. `(value, form) => Promise<Error|any> || Error|any`

```javascript
import React, { Component } from 'react'
import { Field, connectForm, statuses as formStatuses, actions as formActions } from 'react-slex-form'

const formName = 'register'

const validateRequired = (value, form) => {
  if (value) {
    return new Error('The value cannot be empty.')
  }
}

const validateUnique = (value, form) => {
  return validationService
    .validateUsernameInUse(value)
    .then(usernameIsInUse => {
      if (usernameIsInUse) {
        return new Error('The username is already taken.')
      }
    })
}

const Form = (props) => {
  const { submitForm, loading, submitting, canSubmit, submitError, resetForm } = this.props
  const register = () => submitForm(form => {
    const { username, password } = form
    return registerService.register({ username, password })
  })
  return (
    <div>
      <Field
        formName={formName}
        fieldName={'username'}
        validate={validateUnique}
        render={TextInput}
      />
      <Field
        formName={formName}
        fieldName={'password'}
        validate={validateRequired}
        render={TextInput}
      />
      <Button onClick={resetForm}>
        Reset
      </Button>
      <Button disabled={!canSubmit} onClick={register}>
        {submitting
          ? 'Registering'
          : 'Register'
        }
      </Button>
      {submitError}
    </div>
  )
}

export default connectForm(formName)(Form)

```

## Function Reference

### Actions

`resetFormStore()` - sets store back to its initial state and clears all forms

`resetForm({ formName })` - resets a form back to its initial state

`resetField({ formName, fieldName })` - resets a field back to its initial state

`changeValue ({ formName, fieldName, value, isSilent })` - updates value for form field. Using `isSilent` means the field will not change its `touched` value.
