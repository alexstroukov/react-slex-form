import { expect } from 'chai'
import sinon from 'sinon'
import createFormMiddleware from '../src/createFormMiddleware'
import formActions from '../src/form.actions'
import * as formActionTypes from '../src/form.actionTypes'
import * as formStatuses from '../src/form.statuses'
import { createDispatch, createGetState } from 'slex-store'

describe('createFormMiddleware', function () {
  const sandbox = sinon.sandbox.create()
  beforeEach(function () {
    sandbox.restore()
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('createFormMiddleware', function () {
    it('should return an object', function () {
      const validatorsStub = new class { testFormName = sandbox.stub().returns(Promise.resolve(true)) }
      const submittersStub = new class { testFormName = sandbox.stub().returns(Promise.resolve(true)) }
      const formMiddleware = createFormMiddleware({ validators: validatorsStub, submitters: submittersStub })
      expect(formMiddleware !== null && typeof formMiddleware === 'object').to.equal(true)
    })
    describe('submitFormMiddleware', function () {
      describe('given that the form doesnt have any validation errors and the submitter succeeds', function () {
        let state
        beforeEach(function () {
          state = {
            form: {
              [formName]: {
                testField1: {}
              }
            }
          }
        })
        // it('should return a resolved promise', function () {
        //   const validatorsStub = new class { testFormName = sandbox.stub().returns(Promise.resolve(true)) }
        //   const submittersStub = new class { testFormName = sandbox.stub().returns(Promise.resolve(true)) }
        //   const formMiddleware = createFormMiddleware({ validators: validatorsStub, submitters: submittersStub })
        //   const formName = 'testFormName'
        //   const dispatchSpy = sandbox.spy()
        //   const getStateStub = sandbox.stub().returns(state)
        //   const getState = createGetState(getStateStub)
        //   const dispatch = createDispatch(dispatchSpy)
        //   const validatorsStub.testFormName = sandbox.stub(formMiddleware, 'validateForm').returns((dispatch, getState) => Promise.resolve([]))
        //   const resetFormStub = sandbox.stub(formMiddleware, 'resetForm')
        //   const submitFormAction = formActions.submitForm({ formName })
        //   const submitFormActionResult = routeMiddleware.submitFormMiddleware(dispatch, getState)
        //   expect(submitFormActionResult).to.be.a('promise')
        // })
        it('should apply submitter then dispatch submitFormSuccess', function () {
          const submitResult = { test: 'test' }
          const validatorsStub = new class { testFormName = sandbox.stub().returns(Promise.resolve({})) }
          const submittersStub = new class { testFormName = sandbox.stub().returns(Promise.resolve(submitResult)) }
          const formMiddleware = createFormMiddleware({ validators: validatorsStub, submitters: submittersStub })
          const formName = 'testFormName'
          const dispatchSpy = sandbox.spy()
          const getStateStub = sandbox.stub().returns(state)
          const getState = createGetState(getStateStub)
          const dispatch = createDispatch(dispatchSpy)

          const submitFormAction = formMiddleware.submitForm(formName, submittersStub.testFormName)
          const submitFormActionResult = submitFormAction(dispatch, getState)
          return submitFormActionResult
            .then(result => {
              expect(validatorsStub.testFormName.calledBefore(submittersStub.testFormName)).to.equal(true)
            })
        })
      //   it('should resolve the result of the given submitServiceFn', function () {
      //     const submitResult = { test: 'test' }
      //     const formName = 'testFormName'
      //     const dispatchSpy = sandbox.spy()
      //     const getStateStub = sandbox.stub().returns({
      //       form: {
      //         [formName]: {
      //           testField1: {}
      //         }
      //       }
      //     })
      //     const getState = createGetState(getStateStub)
      //     const dispatch = createDispatch(dispatchSpy)
      //     const validatorsStub.testFormName = sandbox.stub(formMiddleware, 'validateForm').returns((dispatch, getState) => Promise.resolve([]))
      //     const submittersStub.testFormName = sandbox.stub().returns(Promise.resolve(submitResult))
      //     const submitFormAction = formMiddleware.submitForm(formName, submittersStub.testFormName)
      //     const submitFormActionResult = submitFormAction(dispatch, getState)
      //     return submitFormActionResult
      //       .then(result => {
      //         expect(result).to.equal(submitResult)
      //       })
      //   })
      })
      // describe('given that the form has validation errors', function () {
      //   it('should return a rejected promise', function () {
      //     const formErrors = [new Error()]
      //     const formName = 'testFormName'
      //     const dispatchSpy = sandbox.spy()
      //     const getStateStub = sandbox.stub().returns({
      //       form: {
      //         [formName]: {
      //           testField1: {}
      //         }
      //       }
      //     })
      //     const getState = createGetState(getStateStub)
      //     const dispatch = createDispatch(dispatchSpy)
      //     const validatorsStub.testFormName = sandbox.stub(formMiddleware, 'validateForm').returns((dispatch, getState) => Promise.resolve(formErrors))
      //     const submittersStub.testFormName = sandbox.stub()
      //     const submitFormAction = formMiddleware.submitForm(formName, submittersStub.testFormName)
      //     const submitFormActionResult = submitFormAction(dispatch, getState)
      //     expect(submitFormActionResult).to.be.a('promise')
      //     return submitFormActionResult
      //       .then(() => {
      //         throw new Error('should have rejected')
      //       })
      //       .catch(error => {
      //         expect(error.message).to.not.equal('should have rejected')
      //       })
      //   })
      //   it('should reject with validation errors returned by validateForm', function () {
      //     const formErrors = [new Error()]
      //     const formName = 'testFormName'
      //     const dispatchSpy = sandbox.spy()
      //     const getStateStub = sandbox.stub().returns({
      //       form: {
      //         [formName]: {
      //           testField1: {}
      //         }
      //       }
      //     })
      //     const getState = createGetState(getStateStub)
      //     const dispatch = createDispatch(dispatchSpy)
      //     const validatorsStub.testFormName = sandbox.stub(formMiddleware, 'validateForm').returns((dispatch, getState) => Promise.resolve(formErrors))
      //     const submittersStub.testFormName = sandbox.stub()
      //     const submitFormAction = formMiddleware.submitForm(formName, submittersStub.testFormName)
      //     const submitFormActionResult = submitFormAction(dispatch, getState)
      //     expect(submitFormActionResult).to.be.a('promise')
      //     return submitFormActionResult
      //       .then(() => {
      //         throw new Error('should have rejected')
      //       })
      //       .catch(error => {
      //         expect(error).to.equal(formErrors)
      //       })
      //   })
      //   it('should not should not call given submitServiceFn', function () {
      //     const formErrors = [new Error()]
      //     const formName = 'testFormName'
      //     const dispatchSpy = sandbox.spy()
      //     const getStateStub = sandbox.stub().returns({
      //       form: {
      //         [formName]: {
      //           testField1: {}
      //         }
      //       }
      //     })
      //     const getState = createGetState(getStateStub)
      //     const dispatch = createDispatch(dispatchSpy)
      //     const validatorsStub.testFormName = sandbox.stub(formMiddleware, 'validateForm').returns((dispatch, getState) => Promise.resolve(formErrors))
      //     const submittersStub.testFormName = sandbox.stub()
      //     const submitFormAction = formMiddleware.submitForm(formName, submittersStub.testFormName)
      //     const submitFormActionResult = submitFormAction(dispatch, getState)
      //     expect(submitFormActionResult).to.be.a('promise')
      //     return submitFormActionResult
      //       .then(() => {
      //         throw new Error('should have rejected')
      //       })
      //       .catch(error => {
      //         expect(submittersStub.testFormName.called).to.equal(false)
      //       })
      //   })
      // })
    })
  })

  // describe('validateForm', function () {
  //   it('should create a function action', function () {
  //     const params = { formName: 'testFormName' }
  //     const validateFormAction = formMiddleware.validateForm(params)
  //     expect(typeof validateFormAction === 'function').to.equal(true)
  //   })
  //   it('should call validate on all form fields', function () {
  //     const params = { formName: 'testFormName' }
  //     const dispatchSpy = sandbox.spy()
  //     const getStateStub = sandbox.stub().returns({
  //       form: {
  //         [params.formName]: {
  //           testField1: {},
  //           testField2: {},
  //           testField3: {},
  //           testField4: {}
  //         }
  //       }
  //     })
  //     const getState = createGetState(getStateStub)
  //     const dispatch = createDispatch(dispatchSpy)
  //     const validateStub = sandbox.stub(formMiddleware, 'validate').returns((dispatch, getState) => Promise.resolve())
  //     const validateFormAction = formMiddleware.validateForm(params)
  //     const validateFormActionResult = validateFormAction(dispatch, getState)
  //     return validateFormActionResult
  //       .then(errors => {
  //         expect(validateStub.callCount).to.equal(4)
  //       })
  //   })
  //   it('should return a resolved promise', function () {
  //     const params = { formName: 'testFormName' }
  //     const dispatchSpy = sandbox.spy()
  //     const getStateStub = sandbox.stub().returns({
  //       form: {
  //         [params.formName]: {
  //           testField1: {}
  //         }
  //       }
  //     })
  //     const getState = createGetState(getStateStub)
  //     const dispatch = createDispatch(dispatchSpy)
  //     const validateStub = sandbox.stub(formMiddleware, 'validate').returns((dispatch, getState) => Promise.resolve())
  //     const validateFormAction = formMiddleware.validateForm(params)
  //     const validateFormActionResult = validateFormAction(dispatch, getState)
  //     expect(validateFormActionResult).to.be.a('promise')
  //   })
  //   it('should resolve with an array of all the error on the form', function () {
  //     const params = { formName: 'testFormName' }
  //     const dispatchSpy = sandbox.spy()
  //     const getStateStub = sandbox.stub().returns({
  //       form: {
  //         [params.formName]: {
  //           testField1: {
  //             error: new Error('testField1')
  //           },
  //           testField2: {
  //             error: [new Error('testField2_1'), new Error('testField2_2')]
  //           },
  //           testField3: {}
  //         }
  //       }
  //     })
  //     const getState = createGetState(getStateStub)
  //     const dispatch = createDispatch(dispatchSpy)
  //     const validateStub = sandbox.stub(formMiddleware, 'validate').returns((dispatch, getState) => Promise.resolve())
  //     const validateFormAction = formMiddleware.validateForm(params)
  //     const validateFormActionResult = validateFormAction(dispatch, getState)
  //     return validateFormActionResult
  //       .then(errors => {
  //         expect(errors.length).to.equal(3)
  //       })
  //   })
  // })

  // describe('validate', function () {
  //   it('should create a function action', function () {
  //     const params = { formName: 'testFormName', fieldName: 'testFieldName', value: 'testValue' }
  //     const validateAction = formMiddleware.validate(params)
  //     expect(typeof validateAction === 'function').to.equal(true)
  //   })

  //   describe('given the field has a validate function', function () {
  //     it('should return a resolved promise', function () {
  //       const params = { formName: 'testFormName', fieldName: 'testFieldName', value: 'testValue' }
  //       const dispatchSpy = sandbox.spy()
  //       const getStateStub = sandbox.stub().returns({
  //         form: {
  //           [params.formName]: {
  //             [params.fieldName]: {},
  //             validate: () => {}
  //           }
  //         }
  //       })
  //       const getState = createGetState(getStateStub)
  //       const dispatch = createDispatch(dispatchSpy)
  //       const validatingStub = sandbox.stub(formMiddleware, 'validating')
  //       const isInvalidStub = sandbox.stub(formMiddleware, 'isInvalid')
  //       const isValidStub = sandbox.stub(formMiddleware, 'isValid')
  //       const validateAction = formMiddleware.validate(params)
  //       const validateActionResult = validateAction(dispatch, getState)
  //       expect(validateActionResult).to.be.a('promise')
  //     })
  //     describe('given that the field is not already validating', function () {
  //       it('should set field validating', function () {
  //         const params = { formName: 'testFormName', fieldName: 'testFieldName', value: 'testValue' }
  //         const dispatchSpy = sandbox.spy()
  //         const getStateStub = sandbox.stub().returns({
  //           form: {
  //             [params.formName]: {
  //               [params.fieldName]: {
  //                 validate: () => {}
  //               }
  //             }
  //           }
  //         })
  //         const getState = createGetState(getStateStub)
  //         const dispatch = createDispatch(dispatchSpy)
  //         const validatingStub = sandbox.stub(formMiddleware, 'validating')
  //         const isInvalidStub = sandbox.stub(formMiddleware, 'isInvalid')
  //         const isValidStub = sandbox.stub(formMiddleware, 'isValid')
  //         const validateAction = formMiddleware.validate(params)
  //         const validateActionResult = validateAction(dispatch, getState)
  //         expect(validatingStub.callCount).to.equal(1)
  //       })
  //       describe('and the validate resolves successfully', function () {
  //         describe('while the field value is still the value that was validated', function () {
  //           describe('given that the vaidation result is an error', function () {
  //             it('should set field isInvalid', function () {
  //               const params = { formName: 'testFormName', fieldName: 'testFieldName', value: 'testValue' }
  //               const dispatchSpy = sandbox.spy()
  //               const getStateStub = sandbox.stub().returns({
  //                 form: {
  //                   [params.formName]: {
  //                     [params.fieldName]: {
  //                       value: params.value,
  //                       validate: () => Promise.resolve(new Error())
  //                     }
  //                   }
  //                 }
  //               })
  //               const getState = createGetState(getStateStub)
  //               const dispatch = createDispatch(dispatchSpy)
  //               const validatingStub = sandbox.stub(formMiddleware, 'validating')
  //               const isInvalidStub = sandbox.stub(formMiddleware, 'isInvalid')
  //               const isValidStub = sandbox.stub(formMiddleware, 'isValid')
  //               const validateAction = formMiddleware.validate(params)
  //               const validateActionResult = validateAction(dispatch, getState)
  //               return validateActionResult
  //                 .then(() => {
  //                   expect(isInvalidStub.callCount).to.equal(1)
  //                 })
  //             })
  //           })
  //           describe('given that the vaidation result is not an error', function () {
  //             it('should set field isValid', function () {
  //               const params = { formName: 'testFormName', fieldName: 'testFieldName', value: 'testValue' }
  //               const dispatchSpy = sandbox.spy()
  //               const getStateStub = sandbox.stub().returns({
  //                 form: {
  //                   [params.formName]: {
  //                     [params.fieldName]: {
  //                       value: params.value,
  //                       validate: () => Promise.resolve()
  //                     }
  //                   }
  //                 }
  //               })
  //               const getState = createGetState(getStateStub)
  //               const dispatch = createDispatch(dispatchSpy)
  //               const validatingStub = sandbox.stub(formMiddleware, 'validating')
  //               const isInvalidStub = sandbox.stub(formMiddleware, 'isInvalid')
  //               const isValidStub = sandbox.stub(formMiddleware, 'isValid')
  //               const validateAction = formMiddleware.validate(params)
  //               const validateActionResult = validateAction(dispatch, getState)
  //               return validateActionResult
  //                 .then(() => {
  //                   expect(isValidStub.callCount).to.equal(1)
  //                 })
  //             })
  //           })
  //         })
  //         describe('while the field value has changed since the given call to validate', function () {
  //           it('should do nothing', function () {
  //             const params = { formName: 'testFormName', fieldName: 'testFieldName', value: 'testValue' }
  //             const dispatchSpy = sandbox.spy()
  //             const getStateStub = sandbox.stub().returns({
  //               form: {
  //                 [params.formName]: {
  //                   [params.fieldName]: {
  //                     value: params.value,
  //                     validate: () => {
  //                       getStateStub.returns({
  //                         form: {
  //                           [params.formName]: {
  //                             [params.fieldName]: {
  //                               value: 'differentValue',
  //                               validate: () => Promise.resolve()
  //                             }
  //                           }
  //                         }
  //                       })
  //                     }
  //                   }
  //                 }
  //               }
  //             })

  //             const getState = createGetState(getStateStub)
  //             const dispatch = createDispatch(dispatchSpy)
  //             const validatingStub = sandbox.stub(formMiddleware, 'validating')
  //             const isInvalidStub = sandbox.stub(formMiddleware, 'isInvalid')
  //             const isValidStub = sandbox.stub(formMiddleware, 'isValid')
  //             const validateAction = formMiddleware.validate(params)
  //             const validateActionResult = validateAction(dispatch, getState)
  //             return validateActionResult
  //               .then(() => {
  //                 expect(isInvalidStub.callCount).to.equal(0)
  //                 expect(isValidStub.callCount).to.equal(0)
  //               })
  //           })
  //         })
  //       })
  //       describe('and the validate rejects', function () {
  //         describe('while the field value is still the value that was validated', function () {
  //           it('should set field isInvalid', function () {
  //             const params = { formName: 'testFormName', fieldName: 'testFieldName', value: 'testValue' }
  //             const dispatchSpy = sandbox.spy()
  //             const getStateStub = sandbox.stub().returns({
  //               form: {
  //                 [params.formName]: {
  //                   [params.fieldName]: {
  //                     value: params.value,
  //                     validate: () => Promise.reject()
  //                   }
  //                 }
  //               }
  //             })
  //             const getState = createGetState(getStateStub)
  //             const dispatch = createDispatch(dispatchSpy)
  //             const validatingStub = sandbox.stub(formMiddleware, 'validating')
  //             const isInvalidStub = sandbox.stub(formMiddleware, 'isInvalid')
  //             const isValidStub = sandbox.stub(formMiddleware, 'isValid')
  //             const validateAction = formMiddleware.validate(params)
  //             const validateActionResult = validateAction(dispatch, getState)
  //             return validateActionResult
  //               .then(() => {
  //                 expect(isInvalidStub.callCount).to.equal(1)
  //               })
  //           })
  //         })
  //         describe('while the field value has changed since the given call to validate', function () {
  //           it('should do nothing', function () {
  //             const params = { formName: 'testFormName', fieldName: 'testFieldName', value: 'testValue' }
  //             const dispatchSpy = sandbox.spy()
  //             const getStateStub = sandbox.stub().returns({
  //               form: {
  //                 [params.formName]: {
  //                   [params.fieldName]: {
  //                     value: params.value,
  //                     validate: () => new Promise(function (resolve, reject) {
  //                       getStateStub.returns({
  //                         form: {
  //                           [params.formName]: {
  //                             [params.fieldName]: {
  //                               value: 'differentValue',
  //                               validate: () => Promise.resolve()
  //                             }
  //                           }
  //                         }
  //                       })
  //                       reject()
  //                     })
  //                   }
  //                 }
  //               }
  //             })

  //             const getState = createGetState(getStateStub)
  //             const dispatch = createDispatch(dispatchSpy)
  //             const validatingStub = sandbox.stub(formMiddleware, 'validating')
  //             const isInvalidStub = sandbox.stub(formMiddleware, 'isInvalid')
  //             const isValidStub = sandbox.stub(formMiddleware, 'isValid')
  //             const validateAction = formMiddleware.validate(params)
  //             const validateActionResult = validateAction(dispatch, getState)
  //             return validateActionResult
  //               .then(() => {
  //                 expect(isInvalidStub.callCount).to.equal(0)
  //                 expect(isValidStub.callCount).to.equal(0)
  //               })
  //           })
  //         })
  //       })
  //     })
  //   })
  //   describe('given the field doesnt have a validate function', function () {
  //     it('should return a resolved promise', function () {
  //       const params = { formName: 'testFormName', fieldName: 'testFieldName', value: 'testValue' }
  //       const dispatchSpy = sandbox.spy()
  //       const getStateStub = sandbox.stub().returns({
  //         form: {
  //           [params.formName]: {
  //             [params.fieldName]: {}
  //           }
  //         }
  //       })
  //       const getState = createGetState(getStateStub)
  //       const dispatch = createDispatch(dispatchSpy)
  //       const validatingStub = sandbox.stub(formMiddleware, 'validating')
  //       const isInvalidStub = sandbox.stub(formMiddleware, 'isInvalid')
  //       const isValidStub = sandbox.stub(formMiddleware, 'isValid')
  //       const validateAction = formMiddleware.validate(params)
  //       const validateActionResult = validateAction(dispatch, getState)
  //       expect(validateActionResult).to.be.a('promise')
  //     })
  //     it('should set field isValid', function () {
  //       const params = { formName: 'testFormName', fieldName: 'testFieldName', value: 'testValue' }
  //       const dispatchSpy = sandbox.spy()
  //       const getStateStub = sandbox.stub().returns({
  //         form: {
  //           [params.formName]: {
  //             [params.fieldName]: {
  //               value: params.value
  //             }
  //           }
  //         }
  //       })
  //       const getState = createGetState(getStateStub)
  //       const dispatch = createDispatch(dispatchSpy)
  //       const validatingStub = sandbox.stub(formMiddleware, 'validating')
  //       const isInvalidStub = sandbox.stub(formMiddleware, 'isInvalid')
  //       const isValidStub = sandbox.stub(formMiddleware, 'isValid')
  //       const validateAction = formMiddleware.validate(params)
  //       const validateActionResult = validateAction(dispatch, getState)
  //       return validateActionResult
  //         .then(() => {
  //           expect(isValidStub.callCount).to.equal(1)
  //         })
  //     })
  //   })
  // })
})
