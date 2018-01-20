import { expect } from 'chai'
import sinon from 'sinon'
import formMiddleware from '../src/form.middleware'
import formActions from '../src/form.actions'
import * as formActionTypes from '../src/form.actionTypes'
import * as formStatuses from '../src/form.statuses'
import { createDispatch, createGetState } from 'slex-store'
import testUtils from './testUtils'

describe('form.middleware', function () {
  const sandbox = sinon.sandbox.create()
  beforeEach(function () {
    sandbox.restore()
  })
  afterEach(function () {
    sandbox.restore()
  })
  describe('validateFieldOnChangeValueMiddleware', function () {
    describe('given the field value remains the same upon completing validation', function () {
      const formName = 'testFormName'
      const fieldName = 'testField'
      let state
      describe('when the validation succeeds', function () {
        let validatorStub
        const validateResult = {}
        beforeEach(function () {
          validatorStub = sandbox.stub().returns(Promise.resolve(validateResult))
          state = {
            form: {
              [formName]: {
                status: formStatuses.VALIDATING,
                [fieldName]: {
                  validate: validatorStub
                }
              }
            }
          }
        })
        it('should validate field and dispatch isValid', function () {
          const dispatchSpy = sandbox.spy()
          const getStateStub = sandbox.stub().returns(state)
          const action = formActions.changeValue({ formName, fieldName })
          const isValidActionStubResult = {}
          const isValidActionStub = sandbox.stub(formActions, 'isValid').returns(isValidActionStubResult)
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
        let validatorStub
        const validateResult = new Error('validation error')
        beforeEach(function () {
          validatorStub = sandbox.stub().returns(Promise.resolve(validateResult))
          state = {
            form: {
              [formName]: {
                status: formStatuses.VALIDATING,
                [fieldName]: {
                  validate: validatorStub
                }
              }
            }
          }
        })
        it('should validate field and dispatch isInvalid', function () {
          const dispatchSpy = sandbox.spy()
          const getStateStub = sandbox.stub().returns(state)
          const action = formActions.changeValue({ formName, fieldName })
          const isInvalidActionStubResult = {}
          const isInvalidActionStub = sandbox.stub(formActions, 'isInvalid').returns(isInvalidActionStubResult)
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
        let validatorStub
        const validateResult = new Error('validation error')
        beforeEach(function () {
          validatorStub = sandbox.stub().returns(Promise.reject(validateResult))
          state = {
            form: {
              [formName]: {
                status: formStatuses.VALIDATING,
                [fieldName]: {
                  validate: validatorStub
                }
              }
            }
          }
        })
        it('should validate field and dispatch isInvalid', function () {
          const dispatchSpy = sandbox.spy()
          const getStateStub = sandbox.stub().returns(state)
          const action = formActions.changeValue({ formName, fieldName })
          const isInvalidActionStubResult = {}
          const isInvalidActionStub = sandbox.stub(formActions, 'isInvalid').returns(isInvalidActionStubResult)
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
    describe('given the field value has changed by the time validation completes for the previous value', function () {
      const formName = 'testFormName'
      const fieldName = 'testField'
      let state
      describe('when the validation succeeds', function () {
        let validatorStub
        const validateResult = {}
        beforeEach(function () {
          validatorStub = sandbox.stub().returns(Promise.resolve(validateResult))
          state = {
            form: {
              [formName]: {
                status: formStatuses.VALIDATING,
                [fieldName]: {
                  validate: validatorStub
                }
              }
            }
          }
        })
        it('should validate field and should do noting', function () {
          const dispatchSpy = sandbox.spy()
          const getStateStub = sandbox.stub().returns(state)
          const action = formActions.changeValue({ formName, fieldName, value: 'differentValueToWhatsInStore' })
          return formMiddleware
            .validateFieldOnChangeValueMiddleware(dispatchSpy, getStateStub, action)
            .then(() => {
              expect(validatorStub.calledOnce).to.equal(true)
              expect(dispatchSpy.notCalled).to.equal(true)
            })
        })
      })
      describe('when the validation fails', function () {
        let validatorStub
        const validateResult = new Error('validation error')
        beforeEach(function () {
          validatorStub = sandbox.stub().returns(Promise.resolve(validateResult))
          state = {
            form: {
              [formName]: {
                status: formStatuses.VALIDATING,
                [fieldName]: {
                  validate: validatorStub
                }
              }
            }
          }
        })
        it('should validate field and should do noting', function () {
          const dispatchSpy = sandbox.spy()
          const getStateStub = sandbox.stub().returns(state)
          const action = formActions.changeValue({ formName, fieldName, value: 'differentValueToWhatsInStore' })
          return formMiddleware
            .validateFieldOnChangeValueMiddleware(dispatchSpy, getStateStub, action)
            .then(() => {
              expect(validatorStub.calledOnce).to.equal(true)
              expect(dispatchSpy.notCalled).to.equal(true)
            })
        })
      })
      describe('when the validation rejects', function () {
        let validatorStub
        const validateResult = new Error('validation error')
        beforeEach(function () {
          validatorStub = sandbox.stub().returns(Promise.reject(validateResult))
          state = {
            form: {
              [formName]: {
                status: formStatuses.VALIDATING,
                [fieldName]: {
                  validate: validatorStub
                }
              }
            }
          }
        })
        it('should validate field and should do noting', function () {
          const dispatchSpy = sandbox.spy()
          const getStateStub = sandbox.stub().returns(state)
          const action = formActions.changeValue({ formName, fieldName, value: 'differentValueToWhatsInStore' })
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
