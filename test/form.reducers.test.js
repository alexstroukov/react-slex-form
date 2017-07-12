import { expect } from 'chai'
import sinon from 'sinon'
import formReducers from '../src/form.reducers'
import * as formActionTypes from '../src/form.actionTypes'
import * as formStatuses from '../src/form.statuses'

describe('form.reducers', function () {
  describe('validating', function () {
    const state = {
      testForm: {
        testField: {}
      }
    }
    it('should return a new state', function () {
      const action = { formName: 'testForm', fieldName: 'testField' }
      const nextState = formReducers.validating(state, action)
      expect(state).to.not.equal(nextState)
    })
    it('should set the form to validating', function () {
      const action = { formName: 'testForm', fieldName: 'testField' }
      const nextState = formReducers.validating(state, action)
      expect(nextState.testForm.status).to.equal(formStatuses.VALIDATING)
    })
    it('should set the field to validating', function () {
      const action = { formName: 'testForm', fieldName: 'testField' }
      const nextState = formReducers.validating(state, action)
      expect(nextState.testForm.testField.status).to.equal(formStatuses.VALIDATING)
    })
  })
  describe('updateValue', function () {
    const state = {
      testForm: {
        testField: {}
      }
    }
    it('should return a new state', function () {
      const action = { formName: 'testForm', fieldName: 'testField', value: 'testValue' }
      const nextState = formReducers.updateValue(state, action)
      expect(state).to.not.equal(nextState)
    })
    it('should set the form to validating', function () {
      const action = { formName: 'testForm', fieldName: 'testField', value: 'testValue' }
      const nextState = formReducers.updateValue(state, action)
      expect(nextState.testForm.status).to.equal(formStatuses.VALIDATING)
    })
    it('should set the field to validating', function () {
      const action = { formName: 'testForm', fieldName: 'testField', value: 'testValue' }
      const nextState = formReducers.updateValue(state, action)
      expect(nextState.testForm.testField.status).to.equal(formStatuses.VALIDATING)
    })
    it('should set the field to touched', function () {
      const action = { formName: 'testForm', fieldName: 'testField', value: 'testValue' }
      const nextState = formReducers.updateValue(state, action)
      expect(nextState.testForm.testField.isTouched).to.equal(true)
    })

    describe('given that the isSilent param is true', function () {
      it('should keep the current isTouched', function () {
        const state = {
          testForm: {
            testField: {
              isTouched: 'existingIsTouched'
            }
          }
        }
        const action = { formName: 'testForm', fieldName: 'testField', value: 'testValue', isSilent: true }
        const nextState = formReducers.updateValue(state, action)
        expect(nextState.testForm.testField.isTouched).to.equal(state.testForm.testField.isTouched)
      })
    })
  })
  describe('registerField', function () {
    it('should return a new state', function () {
      const state = {
        testForm: {}
      }
      const action = { formName: 'testForm', fieldName: 'testField', value: 'testValue', validate: () => {} }
      const nextState = formReducers.registerField(state, action)
      expect(state).to.not.equal(nextState)
    })

    it('should keep the other existing form fields', function () {
      const state = {
        testForm: {
          existingField: {}
        }
      }
      const action = { formName: 'testForm', fieldName: 'testField', value: 'testValue', validate: () => {} }
      const nextState = formReducers.registerField(state, action)
      expect(nextState.testForm.existingField).to.equal(state.testForm.existingField)
    })

    describe('given the form is not yet registered', function () {
      const state = {}
      it('should create the form on the state', function () {
        const action = { formName: 'testForm', fieldName: 'testField', value: 'testValue', validate: () => {} }
        const nextState = formReducers.registerField(state, action)
        expect(nextState.testForm).to.exist
        expect(nextState.testForm).to.be.a('object')
      })
      it('should set the form status to INITIAL', function () {
        const action = { formName: 'testForm', fieldName: 'testField', value: 'testValue', validate: () => {} }
        const nextState = formReducers.registerField(state, action)
        expect(nextState.testForm.status).to.equal(formStatuses.INITIAL)
      })
    })

    describe('given the field is not yet registered', function () {
      const state = {
        testForm: {}
      }
      it('should create the field on the form', function () {
        const action = { formName: 'testForm', fieldName: 'testField', value: 'testValue', validate: () => {} }
        const nextState = formReducers.registerField(state, action)
        expect(nextState.testForm[action.fieldName]).to.exist
        expect(nextState.testForm[action.fieldName]).to.be.a('object')
      })
      it('should set the field status to INITIAL', function () {
        const action = { formName: 'testForm', fieldName: 'testField', value: 'testValue', validate: () => {} }
        const nextState = formReducers.registerField(state, action)
        expect(nextState.testForm[action.fieldName].status).to.equal(formStatuses.INITIAL)
      })
      it('should set the field isTouched to false', function () {
        const action = { formName: 'testForm', fieldName: 'testField', value: 'testValue', validate: () => {} }
        const nextState = formReducers.registerField(state, action)
        expect(nextState.testForm[action.fieldName].isTouched).to.equal(false)
      })
      it('should set the field value to the value from the action', function () {
        const action = { formName: 'testForm', fieldName: 'testField', value: 'testValue', validate: () => {} }
        const nextState = formReducers.registerField(state, action)
        expect(nextState.testForm[action.fieldName].value).to.equal(action.value)
      })
      it('should set the field initialValue to the value from the action', function () {
        const action = { formName: 'testForm', fieldName: 'testField', value: 'testValue', validate: () => {} }
        const nextState = formReducers.registerField(state, action)
        expect(nextState.testForm[action.fieldName].initialValue).to.equal(action.value)
      })
      it('should set the field validate to the validate from the action', function () {
        const action = { formName: 'testForm', fieldName: 'testField', value: 'testValue', validate: () => {} }
        const nextState = formReducers.registerField(state, action)
        expect(nextState.testForm[action.fieldName].validate).to.equal(action.validate)
      })
    })

    describe('given the field is already registered', function () {
      const state = {
        testForm: {
          testField: {
            status: 'existingStatus',
            isTouched: 'existingIsTouched',
            error: 'existingError'
          }
        }
      }
      it('should keep the existing fields status', function () {
        const action = { formName: 'testForm', fieldName: 'testField', value: 'testValue', validate: () => {} }
        const nextState = formReducers.registerField(state, action)
        expect(nextState.testForm[action.fieldName].status).to.equal(state.testForm[action.fieldName].status)
      })
      it('should keep the existing fields isTouched', function () {
        const action = { formName: 'testForm', fieldName: 'testField', value: 'testValue', validate: () => {} }
        const nextState = formReducers.registerField(state, action)
        expect(nextState.testForm[action.fieldName].isTouched).to.equal(state.testForm[action.fieldName].isTouched)
      })
      it('should keep the existing fields error', function () {
        const action = { formName: 'testForm', fieldName: 'testField', value: 'testValue', validate: () => {} }
        const nextState = formReducers.registerField(state, action)
        expect(nextState.testForm[action.fieldName].error).to.equal(state.testForm[action.fieldName].error)
      })
      it('should set the field value to the value from the action', function () {
        const action = { formName: 'testForm', fieldName: 'testField', value: 'testValue', validate: () => {} }
        const nextState = formReducers.registerField(state, action)
        expect(nextState.testForm[action.fieldName].value).to.equal(action.value)
      })
      it('should set the field initialValue to the value from the action', function () {
        const action = { formName: 'testForm', fieldName: 'testField', value: 'testValue', validate: () => {} }
        const nextState = formReducers.registerField(state, action)
        expect(nextState.testForm[action.fieldName].initialValue).to.equal(action.value)
      })
      it('should set the field validate to the validate from the action', function () {
        const action = { formName: 'testForm', fieldName: 'testField', value: 'testValue', validate: () => {} }
        const nextState = formReducers.registerField(state, action)
        expect(nextState.testForm[action.fieldName].validate).to.equal(action.validate)
      })
    })
  })
  describe('unregisterField', function () {
    describe('when the field is the only field on the form', function () {
      const state = {
        testForm: {
          testField: {
            status: 'existingStatus',
            isTouched: 'existingIsTouched',
            error: 'existingError'
          }
        }
      }
      it('should return a new state', function () {
        const action = { formName: 'testForm', fieldName: 'testField' }
        const nextState = formReducers.unregisterField(state, action)
        expect(state).to.not.equal(nextState)
      })
      it('should remove form from state', function () {
        const action = { formName: 'testForm', fieldName: 'testField' }
        const nextState = formReducers.unregisterField(state, action)
        expect(nextState.testForm).to.be.empty
      })
    })
    describe('when the field is is among other fields on the form', function () {
      const state = {
        testForm: {
          testField: {
            status: 'existingStatus',
            isTouched: 'existingIsTouched',
            error: 'existingError'
          },
          testField2: {
            status: 'existingStatus2',
            isTouched: 'existingIsTouched2',
            error: 'existingError2'
          }
        }
      }
      it('should return a new state', function () {
        const action = { formName: 'testForm', fieldName: 'testField' }
        const nextState = formReducers.unregisterField(state, action)
        expect(state).to.not.equal(nextState)
      })
      it('should remove field from state', function () {
        const action = { formName: 'testForm', fieldName: 'testField' }
        debugger
        const nextState = formReducers.unregisterField(state, action)
        expect(nextState.testForm.testField).to.equal(undefined)
      })
    })
  })

  describe('resetForm', function () {
    const state = {
      testForm: {
        testField: {
          validate: 'existingValidate',
          initialValue: 'existingInitialValue',
          error: 'existingError'
        }
      }
    }
    it('should return a new state', function () {
      const action = { formName: 'testForm' }
      const nextState = formReducers.resetForm(state, action)
      expect(state).to.not.equal(nextState)
    })
    it('should set the form status to initial', function () {
      const action = { formName: 'testForm' }
      const nextState = formReducers.resetForm(state, action)
      expect(nextState.testForm.status).to.equal(formStatuses.INITIAL)
    })
    it('should set the status of all the form fields to initial', function () {
      const action = { formName: 'testForm' }
      const nextState = formReducers.resetForm(state, action)
      expect(nextState.testForm.testField.status).to.equal(formStatuses.INITIAL)
    })
    it('should set the value of all the form fields to initialValue', function () {
      const action = { formName: 'testForm' }
      const nextState = formReducers.resetForm(state, action)
      expect(nextState.testForm.testField.value).to.equal(state.testForm.testField.initialValue)
    })
    it('should set the isTouched of all the form fields to false', function () {
      const action = { formName: 'testForm' }
      const nextState = formReducers.resetForm(state, action)
      expect(nextState.testForm.testField.isTouched).to.equal(false)
    })
    it('should keep the same validate of all the form fields', function () {
      const action = { formName: 'testForm' }
      const nextState = formReducers.resetForm(state, action)
      expect(nextState.testForm.testField.validate).to.equal(state.testForm.testField.validate)
    })
    it('should keep the same initialValue of all the form fields', function () {
      const action = { formName: 'testForm' }
      const nextState = formReducers.resetForm(state, action)
      expect(nextState.testForm.testField.initialValue).to.equal(state.testForm.testField.initialValue)
    })
    it('should clear the error of all the form fields', function () {
      const action = { formName: 'testForm' }
      const nextState = formReducers.resetForm(state, action)
      expect(nextState.testForm.testField.error).to.equal(undefined)
    })
  })

  describe('resetField', function () {
    const state = {
      testForm: {
        testField: {
          validate: 'existingValidate',
          initialValue: 'existingInitialValue',
          error: 'existingError'
        }
      }
    }
    it('should return a new state', function () {
      const action = { formName: 'testForm', fieldName: 'testField' }
      const nextState = formReducers.resetField(state, action)
      expect(state).to.not.equal(nextState)
    })
    it('should set the field status to INITIAL', function () {
      const action = { formName: 'testForm', fieldName: 'testField' }
      const nextState = formReducers.resetField(state, action)
      expect(nextState.testForm.testField.status).to.equal(formStatuses.INITIAL)
    })
    it('should set the field isTouched to false', function () {
      const action = { formName: 'testForm', fieldName: 'testField' }
      const nextState = formReducers.resetField(state, action)
      expect(nextState.testForm.testField.isTouched).to.equal(false)
    })
    it('should set the field value to its initialValue', function () {
      const action = { formName: 'testForm', fieldName: 'testField' }
      const nextState = formReducers.resetField(state, action)
      expect(nextState.testForm.testField.value).to.equal(state.testForm.testField.initialValue)
    })
    it('should keep the same validate on the field', function () {
      const action = { formName: 'testForm', fieldName: 'testField' }
      const nextState = formReducers.resetField(state, action)
      expect(nextState.testForm.testField.validate).to.equal(state.testForm.testField.validate)
    })
    it('should keep the same initialValue on the field', function () {
      const action = { formName: 'testForm', fieldName: 'testField' }
      const nextState = formReducers.resetField(state, action)
      expect(nextState.testForm.testField.initialValue).to.equal(state.testForm.testField.initialValue)
    })
    it('should clear the field error', function () {
      const action = { formName: 'testForm', fieldName: 'testField' }
      const nextState = formReducers.resetField(state, action)
      expect(nextState.testForm.testField.error).to.equal(undefined)
    })
    describe('given the form has no other fields', function () {
      const state = {
        testForm: {
          testField: {
            error: 'existingError'
          }
        }
      }
      it('should set the form status to INITIAL', function () {
        const action = { formName: 'testForm', fieldName: 'testField' }
        const nextState = formReducers.resetField(state, action)
        expect(nextState.testForm.status).to.equal(formStatuses.INITIAL)
      })
    })
    describe('given the form has other fields which are validating', function () {
      const state = {
        testForm: {
          otherField: {
            status: formStatuses.VALIDATING
          },
          testField: {}
        }
      }
      it('should set the form status to VALIDATING', function () {
        const action = { formName: 'testForm', fieldName: 'testField' }
        const nextState = formReducers.resetField(state, action)
        expect(nextState.testForm.status).to.equal(formStatuses.VALIDATING)
      })
    })
    describe('given the form has other fields which are invalid', function () {
      const state = {
        testForm: {
          otherField: {
            status: formStatuses.INVALID
          },
          testField: {}
        }
      }
      it('should set the form status to INVALID', function () {
        const action = { formName: 'testForm', fieldName: 'testField' }
        const nextState = formReducers.resetField(state, action)
        expect(nextState.testForm.status).to.equal(formStatuses.INVALID)
      })
    })
    describe('given the form has other fields which are valid', function () {
      const state = {
        testForm: {
          otherField: {
            status: formStatuses.VALID
          },
          testField: {}
        }
      }
      it('should set the form status to VALID', function () {
        const action = { formName: 'testForm', fieldName: 'testField' }
        const nextState = formReducers.resetField(state, action)
        expect(nextState.testForm.status).to.equal(formStatuses.VALID)
      })
    })
    describe('given the other form fields are initial', function () {
      const state = {
        testForm: {
          otherField: {
            status: formStatuses.INITIAL
          },
          testField: {}
        }
      }
      it('should set the form status to INITIAL', function () {
        const action = { formName: 'testForm', fieldName: 'testField' }
        const nextState = formReducers.resetField(state, action)
        expect(nextState.testForm.status).to.equal(formStatuses.INITIAL)
      })
    })
  })
  describe('updateInitialValue', function () {
    const state = {
      testForm: {
        testField: {
          initialValue: 'existingInitialValue'
        }
      }
    }
    it('should return a new state', function () {
      const action = { formName: 'testForm', fieldName: 'testField', value: 'testNextInitialValue' }
      const nextState = formReducers.updateInitialValue(state, action)
      expect(state).to.not.equal(nextState)
    })
    it('should change initialValue on the field to the given value', function () {
      const action = { formName: 'testForm', fieldName: 'testField', value: 'testNextInitialValue' }
      const nextState = formReducers.updateInitialValue(state, action)
      expect(nextState.testForm.testField.initialValue).to.equal(action.value)
    })
    describe('given that the field has not been touched', function () {
      const state = {
        testForm: {
          testField: {
            initialValue: 'existingInitialValue',
            isTouched: false
          }
        }
      }
      it('should change value on the field to the given value', function () {
        const action = { formName: 'testForm', fieldName: 'testField', value: 'testNextInitialValue' }
        const nextState = formReducers.updateInitialValue(state, action)
        expect(nextState.testForm.testField.value).to.equal(action.value)
      })
    })
    describe('given that the field has been touched', function () {
      const state = {
        testForm: {
          testField: {
            initialValue: 'existingInitialValue',
            isTouched: true,
            value: 'existingValue'
          }
        }
      }
      it('should change not value on the field', function () {
        const action = { formName: 'testForm', fieldName: 'testField', value: 'testNextInitialValue' }
        const nextState = formReducers.updateInitialValue(state, action)
        expect(nextState.testForm.testField.value).to.equal(state.testForm.testField.value)
      })
    })
  })
  describe('isValid', function () {
    const state = {
      testForm: {
        testField: {
          error: 'existingError'
        }
      }
    }
    it('should return a new state', function () {
      const action = { formName: 'testForm', fieldName: 'testField' }
      const nextState = formReducers.isValid(state, action)
      expect(state).to.not.equal(nextState)
    })

    it('should set the field status to VALID', function () {
      const action = { formName: 'testForm', fieldName: 'testField' }
      const nextState = formReducers.isValid(state, action)
      expect(nextState.testForm.testField.status).to.equal(formStatuses.VALID)
    })
    it('should clear the field error', function () {
      const action = { formName: 'testForm', fieldName: 'testField' }
      const nextState = formReducers.isValid(state, action)
      expect(nextState.testForm.testField.error).to.equal(undefined)
    })

    describe('given the form has no other fields', function () {
      const state = {
        testForm: {
          testField: {
            error: 'existingError'
          }
        }
      }
      it('should set the form status to VALID', function () {
        const action = { formName: 'testForm', fieldName: 'testField' }
        const nextState = formReducers.isValid(state, action)
        expect(nextState.testForm.status).to.equal(formStatuses.VALID)
      })
    })

    describe('given the form has other fields which are validating', function () {
      const state = {
        testForm: {
          otherField: {
            status: formStatuses.VALIDATING
          },
          testField: {
            error: 'existingError'
          }
        }
      }
      it('should set the form status to VALIDATING', function () {
        const action = { formName: 'testForm', fieldName: 'testField' }
        const nextState = formReducers.isValid(state, action)
        expect(nextState.testForm.status).to.equal(formStatuses.VALIDATING)
      })
    })
    describe('given the form has other fields which are invalid', function () {
      const state = {
        testForm: {
          otherField: {
            status: formStatuses.INVALID
          },
          testField: {
            error: 'existingError'
          }
        }
      }
      it('should set the form status to INVALID', function () {
        const action = { formName: 'testForm', fieldName: 'testField' }
        const nextState = formReducers.isValid(state, action)
        expect(nextState.testForm.status).to.equal(formStatuses.INVALID)
      })
    })
    describe('given that all the other form fields are either valid or initial', function () {
      const state = {
        testForm: {
          otherField: {
            status: formStatuses.VALID
          },
          testField: {
            error: 'existingError'
          }
        }
      }
      it('should set the form status to VALID', function () {
        const action = { formName: 'testForm', fieldName: 'testField' }
        const nextState = formReducers.isValid(state, action)
        expect(nextState.testForm.status).to.equal(formStatuses.VALID)
      })
    })
  })
  describe('isInvalid', function () {
    const state = {
      testForm: {
        testField: {}
      }
    }
    it('should return a new state', function () {
      const action = { formName: 'testForm', fieldName: 'testField', error: new Error() }
      const nextState = formReducers.isInvalid(state, action)
      expect(state).to.not.equal(nextState)
    })

    it('should set the field status to INVALID', function () {
      const action = { formName: 'testForm', fieldName: 'testField', error: new Error() }
      const nextState = formReducers.isInvalid(state, action)
      expect(nextState.testForm.testField.status).to.equal(formStatuses.INVALID)
    })

    it('should set the field error to the error from the action', function () {
      const action = { formName: 'testForm', fieldName: 'testField', error: new Error() }
      const nextState = formReducers.isInvalid(state, action)
      expect(nextState.testForm.testField.error).to.equal(action.error)
    })
    describe('given the form has no other fields', function () {
      const state = {
        testForm: {
          testField: {
            error: 'existingError'
          }
        }
      }
      it('should set the form status to INVALID', function () {
        const action = { formName: 'testForm', fieldName: 'testField', error: new Error() }
        const nextState = formReducers.isInvalid(state, action)
        expect(nextState.testForm.status).to.equal(formStatuses.INVALID)
      })
    })
    describe('given the form has other fields which are validating', function () {
      const state = {
        testForm: {
          otherField: {
            status: formStatuses.VALIDATING
          },
          testField: {
            error: 'existingError'
          }
        }
      }
      it('should set the form status to VALIDATING', function () {
        const action = { formName: 'testForm', fieldName: 'testField', error: new Error() }
        const nextState = formReducers.isInvalid(state, action)
        expect(nextState.testForm.status).to.equal(formStatuses.VALIDATING)
      })
    })
    describe('given that the form hasnt got any fields which are validating', function () {
      const state = {
        testForm: {
          otherField: {
            status: formStatuses.INVALID
          },
          testField: {
            error: 'existingError'
          }
        }
      }
      it('should set the form status to INVALID', function () {
        const action = { formName: 'testForm', fieldName: 'testField', error: new Error() }
        const nextState = formReducers.isInvalid(state, action)
        expect(nextState.testForm.status).to.equal(formStatuses.INVALID)
      })
    })
  })
})
