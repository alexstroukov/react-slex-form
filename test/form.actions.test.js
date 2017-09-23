import { expect } from 'chai'
import sinon from 'sinon'
import formActions from '../src/form.actions'
import * as formActionTypes from '../src/form.actionTypes'
import * as formStatuses from '../src/form.statuses'
import { createDispatch, createGetState } from 'slex-store'

describe('form.actions', function () {
  const sandbox = sinon.sandbox.create()
  beforeEach(function () {
    sandbox.restore()
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('changeInitialValue', function () {
    it('should create a function action', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue' }
      const changeInitialValueAction = formActions.changeInitialValue(params)
      expect(typeof changeInitialValueAction === 'function').to.equal(true)
    })

    it('should dispatch updateInitialValue', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue' }
      const dispatchStub = sandbox.stub()
      const getStateStub = sandbox.stub()
      const updateInitialValueStub = sandbox.stub(formActions, 'updateInitialValue')
      const changeInitialValueAction = formActions.changeInitialValue(params)
      changeInitialValueAction(dispatchStub, getStateStub)
      expect(updateInitialValueStub.callCount).to.equal(1)
    })

    describe('given that the field was validating at the time the action was dispatched', function () {
      it('should validate the field again', function () {
        const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue' }
        const dispatchStub = sandbox.stub()
        const getStateStub = sandbox.stub().returns({
          form: {
            [params.formName]: {
              [params.fieldName]: {
                status: formStatuses.VALIDATING
              }
            }
          }
        })
        const updateInitialValueStub = sandbox.stub(formActions, 'updateInitialValue')
        const validateStub = sandbox.stub(formActions, 'validate')
        const changeInitialValueAction = formActions.changeInitialValue(params)
        changeInitialValueAction(dispatchStub, getStateStub)
        expect(validateStub.callCount).to.equal(1)
      })
    })
  })

  describe('submitForm', function () {
    it('should create a function action', function () {
      const formName = 'testFormName'
      const submitServiceFn = () => Promise.resolve()
      const submitFormAction = formActions.submitForm(formName, submitServiceFn)
      expect(typeof submitFormAction === 'function').to.equal(true)
    })

    describe('given that the form doesnt have any validation errors', function () {
      it('should return a resolved promise', function () {
        const formName = 'testFormName'
        const dispatchSpy = sandbox.spy()
        const getStateStub = sandbox.stub().returns({
          form: {
            [formName]: {
              testField1: {}
            }
          }
        })
        const getState = createGetState(getStateStub)
        const dispatch = createDispatch(dispatchSpy)
        const validateFormStub = sandbox.stub(formActions, 'validateForm').returns((dispatch, getState) => Promise.resolve([]))
        const resetFormStub = sandbox.stub(formActions, 'resetForm')
        const submitServiceFnStub = sandbox.stub()
        const submitFormAction = formActions.submitForm(formName, submitServiceFnStub)
        const submitFormActionResult = submitFormAction(dispatch, getState)
        expect(submitFormActionResult).to.be.a('promise')
      })
      it('should validateForm, then apply submitServiceFn', function () {
        const submitResult = { test: 'test' }
        const formName = 'testFormName'
        const dispatchSpy = sandbox.spy()
        const getStateStub = sandbox.stub().returns({
          form: {
            [formName]: {
              testField1: {}
            }
          }
        })
        const getState = createGetState(getStateStub)
        const dispatch = createDispatch(dispatchSpy)
        const validateFormStub = sandbox.stub(formActions, 'validateForm').returns((dispatch, getState) => Promise.resolve([]))
        const submitServiceFnStub = sandbox.stub().returns(Promise.resolve(submitResult))
        const submitFormAction = formActions.submitForm(formName, submitServiceFnStub)
        const submitFormActionResult = submitFormAction(dispatch, getState)
        return submitFormActionResult
          .then(result => {
            expect(validateFormStub.calledBefore(submitServiceFnStub)).to.equal(true)
          })
      })
      it('should resolve the result of the given submitServiceFn', function () {
        const submitResult = { test: 'test' }
        const formName = 'testFormName'
        const dispatchSpy = sandbox.spy()
        const getStateStub = sandbox.stub().returns({
          form: {
            [formName]: {
              testField1: {}
            }
          }
        })
        const getState = createGetState(getStateStub)
        const dispatch = createDispatch(dispatchSpy)
        const validateFormStub = sandbox.stub(formActions, 'validateForm').returns((dispatch, getState) => Promise.resolve([]))
        const submitServiceFnStub = sandbox.stub().returns(Promise.resolve(submitResult))
        const submitFormAction = formActions.submitForm(formName, submitServiceFnStub)
        const submitFormActionResult = submitFormAction(dispatch, getState)
        return submitFormActionResult
          .then(result => {
            expect(result).to.equal(submitResult)
          })
      })
    })

    describe('given that the form has validation errors', function () {
      it('should return a rejected promise', function () {
        const formErrors = [new Error()]
        const formName = 'testFormName'
        const dispatchSpy = sandbox.spy()
        const getStateStub = sandbox.stub().returns({
          form: {
            [formName]: {
              testField1: {}
            }
          }
        })
        const getState = createGetState(getStateStub)
        const dispatch = createDispatch(dispatchSpy)
        const validateFormStub = sandbox.stub(formActions, 'validateForm').returns((dispatch, getState) => Promise.resolve(formErrors))
        const submitServiceFnStub = sandbox.stub()
        const submitFormAction = formActions.submitForm(formName, submitServiceFnStub)
        const submitFormActionResult = submitFormAction(dispatch, getState)
        expect(submitFormActionResult).to.be.a('promise')
        return submitFormActionResult
          .then(() => {
            throw new Error('should have rejected')
          })
          .catch(error => {
            expect(error.message).to.not.equal('should have rejected')
          })
      })
      it('should reject with validation errors returned by validateForm', function () {
        const formErrors = [new Error()]
        const formName = 'testFormName'
        const dispatchSpy = sandbox.spy()
        const getStateStub = sandbox.stub().returns({
          form: {
            [formName]: {
              testField1: {}
            }
          }
        })
        const getState = createGetState(getStateStub)
        const dispatch = createDispatch(dispatchSpy)
        const validateFormStub = sandbox.stub(formActions, 'validateForm').returns((dispatch, getState) => Promise.resolve(formErrors))
        const submitServiceFnStub = sandbox.stub()
        const submitFormAction = formActions.submitForm(formName, submitServiceFnStub)
        const submitFormActionResult = submitFormAction(dispatch, getState)
        expect(submitFormActionResult).to.be.a('promise')
        return submitFormActionResult
          .then(() => {
            throw new Error('should have rejected')
          })
          .catch(error => {
            expect(error).to.equal(formErrors)
          })
      })
      it('should not should not call given submitServiceFn', function () {
        const formErrors = [new Error()]
        const formName = 'testFormName'
        const dispatchSpy = sandbox.spy()
        const getStateStub = sandbox.stub().returns({
          form: {
            [formName]: {
              testField1: {}
            }
          }
        })
        const getState = createGetState(getStateStub)
        const dispatch = createDispatch(dispatchSpy)
        const validateFormStub = sandbox.stub(formActions, 'validateForm').returns((dispatch, getState) => Promise.resolve(formErrors))
        const submitServiceFnStub = sandbox.stub()
        const submitFormAction = formActions.submitForm(formName, submitServiceFnStub)
        const submitFormActionResult = submitFormAction(dispatch, getState)
        expect(submitFormActionResult).to.be.a('promise')
        return submitFormActionResult
          .then(() => {
            throw new Error('should have rejected')
          })
          .catch(error => {
            expect(submitServiceFnStub.called).to.equal(false)
          })
      })
    })
  })

  describe('validateForm', function () {
    it('should create a function action', function () {
      const params = { formName: 'testFormName' }
      const validateFormAction = formActions.validateForm(params)
      expect(typeof validateFormAction === 'function').to.equal(true)
    })
    it('should call validate on all form fields', function () {
      const params = { formName: 'testFormName' }
      const dispatchSpy = sandbox.spy()
      const getStateStub = sandbox.stub().returns({
        form: {
          [params.formName]: {
            testField1: {},
            testField2: {},
            testField3: {},
            testField4: {}
          }
        }
      })
      const getState = createGetState(getStateStub)
      const dispatch = createDispatch(dispatchSpy)
      const validateStub = sandbox.stub(formActions, 'validate').returns((dispatch, getState) => Promise.resolve())
      const validateFormAction = formActions.validateForm(params)
      const validateFormActionResult = validateFormAction(dispatch, getState)
      return validateFormActionResult
        .then(errors => {
          expect(validateStub.callCount).to.equal(4)
        })
    })
    it('should return a resolved promise', function () {
      const params = { formName: 'testFormName' }
      const dispatchSpy = sandbox.spy()
      const getStateStub = sandbox.stub().returns({
        form: {
          [params.formName]: {
            testField1: {}
          }
        }
      })
      const getState = createGetState(getStateStub)
      const dispatch = createDispatch(dispatchSpy)
      const validateStub = sandbox.stub(formActions, 'validate').returns((dispatch, getState) => Promise.resolve())
      const validateFormAction = formActions.validateForm(params)
      const validateFormActionResult = validateFormAction(dispatch, getState)
      expect(validateFormActionResult).to.be.a('promise')
    })
    it('should resolve with an array of all the error on the form', function () {
      const params = { formName: 'testFormName' }
      const dispatchSpy = sandbox.spy()
      const getStateStub = sandbox.stub().returns({
        form: {
          [params.formName]: {
            testField1: {
              error: new Error('testField1')
            },
            testField2: {
              error: [new Error('testField2_1'), new Error('testField2_2')]
            },
            testField3: {}
          }
        }
      })
      const getState = createGetState(getStateStub)
      const dispatch = createDispatch(dispatchSpy)
      const validateStub = sandbox.stub(formActions, 'validate').returns((dispatch, getState) => Promise.resolve())
      const validateFormAction = formActions.validateForm(params)
      const validateFormActionResult = validateFormAction(dispatch, getState)
      return validateFormActionResult
        .then(errors => {
          expect(errors.length).to.equal(3)
        })
    })
  })

  describe('resetForm', function () {
    it('should create a function action', function () {
      const params = { formName: 'testFormName' }
      const resetFormAction = formActions.resetForm(params)
      expect(resetFormAction !== null && typeof resetFormAction === 'object').to.equal(true)
    })
    it('should be of type RESET_FORM', function () {
      const params = { formName: 'testformName' }
      const resetFormAction = formActions.resetForm(params)
      expect(resetFormAction.type).to.equal(formActionTypes.RESET_FORM)
    })
    it('should include the given formName in the returned object', function () {
      const params = { formName: 'testformName' }
      const resetFormAction = formActions.resetForm(params)
      expect(resetFormAction.formName).to.equal(params.formName)
    })
  })


  describe('changeValue', function () {
    it('should create a function action', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue', isSilent: false }
      const changeValueAction = formActions.changeValue(params)
      expect(typeof changeValueAction === 'function').to.equal(true)
    })
    it('should updateValue', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue', isSilent: false }
      const dispatchStub = sandbox.stub()
      const getStateStub = sandbox.stub().returns()
      const updateValueStub = sandbox.stub(formActions, 'updateValue')
      const validateStub = sandbox.stub(formActions, 'validate')
      const changeValueAction = formActions.changeValue(params)
      changeValueAction(dispatchStub, getStateStub)
      expect(updateValueStub.callCount).to.equal(1)
    })
    it('should validate', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue', isSilent: false }
      const dispatchStub = sandbox.stub()
      const getStateStub = sandbox.stub().returns()
      const updateValueStub = sandbox.stub(formActions, 'updateValue')
      const validateStub = sandbox.stub(formActions, 'validate')
      const changeValueAction = formActions.changeValue(params)
      changeValueAction(dispatchStub, getStateStub)
      expect(validateStub.callCount).to.equal(1)
    })
  })

  describe('validate', function () {
    it('should create a function action', function () {
      const params = { formName: 'testFormName', fieldName: 'testFieldName', value: 'testValue' }
      const validateAction = formActions.validate(params)
      expect(typeof validateAction === 'function').to.equal(true)
    })

    describe('given the field has a validate function', function () {
      it('should return a resolved promise', function () {
        const params = { formName: 'testFormName', fieldName: 'testFieldName', value: 'testValue' }
        const dispatchSpy = sandbox.spy()
        const getStateStub = sandbox.stub().returns({
          form: {
            [params.formName]: {
              [params.fieldName]: {},
              validate: () => {}
            }
          }
        })
        const getState = createGetState(getStateStub)
        const dispatch = createDispatch(dispatchSpy)
        const validatingStub = sandbox.stub(formActions, 'validating')
        const isInvalidStub = sandbox.stub(formActions, 'isInvalid')
        const isValidStub = sandbox.stub(formActions, 'isValid')
        const validateAction = formActions.validate(params)
        const validateActionResult = validateAction(dispatch, getState)
        expect(validateActionResult).to.be.a('promise')
      })
      describe('given that the field is not already validating', function () {
        it('should set field validating', function () {
          const params = { formName: 'testFormName', fieldName: 'testFieldName', value: 'testValue' }
          const dispatchSpy = sandbox.spy()
          const getStateStub = sandbox.stub().returns({
            form: {
              [params.formName]: {
                [params.fieldName]: {
                  validate: () => {}
                }
              }
            }
          })
          const getState = createGetState(getStateStub)
          const dispatch = createDispatch(dispatchSpy)
          const validatingStub = sandbox.stub(formActions, 'validating')
          const isInvalidStub = sandbox.stub(formActions, 'isInvalid')
          const isValidStub = sandbox.stub(formActions, 'isValid')
          const validateAction = formActions.validate(params)
          const validateActionResult = validateAction(dispatch, getState)
          expect(validatingStub.callCount).to.equal(1)
        })
        describe('and the validate resolves successfully', function () {
          describe('while the field value is still the value that was validated', function () {
            describe('given that the vaidation result is an error', function () {
              it('should set field isInvalid', function () {
                const params = { formName: 'testFormName', fieldName: 'testFieldName', value: 'testValue' }
                const dispatchSpy = sandbox.spy()
                const getStateStub = sandbox.stub().returns({
                  form: {
                    [params.formName]: {
                      [params.fieldName]: {
                        value: params.value,
                        validate: () => Promise.resolve(new Error())
                      }
                    }
                  }
                })
                const getState = createGetState(getStateStub)
                const dispatch = createDispatch(dispatchSpy)
                const validatingStub = sandbox.stub(formActions, 'validating')
                const isInvalidStub = sandbox.stub(formActions, 'isInvalid')
                const isValidStub = sandbox.stub(formActions, 'isValid')
                const validateAction = formActions.validate(params)
                const validateActionResult = validateAction(dispatch, getState)
                return validateActionResult
                  .then(() => {
                    expect(isInvalidStub.callCount).to.equal(1)
                  })
              })
            })
            describe('given that the vaidation result is not an error', function () {
              it('should set field isValid', function () {
                const params = { formName: 'testFormName', fieldName: 'testFieldName', value: 'testValue' }
                const dispatchSpy = sandbox.spy()
                const getStateStub = sandbox.stub().returns({
                  form: {
                    [params.formName]: {
                      [params.fieldName]: {
                        value: params.value,
                        validate: () => Promise.resolve()
                      }
                    }
                  }
                })
                const getState = createGetState(getStateStub)
                const dispatch = createDispatch(dispatchSpy)
                const validatingStub = sandbox.stub(formActions, 'validating')
                const isInvalidStub = sandbox.stub(formActions, 'isInvalid')
                const isValidStub = sandbox.stub(formActions, 'isValid')
                const validateAction = formActions.validate(params)
                const validateActionResult = validateAction(dispatch, getState)
                return validateActionResult
                  .then(() => {
                    expect(isValidStub.callCount).to.equal(1)
                  })
              })
            })
          })
          describe('while the field value has changed since the given call to validate', function () {
            it('should do nothing', function () {
              const params = { formName: 'testFormName', fieldName: 'testFieldName', value: 'testValue' }
              const dispatchSpy = sandbox.spy()
              const getStateStub = sandbox.stub().returns({
                form: {
                  [params.formName]: {
                    [params.fieldName]: {
                      value: params.value,
                      validate: () => {
                        getStateStub.returns({
                          form: {
                            [params.formName]: {
                              [params.fieldName]: {
                                value: 'differentValue',
                                validate: () => Promise.resolve()
                              }
                            }
                          }
                        })
                      }
                    }
                  }
                }
              })

              const getState = createGetState(getStateStub)
              const dispatch = createDispatch(dispatchSpy)
              const validatingStub = sandbox.stub(formActions, 'validating')
              const isInvalidStub = sandbox.stub(formActions, 'isInvalid')
              const isValidStub = sandbox.stub(formActions, 'isValid')
              const validateAction = formActions.validate(params)
              const validateActionResult = validateAction(dispatch, getState)
              return validateActionResult
                .then(() => {
                  expect(isInvalidStub.callCount).to.equal(0)
                  expect(isValidStub.callCount).to.equal(0)
                })
            })
          })
        })
        describe('and the validate rejects', function () {
          describe('while the field value is still the value that was validated', function () {
            it('should set field isInvalid', function () {
              const params = { formName: 'testFormName', fieldName: 'testFieldName', value: 'testValue' }
              const dispatchSpy = sandbox.spy()
              const getStateStub = sandbox.stub().returns({
                form: {
                  [params.formName]: {
                    [params.fieldName]: {
                      value: params.value,
                      validate: () => Promise.reject()
                    }
                  }
                }
              })
              const getState = createGetState(getStateStub)
              const dispatch = createDispatch(dispatchSpy)
              const validatingStub = sandbox.stub(formActions, 'validating')
              const isInvalidStub = sandbox.stub(formActions, 'isInvalid')
              const isValidStub = sandbox.stub(formActions, 'isValid')
              const validateAction = formActions.validate(params)
              const validateActionResult = validateAction(dispatch, getState)
              return validateActionResult
                .then(() => {
                  expect(isInvalidStub.callCount).to.equal(1)
                })
            })
          })
          describe('while the field value has changed since the given call to validate', function () {
            it('should do nothing', function () {
              const params = { formName: 'testFormName', fieldName: 'testFieldName', value: 'testValue' }
              const dispatchSpy = sandbox.spy()
              const getStateStub = sandbox.stub().returns({
                form: {
                  [params.formName]: {
                    [params.fieldName]: {
                      value: params.value,
                      validate: () => new Promise(function (resolve, reject) {
                        getStateStub.returns({
                          form: {
                            [params.formName]: {
                              [params.fieldName]: {
                                value: 'differentValue',
                                validate: () => Promise.resolve()
                              }
                            }
                          }
                        })
                        reject()
                      })
                    }
                  }
                }
              })

              const getState = createGetState(getStateStub)
              const dispatch = createDispatch(dispatchSpy)
              const validatingStub = sandbox.stub(formActions, 'validating')
              const isInvalidStub = sandbox.stub(formActions, 'isInvalid')
              const isValidStub = sandbox.stub(formActions, 'isValid')
              const validateAction = formActions.validate(params)
              const validateActionResult = validateAction(dispatch, getState)
              return validateActionResult
                .then(() => {
                  expect(isInvalidStub.callCount).to.equal(0)
                  expect(isValidStub.callCount).to.equal(0)
                })
            })
          })
        })
      })
    })
    describe('given the field doesnt have a validate function', function () {
      it('should return a resolved promise', function () {
        const params = { formName: 'testFormName', fieldName: 'testFieldName', value: 'testValue' }
        const dispatchSpy = sandbox.spy()
        const getStateStub = sandbox.stub().returns({
          form: {
            [params.formName]: {
              [params.fieldName]: {}
            }
          }
        })
        const getState = createGetState(getStateStub)
        const dispatch = createDispatch(dispatchSpy)
        const validatingStub = sandbox.stub(formActions, 'validating')
        const isInvalidStub = sandbox.stub(formActions, 'isInvalid')
        const isValidStub = sandbox.stub(formActions, 'isValid')
        const validateAction = formActions.validate(params)
        const validateActionResult = validateAction(dispatch, getState)
        expect(validateActionResult).to.be.a('promise')
      })
      it('should set field isValid', function () {
        const params = { formName: 'testFormName', fieldName: 'testFieldName', value: 'testValue' }
        const dispatchSpy = sandbox.spy()
        const getStateStub = sandbox.stub().returns({
          form: {
            [params.formName]: {
              [params.fieldName]: {
                value: params.value
              }
            }
          }
        })
        const getState = createGetState(getStateStub)
        const dispatch = createDispatch(dispatchSpy)
        const validatingStub = sandbox.stub(formActions, 'validating')
        const isInvalidStub = sandbox.stub(formActions, 'isInvalid')
        const isValidStub = sandbox.stub(formActions, 'isValid')
        const validateAction = formActions.validate(params)
        const validateActionResult = validateAction(dispatch, getState)
        return validateActionResult
          .then(() => {
            expect(isValidStub.callCount).to.equal(1)
          })
      })
    })
  })

  describe('updateMeta', function () {
    const params = { formName: 'testformName', fieldName: 'testFieldName', meta: { metaValue: 'testValue' } }
    it('should create an object action', function () {
      const updateMetaAction = formActions.updateMeta(params)
      expect(updateMetaAction !== null && typeof updateMetaAction === 'object').to.equal(true)
    })
    it('should be of type UPDATE_META', function () {
      const updateMetaAction = formActions.updateMeta(params)
      expect(updateMetaAction.type).to.equal(formActionTypes.UPDATE_META)
    })
    it('should include the given formName in the returned object', function () {
      const updateMetaAction = formActions.updateMeta(params)
      expect(updateMetaAction.formName).to.equal(params.formName)
    })
    it('should include the given fieldName in the returned object', function () {
      const updateMetaAction = formActions.updateMeta(params)
      expect(updateMetaAction.fieldName).to.equal(params.fieldName)
    })
    it('should include the given meta in the returned object', function () {
      const updateMetaAction = formActions.updateMeta(params)
      expect(updateMetaAction.meta).to.equal(params.meta)
    })
  })
  describe('updateInitialValue', function () {
    it('should create an object action', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue' }
      const updateInitialValueAction = formActions.updateInitialValue(params)
      expect(updateInitialValueAction !== null && typeof updateInitialValueAction === 'object').to.equal(true)
    })
    it('should be of type UPDATE_INITIAL_VALUE', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue' }
      const updateInitialValueAction = formActions.updateInitialValue(params)
      expect(updateInitialValueAction.type).to.equal(formActionTypes.UPDATE_INITIAL_VALUE)
    })
    it('should include the given formName in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue' }
      const updateInitialValueAction = formActions.updateInitialValue(params)
      expect(updateInitialValueAction.formName).to.equal(params.formName)
    })
    it('should include the given fieldName in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue' }
      const updateInitialValueAction = formActions.updateInitialValue(params)
      expect(updateInitialValueAction.fieldName).to.equal(params.fieldName)
    })
    it('should include the given value in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue' }
      const updateInitialValueAction = formActions.updateInitialValue(params)
      expect(updateInitialValueAction.value).to.equal(params.value)
    })
  })
  describe('updateValue', function () {
    it('should create an object action', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue', isSilent: false }
      const updateValueAction = formActions.updateValue(params)
      expect(updateValueAction !== null && typeof updateValueAction === 'object').to.equal(true)
    })
    it('should be of type UPDATE_VALUE', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue', isSilent: false }
      const updateValueAction = formActions.updateValue(params)
      expect(updateValueAction.type).to.equal(formActionTypes.UPDATE_VALUE)
    })
    it('should include the given formName in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue', isSilent: false }
      const updateValueAction = formActions.updateValue(params)
      expect(updateValueAction.formName).to.equal(params.formName)
    })
    it('should include the given fieldName in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue', isSilent: false }
      const updateValueAction = formActions.updateValue(params)
      expect(updateValueAction.fieldName).to.equal(params.fieldName)
    })
    it('should include the given value in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue', isSilent: false }
      const updateValueAction = formActions.updateValue(params)
      expect(updateValueAction.value).to.equal(params.value)
    })
    it('should include the given isSilent in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue', isSilent: false }
      const updateValueAction = formActions.updateValue(params)
      expect(updateValueAction.isSilent).to.equal(params.isSilent)
    })
  })
  describe('validating', function () {
    it('should create an object action', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName' }
      const validatingAction = formActions.validating(params)
      expect(validatingAction !== null && typeof validatingAction === 'object').to.equal(true)
    })
    it('should be of type VALIDATING', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName' }
      const validatingAction = formActions.validating(params)
      expect(validatingAction.type).to.equal(formActionTypes.VALIDATING)
    })
    it('should include the given formName in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName' }
      const validatingAction = formActions.validating(params)
      expect(validatingAction.formName).to.equal(params.formName)
    })
    it('should include the given fieldName in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName' }
      const validatingAction = formActions.validating(params)
      expect(validatingAction.fieldName).to.equal(params.fieldName)
    })
  })
  describe('resetField', function () {
    it('should create an object action', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName' }
      const resetFieldAction = formActions.resetField(params)
      expect(resetFieldAction !== null && typeof resetFieldAction === 'object').to.equal(true)
    })
    it('should be of type RESET_FIELD', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName' }
      const resetFieldAction = formActions.resetField(params)
      expect(resetFieldAction.type).to.equal(formActionTypes.RESET_FIELD)
    })
    it('should include the given formName in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName' }
      const resetFieldAction = formActions.resetField(params)
      expect(resetFieldAction.formName).to.equal(params.formName)
    })
    it('should include the given fieldName in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName' }
      const resetFieldAction = formActions.resetField(params)
      expect(resetFieldAction.fieldName).to.equal(params.fieldName)
    })
  })
  describe('isValid', function () {
    it('should create an object action', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName' }
      const isValidAction = formActions.isValid(params)
      expect(isValidAction !== null && typeof isValidAction === 'object').to.equal(true)
    })
    it('should be of type IS_VALID', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName' }
      const isValidAction = formActions.isValid(params)
      expect(isValidAction.type).to.equal(formActionTypes.IS_VALID)
    })
    it('should include the given formName in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName' }
      const isValidAction = formActions.isValid(params)
      expect(isValidAction.formName).to.equal(params.formName)
    })
    it('should include the given fieldName in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName' }
      const isValidAction = formActions.isValid(params)
      expect(isValidAction.fieldName).to.equal(params.fieldName)
    })
  })
  describe('isInvalid', function () {
    it('should create an object action', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', error: new Error() }
      const isInvalidAction = formActions.isInvalid(params)
      expect(isInvalidAction !== null && typeof isInvalidAction === 'object').to.equal(true)
    })
    it('should be of type IS_INVALID', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', error: new Error() }
      const isInvalidAction = formActions.isInvalid(params)
      expect(isInvalidAction.type).to.equal(formActionTypes.IS_INVALID)
    })
    it('should include the given formName in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', error: new Error() }
      const isInvalidAction = formActions.isInvalid(params)
      expect(isInvalidAction.formName).to.equal(params.formName)
    })
    it('should include the given fieldName in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', error: new Error() }
      const isInvalidAction = formActions.isInvalid(params)
      expect(isInvalidAction.fieldName).to.equal(params.fieldName)
    })
    it('should include the given error in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', error: new Error() }
      const isInvalidAction = formActions.isInvalid(params)
      expect(isInvalidAction.error).to.equal(params.error)
    })
  })
  describe('addFormField', function () {
    it('should create an object action', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue', validate: () => {} }
      const addFormFieldAction = formActions.addFormField(params)
      expect(addFormFieldAction !== null && typeof addFormFieldAction === 'object').to.equal(true)
    })
    it('should be of type REGISTER_FIELD', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue', validate: () => {} }
      const addFormFieldAction = formActions.addFormField(params)
      expect(addFormFieldAction.type).to.equal(formActionTypes.REGISTER_FIELD)
    })
    it('should include the given formName in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue', validate: () => {} }
      const addFormFieldAction = formActions.addFormField(params)
      expect(addFormFieldAction.formName).to.equal(params.formName)
    })
    it('should include the given fieldName in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue', validate: () => {} }
      const addFormFieldAction = formActions.addFormField(params)
      expect(addFormFieldAction.fieldName).to.equal(params.fieldName)
    })
    it('should include the given value in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue', validate: () => {} }
      const addFormFieldAction = formActions.addFormField(params)
      expect(addFormFieldAction.value).to.equal(params.value)
    })
    it('should include the given validate in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue', validate: () => {} }
      const addFormFieldAction = formActions.addFormField(params)
      expect(addFormFieldAction.validate).to.equal(params.validate)
    })
  })
  describe('registerField', function () {
    it('should create a function action', function () {
      const params = { formName: 'formNameTest', fieldName: 'fieldNameTest', value: 'valueTest', validate: 'validateTest' }
      const validateFormAction = formActions.registerField(params)
      expect(typeof validateFormAction === 'function').to.equal(true)
    })
    it('should dispatch addFormField', function () {
      const params = { formName: 'formNameTest', fieldName: 'fieldNameTest', value: 'valueTest', validate: 'validateTest' }
      const dispatchStub = sandbox.stub()
      const getStateStub = sandbox.stub()
      const addFormFieldStub = sandbox.stub(formActions, 'addFormField')
      const registerFieldAction = formActions.registerField(params)
      registerFieldAction(dispatchStub, getStateStub)
      expect(addFormFieldStub.callCount).to.equal(1)
      expect(addFormFieldStub.firstCall.args[0].formName).to.equal(params.formName)
      expect(addFormFieldStub.firstCall.args[0].fieldName).to.equal(params.fieldName)
      expect(addFormFieldStub.firstCall.args[0].value).to.equal(params.value)
      expect(addFormFieldStub.firstCall.args[0].validate).to.equal(params.validate)
    })
    describe('given that the form is not INITIAL', function () {
      it('should validate', function () {
        const params = { formName: 'formNameTest', fieldName: 'fieldNameTest', value: 'valueTest', validate: 'validateTest' }
        const dispatchStub = sandbox.stub()
        const getStateStub = sandbox.stub().returns({
          form: {
            [params.formName]: {
              status: formStatuses.VALIDATING
            }
          }
        })
        const addFormFieldStub = sandbox.stub(formActions, 'addFormField')
        const validateStub = sandbox.stub(formActions, 'validate')
        const registerFieldAction = formActions.registerField(params)
        registerFieldAction(dispatchStub, getStateStub)
        expect(validateStub.callCount).to.equal(1)
        expect(validateStub.firstCall.args[0].formName).to.equal(params.formName)
        expect(validateStub.firstCall.args[0].fieldName).to.equal(params.fieldName)
        expect(validateStub.firstCall.args[0].value).to.equal(params.value)
      })
    })
  })
  describe('unregisterField', function () {
    it('should create an object action', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName' }
      const unregisterFieldAction = formActions.unregisterField(params)
      expect(unregisterFieldAction !== null && typeof unregisterFieldAction === 'object').to.equal(true)
    })
    it('should be of type UNREGISTER_FIELD', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName' }
      const unregisterFieldAction = formActions.unregisterField(params)
      expect(unregisterFieldAction.type).to.equal(formActionTypes.UNREGISTER_FIELD)
    })
    it('should include the given formName in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName' }
      const unregisterFieldAction = formActions.unregisterField(params)
      expect(unregisterFieldAction.formName).to.equal(params.formName)
    })
    it('should include the given fieldName in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName' }
      const unregisterFieldAction = formActions.unregisterField(params)
      expect(unregisterFieldAction.fieldName).to.equal(params.fieldName)
    })
  })
})
