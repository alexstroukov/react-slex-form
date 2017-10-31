import { expect } from 'chai'
import sinon from 'sinon'
import formReducers from '../src/form.reducers'
import initialState from '../src/initialState'
import * as formActionTypes from '../src/form.actionTypes'
import * as formStatuses from '../src/form.statuses'

describe('form.reducers', function () {
  const sandbox = sinon.sandbox.create()
  beforeEach(function () {
    sandbox.restore()
  })

  afterEach(function () {
    sandbox.restore()
  })
  describe('submitForm', function () {
    const state = {
      testForm: {
        testField: {}
      }
    }
    const action = { formName: 'testForm' }
    it('should return a new state', function () {
      const nextState = formReducers.submitForm(state, action)
      expect(state).to.not.equal(nextState)
    })
    it('should set the form to submitting', function () {
      const nextState = formReducers.submitForm(state, action)
      expect(nextState.testForm.status).to.equal(formStatuses.SUBMITTING)
    })
  })
  describe('submitFormSuccess', function () {
    const state = {
      testForm: {
        testField: {}
      }
    }
    let resetFormStub
    const resetFormStubResult = {}
    beforeEach(function () {
      resetFormStub = sandbox.stub(formReducers, 'resetForm').returns(resetFormStubResult)
    })
    afterEach(function () {
      sandbox.restore()
    })
    const action = { formName: 'testForm' }
    it('should reset form', function () {
      const nextState = formReducers.submitFormSuccess(state, action)
      expect(resetFormStub.calledOnce).to.equal(true)
      expect(nextState).to.equal(resetFormStub.firstCall.returnValue)
    })
  })
  describe('submitFormFail', function () {
    const state = {
      testForm: {
        testField: {}
      }
    }
    const action = { formName: 'testForm', error: 'testError' }
    it('should return a new state', function () {
      const nextState = formReducers.submitFormFail(state, action)
      expect(state).to.not.equal(nextState)
    })
    it('should set the form error', function () {
      const nextState = formReducers.submitFormFail(state, action)
      expect(nextState.testForm.error).to.equal(action.error)
    })
    describe('given that the form has validationErrors', function () {
      const state = {
        testForm: {
          testField: {}
        }
      }
      const action = { formName: 'testForm', validationErrors: { testField: 'testFieldError' }, error: 'testError' }
      it('should set the form fields to invalid', function () {
        const nextState = formReducers.submitFormFail(state, action)
        expect(nextState.testForm.testField.status).to.equal(formStatuses.INVALID)
      })
      it('should set the form to invalid', function () {
        const nextState = formReducers.submitFormFail(state, action)
        expect(nextState.testForm.status).to.equal(formStatuses.INVALID)
      })
    })
    describe('given that the form doesnt have validationErrors', function () {
      const state = {
        testForm: {
          status: 'currentStatus',
          testField: {
            status: 'currentStatus'
          }
        }
      }
      const action = { formName: 'testForm' }
      it('should keep existing form fields statuses', function () {
        const nextState = formReducers.submitFormFail(state, action)
        expect(nextState.testForm.testField.status).to.equal(state.testForm.testField.status)
      })
      it('should keep existing form status', function () {
        const nextState = formReducers.submitFormFail(state, action)
        expect(nextState.testForm.status).to.equal(state.testForm.status)
      })
    })
    describe('given that the form has validationErrors', function () {})
  })
  describe('resetFormStore', function () {
    const state = {
      testForm: {
        testField: {}
      }
    }
    const action = {}
    it('should return initialState', function () {
      const nextState = formReducers.resetFormStore(state, action)
      expect(nextState).to.equal(initialState)
    })
  })
  describe('changeValue', function () {
    const state = {
      testForm: {
        testField: {
          meta: {
            existingProp: 'existingProp'
          }
        }
      }
    }
    const action = { formName: 'testForm', fieldName: 'testField', value: 'testValue', meta: { newProp: 'newProp' } }
    it('should return a new state', function () {
      const nextState = formReducers.changeValue(state, action)
      expect(state).to.not.equal(nextState)
    })
    it('should set the field to touched', function () {
      const nextState = formReducers.changeValue(state, action)
      expect(nextState.testForm.testField.touched).to.equal(true)
    })
    it('should set the field value', function () {
      const nextState = formReducers.changeValue(state, action)
      expect(nextState.testForm.testField.value).to.equal(action.value)
    })
    it('should merge the meta', function () {
      const nextState = formReducers.changeValue(state, action)
      expect(nextState.testForm.testField.meta.existingProp).to.equal(state.testForm.testField.meta.existingProp)
      expect(nextState.testForm.testField.meta.newProp).to.equal(action.meta.newProp)
    })
    describe('given that the field has a validator', function () {
      const state = {
        testForm: {
          testField: {
            validate: 'validateTest',
            meta: {
              existingProp: 'existingProp'
            }
          }
        }
      }
      const action = { formName: 'testForm', fieldName: 'testField', value: 'testValue' }
      it('should set the form to validating', function () {
        const nextState = formReducers.changeValue(state, action)
        expect(nextState.testForm.status).to.equal(formStatuses.VALIDATING)
      })
      it('should set the field to validating', function () {
        const nextState = formReducers.changeValue(state, action)
        expect(nextState.testForm.testField.status).to.equal(formStatuses.VALIDATING)
      })
    })
    describe('given that the field doesnt have a validator', function () {
      const state = {
        testForm: {
          testField: {
            meta: {
              existingProp: 'existingProp'
            }
          }
        }
      }
      const action = { formName: 'testForm', fieldName: 'testField', value: 'testValue' }
      it('should set the form to validating', function () {
        const nextState = formReducers.changeValue(state, action)
        expect(nextState.testForm.status).to.equal(formStatuses.VALID)
      })
      it('should set the field to validating', function () {
        const nextState = formReducers.changeValue(state, action)
        expect(nextState.testForm.testField.status).to.equal(formStatuses.VALID)
      })
    })
    describe('given that the isSilent param is true', function () {
      it('should keep the current touched', function () {
        const state = {
          testForm: {
            testField: {
              touched: 'existingIsTouched'
            }
          }
        }
        const action = { formName: 'testForm', fieldName: 'testField', value: 'testValue', isSilent: true }
        const nextState = formReducers.changeValue(state, action)
        expect(nextState.testForm.testField.touched).to.equal(state.testForm.testField.touched)
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
      it('should set the field touched to false', function () {
        const action = { formName: 'testForm', fieldName: 'testField', value: 'testValue', validate: () => {} }
        const nextState = formReducers.registerField(state, action)
        expect(nextState.testForm[action.fieldName].touched).to.equal(false)
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
            touched: 'existingIsTouched',
            error: 'existingError'
          }
        }
      }
      it('should keep the existing fields status', function () {
        const action = { formName: 'testForm', fieldName: 'testField', value: 'testValue', validate: () => {} }
        const nextState = formReducers.registerField(state, action)
        expect(nextState.testForm[action.fieldName].status).to.equal(state.testForm[action.fieldName].status)
      })
      it('should keep the existing fields touched', function () {
        const action = { formName: 'testForm', fieldName: 'testField', value: 'testValue', validate: () => {} }
        const nextState = formReducers.registerField(state, action)
        expect(nextState.testForm[action.fieldName].touched).to.equal(state.testForm[action.fieldName].touched)
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
            touched: 'existingIsTouched',
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
        expect(nextState.testForm).to.equal(undefined)
      })
    })
    describe('when the field is is among other fields on the form', function () {
      const state = {
        testForm: {
          testField: {
            status: 'existingStatus',
            touched: 'existingIsTouched',
            error: 'existingError'
          },
          testField2: {
            status: 'existingStatus2',
            touched: 'existingIsTouched2',
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
        const nextState = formReducers.unregisterField(state, action)
        expect(nextState.testForm.testField).to.equal(undefined)
      })
    })
  })
  describe('resetForm', function () {
    const state = {
      testForm: {
        error: 'existingError',
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
    it('should set the touched of all the form fields to false', function () {
      const action = { formName: 'testForm' }
      const nextState = formReducers.resetForm(state, action)
      expect(nextState.testForm.testField.touched).to.equal(false)
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
    it('should clear the error ofthe form', function () {
      const action = { formName: 'testForm' }
      const nextState = formReducers.resetForm(state, action)
      expect(nextState.testForm.error).to.equal(undefined)
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
    it('should set the field touched to false', function () {
      const action = { formName: 'testForm', fieldName: 'testField' }
      const nextState = formReducers.resetField(state, action)
      expect(nextState.testForm.testField.touched).to.equal(false)
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
  describe('changeInitialValue', function () {
    const state = {
      testForm: {
        testField: {
          initialValue: 'existingInitialValue',
          meta: {
            existingProp: 'existingProp'
          }
        }
      }
    }
    const action = { formName: 'testForm', fieldName: 'testField', value: 'testNextInitialValue', meta: { newProp: 'newProp' } }
    it('should return a new state', function () {
      const nextState = formReducers.changeInitialValue(state, action)
      expect(state).to.not.equal(nextState)
    })
    it('should change initialValue on the field to the given value', function () {
      const nextState = formReducers.changeInitialValue(state, action)
      expect(nextState.testForm.testField.initialValue).to.equal(action.value)
    })
    it('should merge the meta', function () {
      const nextState = formReducers.changeInitialValue(state, action)
      expect(nextState.testForm.testField.meta.existingProp).to.equal(state.testForm.testField.meta.existingProp)
      expect(nextState.testForm.testField.meta.newProp).to.equal(action.meta.newProp)
    })
    describe('given that the field has not been touched', function () {
      const state = {
        testForm: {
          testField: {
            initialValue: 'existingInitialValue',
            touched: false
          }
        }
      }
      it('should change value on the field to the given value', function () {
        const nextState = formReducers.changeInitialValue(state, action)
        expect(nextState.testForm.testField.value).to.equal(action.value)
      })
    })
    describe('given that the field has been touched', function () {
      const state = {
        testForm: {
          testField: {
            initialValue: 'existingInitialValue',
            touched: true,
            value: 'existingValue'
          }
        }
      }
      it('should change not value on the field', function () {
        const nextState = formReducers.changeInitialValue(state, action)
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
  describe('updateMeta', function () {
    const state = {
      testForm: {
        testField: {
          meta: {
            existingProp: 'existingProp'
          }
        }
      }
    }
    const action = { formName: 'testForm', fieldName: 'testField', value: 'testValue', meta: { newProp: 'newProp' } }
    it('should return a new state', function () {
      const nextState = formReducers.updateMeta(state, action)
      expect(state).to.not.equal(nextState)
    })
    it('should merge the meta', function () {
      const nextState = formReducers.updateMeta(state, action)
      expect(nextState.testForm.testField.meta.existingProp).to.equal(state.testForm.testField.meta.existingProp)
      expect(nextState.testForm.testField.meta.newProp).to.equal(action.meta.newProp)
    })

  })
})
