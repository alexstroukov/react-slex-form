import { expect } from 'chai'
import sinon from 'sinon'
import createFormMiddleware from '../src/createFormMiddleware'
import formActions from '../src/form.actions'
import * as formActionTypes from '../src/form.actionTypes'
import * as formStatuses from '../src/form.statuses'
import { createDispatch, createGetState } from 'slex-store'
import testUtils from './testUtils'

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
      const submitterStub = sandbox.stub().returns(Promise.resolve(true))
      const formMiddleware = createFormMiddleware({
        forms: {
          testFormName: {
            submit: submitterStub,
            validators: validatorsStub
          }
        }
      })
      expect(formMiddleware !== null && typeof formMiddleware === 'object').to.equal(true)
    })
    describe('submitFormMiddleware', function () {
      describe('given that the form has validation errors', function () {
        const formName = 'testFormName'
        const fieldName = 'testField1'
        const fieldName2 = 'testField2'
        let state
        beforeEach(function () {
          state = {
            form: {
              [formName]: {
                status: formStatuses.VALID,
                [fieldName]: {
                  validate: 'validate'
                },
                [fieldName2]: {
                  validate: 'validate2'
                }
              }
            }
          }
        })
        it('should validate all fields then dispatch submitFormFail', function () {
          const submitResult = { test: 'test' }
          const validateResult = new Error('validate result')
          const validatorStub = sandbox.stub().returns(Promise.resolve(validateResult))
          const validatorStub2 = sandbox.stub().returns(Promise.reject(validateResult))
          const submitterStub = sandbox.stub().returns(Promise.resolve(submitResult))
          const validatorsStub = {
            validate: validatorStub,
            validate2: validatorStub2
          }

          
          const dispatchSpy = sandbox.spy()
          const getStateStub = sandbox.stub().returns(state)
          const action = formActions.submitForm({ formName })
          const submitFormFailActionStubResult = {}
          const submitFormFailActionStub = sandbox.stub(formActions, 'submitFormFail').returns(submitFormFailActionStubResult)
          const formMiddleware = createFormMiddleware({
            forms: {
              [formName]: {
                submit: submitterStub,
                validators: validatorsStub
              }
            }
          })
          return formMiddleware
            .submitFormMiddleware(dispatchSpy, getStateStub, action)
            .then(() => {
              expect(submitterStub.notCalled).to.equal(true)
              expect(validatorStub.called).to.equal(true)
              expect(validatorStub.lastCall.calledBefore(dispatchSpy.firstCall)).to.equal(true)
              expect(submitFormFailActionStub.calledOnce).to.equal(true)
              expect(submitFormFailActionStub.firstCall.args[0].validationErrors[fieldName]).to.equal(validateResult.message)
              expect(submitFormFailActionStub.firstCall.args[0].validationErrors[fieldName2]).to.equal(validateResult.message)
              expect(submitFormFailActionStub.firstCall.args[0].formName).to.equal(formName)
              expect(dispatchSpy.firstCall.args[0]).to.equal(submitFormFailActionStubResult)
            })
        })
      })
      describe('given that the form doesnt have any validation errors', function () {
        const formName = 'testFormName'
        const fieldName = 'testField1'
        let state
        beforeEach(function () {
          state = {
            form: {
              [formName]: {
                status: formStatuses.VALID,
                [fieldName]: {
                  validate: 'validate'
                }
              }
            }
          }
        })
        it('should validate all fields, then apply submitter, then dispatch submitFormSuccess', function () {
          const submitResult = { test: 'test' }
          const validateResult = {}
          const validatorStub = sandbox.stub().returns(Promise.resolve(validateResult))
          const submitterStub = sandbox.stub().returns(Promise.resolve(submitResult))
          const validatorsStub = {
            validate: validatorStub
          }
          const dispatchSpy = sandbox.spy()
          const getStateStub = sandbox.stub().returns(state)
          const action = formActions.submitForm({ formName })
          const submitFormSuccessActionStubResult = {}
          const submitFormSuccessActionStub = sandbox.stub(formActions, 'submitFormSuccess').returns(submitFormSuccessActionStubResult)
          const formMiddleware = createFormMiddleware({
            forms: {
              [formName]: {
                submit: submitterStub,
                validators: validatorsStub
              }
            }
          })
          return formMiddleware
            .submitFormMiddleware(dispatchSpy, getStateStub, action)
            .then(() => {
              expect(submitterStub.calledOnce).to.equal(true)
              expect(validatorStub.lastCall.calledBefore(submitterStub.firstCall)).to.equal(true)
              expect(submitterStub.firstCall.calledBefore(dispatchSpy.firstCall)).to.equal(true)
              expect(submitFormSuccessActionStub.calledOnce).to.equal(true)
              expect(submitFormSuccessActionStub.firstCall.args[0].result).to.equal(submitResult)
              expect(submitFormSuccessActionStub.firstCall.args[0].formName).to.equal(formName)
              expect(dispatchSpy.firstCall.args[0]).to.equal(submitFormSuccessActionStubResult)
            })
        })
      })
      describe('given that the submitter fails', function () {
        const formName = 'testFormName'
        const fieldName = 'testField1'
        let state
        beforeEach(function () {
          state = {
            form: {
              [formName]: {
                status: formStatuses.VALID,
                [fieldName]: {
                  validate: 'validate'
                }
              }
            }
          }
        })
        it('should validate all fields, then apply submitter, then dispatch submitFormFail', function () {
          const submitResult = new Error('submit error')
          const validateResult = {}
          const validatorStub = sandbox.stub().returns(Promise.resolve(validateResult))
          const submitterStub = sandbox.stub().returns(Promise.reject(submitResult))
          const validatorsStub = {
            validate: validatorStub
          }
          const dispatchSpy = sandbox.spy()
          const getStateStub = sandbox.stub().returns(state)
          const action = formActions.submitForm({ formName })
          const submitFormFailActionStubResult = {}
          const submitFormFailActionStub = sandbox.stub(formActions, 'submitFormFail').returns(submitFormFailActionStubResult)
          const formMiddleware = createFormMiddleware({
            forms: {
              [formName]: {
                submit: submitterStub,
                validators: validatorsStub
              }
            }
          })
          return formMiddleware
            .submitFormMiddleware(dispatchSpy, getStateStub, action)
            .then(() => {
              expect(submitterStub.calledOnce).to.equal(true)
              expect(validatorStub.lastCall.calledBefore(submitterStub.firstCall)).to.equal(true)
              expect(submitterStub.firstCall.calledBefore(dispatchSpy.firstCall)).to.equal(true)
              expect(submitFormFailActionStub.calledOnce).to.equal(true)
              expect(submitFormFailActionStub.firstCall.args[0].error).to.equal(submitResult.message)
              expect(submitFormFailActionStub.firstCall.args[0].formName).to.equal(formName)
              expect(dispatchSpy.firstCall.args[0]).to.equal(submitFormFailActionStubResult)
            })
        })
      })
    })
    describe('validateFieldOnChangeValueMiddleware', function () {
      describe('given the field value remains the same upon completing validation', function () {
        const formName = 'testFormName'
        const fieldName = 'testField'
        let state
        beforeEach(function () {
          state = {
            form: {
              [formName]: {
                status: formStatuses.VALIDATING,
                [fieldName]: {
                  validate: 'validate'
                }
              }
            }
          }
        })
        describe('when the validation succeeds', function () {
          it('should validate field and dispatch isValid', function () {
            const validateResult = {}
            const validatorStub = sandbox.stub().returns(Promise.resolve(validateResult))
            const validatorsStub = {
              validate: validatorStub
            }
            const dispatchSpy = sandbox.spy()
            const getStateStub = sandbox.stub().returns(state)
            const action = formActions.changeValue({ formName, fieldName })
            const isValidActionStubResult = {}
            const isValidActionStub = sandbox.stub(formActions, 'isValid').returns(isValidActionStubResult)
            const formMiddleware = createFormMiddleware({
              forms: {
                [formName]: {
                  validators: validatorsStub
                }
              }
            })
            return formMiddleware
              .validateFieldOnChangeValueMiddleware(dispatchSpy, getStateStub, action)
              .then(() => {
                expect(validatorStub.calledOnce).to.equal(true)
                expect(isValidActionStub.calledOnce).to.equal(true)
                expect(isValidActionStub.firstCall.args[0].formName).to.equal(formName)
                expect(isValidActionStub.firstCall.args[0].fieldName).to.equal(fieldName)
              })
          })
        })
        describe('when the validation fails', function () {
          it('should validate field and dispatch isInvalid', function () {
            const validateResult = new Error('validation error')
            const fieldValidateDeferred = testUtils.defer()
            const validatorStub = sandbox.stub().returns(Promise.resolve(validateResult))
            const validatorsStub = {
              validate: validatorStub
            }
            const dispatchSpy = sandbox.spy()
            const getStateStub = sandbox.stub().returns(state)
            const action = formActions.changeValue({ formName, fieldName })
            const isInvalidActionStubResult = {}
            const isInvalidActionStub = sandbox.stub(formActions, 'isInvalid').returns(isInvalidActionStubResult)
            const formMiddleware = createFormMiddleware({
              forms: {
                [formName]: {
                  validators: validatorsStub
                }
              }
            })
            return formMiddleware
              .validateFieldOnChangeValueMiddleware(dispatchSpy, getStateStub, action)
              .then(() => {
                expect(validatorStub.calledOnce).to.equal(true)
                expect(isInvalidActionStub.calledOnce).to.equal(true)
                expect(isInvalidActionStub.firstCall.args[0].formName).to.equal(formName)
                expect(isInvalidActionStub.firstCall.args[0].fieldName).to.equal(fieldName)
              })
          })
        })
        describe('when the validation rejects', function () {
          it('should validate field and dispatch isInvalid', function () {
            const validateResult = new Error('validation error')
            const validatorStub = sandbox.stub().returns(Promise.reject(validateResult))
            const validatorsStub = {
              validate: validatorStub
            }
            const dispatchSpy = sandbox.spy()
            const getStateStub = sandbox.stub().returns(state)
            const action = formActions.changeValue({ formName, fieldName })
            const isInvalidActionStubResult = {}
            const isInvalidActionStub = sandbox.stub(formActions, 'isInvalid').returns(isInvalidActionStubResult)
            const formMiddleware = createFormMiddleware({
              forms: {
                [formName]: {
                  validators: validatorsStub
                }
              }
            })
            return formMiddleware
              .validateFieldOnChangeValueMiddleware(dispatchSpy, getStateStub, action)
              .then(() => {
                expect(validatorStub.calledOnce).to.equal(true)
                expect(isInvalidActionStub.calledOnce).to.equal(true)
                expect(isInvalidActionStub.firstCall.args[0].formName).to.equal(formName)
                expect(isInvalidActionStub.firstCall.args[0].fieldName).to.equal(fieldName)
              })
          })
        })
      })
      describe('given the field value has changed upon completing validating', function () {
        const formName = 'testFormName'
        const fieldName = 'testField'
        let state
        beforeEach(function () {
          state = {
            form: {
              [formName]: {
                status: formStatuses.VALIDATING,
                [fieldName]: {
                  validate: 'validate'
                }
              }
            }
          }
        })
        describe('when the validation succeeds', function () {
          it('should validate field and should do noting', function () {
            const validateResult = {}
            const validatorStub = sandbox.stub().returns(Promise.resolve(validateResult))
            const validatorsStub = {
              validate: validatorStub
            }
            const dispatchSpy = sandbox.spy()
            const getStateStub = sandbox.stub().returns(state)
            const action = formActions.changeValue({ formName, fieldName, value: 'differentValueToWhatsInStore' })
            const formMiddleware = createFormMiddleware({
              forms: {
                [formName]: {
                  validators: validatorsStub
                }
              }
            })
            return formMiddleware
              .validateFieldOnChangeValueMiddleware(dispatchSpy, getStateStub, action)
              .then(() => {
                expect(validatorStub.calledOnce).to.equal(true)
                expect(dispatchSpy.notCalled).to.equal(true)
              })
          })
        })
        describe('when the validation fails', function () {
          it('should validate field and should do noting', function () {
            const validateResult = new Error('validation error')
            const validatorStub = sandbox.stub().returns(Promise.resolve(validateResult))
            const validatorsStub = {
              validate: validatorStub
            }
            const dispatchSpy = sandbox.spy()
            const getStateStub = sandbox.stub().returns(state)
            const action = formActions.changeValue({ formName, fieldName, value: 'differentValueToWhatsInStore' })
            const formMiddleware = createFormMiddleware({
              forms: {
                [formName]: {
                  validators: validatorsStub
                }
              }
            })
            return formMiddleware
              .validateFieldOnChangeValueMiddleware(dispatchSpy, getStateStub, action)
              .then(() => {
                expect(validatorStub.calledOnce).to.equal(true)
                expect(dispatchSpy.notCalled).to.equal(true)
              })
          })
        })
        describe('when the validation rejects', function () {
          it('should validate field and should do noting', function () {
            const validateResult = new Error('validation error')
            const validatorStub = sandbox.stub().returns(Promise.reject(validateResult))
            const validatorsStub = {
              validate: validatorStub
            }
            const dispatchSpy = sandbox.spy()
            const getStateStub = sandbox.stub().returns(state)
            const action = formActions.changeValue({ formName, fieldName, value: 'differentValueToWhatsInStore' })
            const formMiddleware = createFormMiddleware({
              forms: {
                [formName]: {
                  validators: validatorsStub
                }
              }
            })
            return formMiddleware
              .validateFieldOnChangeValueMiddleware(dispatchSpy, getStateStub, action)
              .then(() => {
                expect(validatorStub.calledOnce).to.equal(true)
                expect(dispatchSpy.notCalled).to.equal(true)
              })
          })
        })
      })
    })
  })
})
