import React, { Component } from 'react'
import { mount, configure } from 'enzyme'
import ReactSixteenAdapter from 'enzyme-adapter-react-16'
import { expect } from 'chai'
import sinon from 'sinon'
import connectForm from '../src/connectForm'
import form from '../src'
import formActions from '../src/form.actions'
import * as formStatuses from '../src/form.statuses'
import formSelectors from '../src/form.selectors'
import slexStore from 'slex-store'
import testUtils from './testUtils';

// need adapter to work with react ^16
configure({ adapter: new ReactSixteenAdapter() })

describe('connectForm', function () {
  const sandbox = sinon.sandbox.create()
  const formName = 'formName'
  const fieldName2 = 'fieldName2'
  const fieldName = 'fieldName'
  beforeEach(function () {
    sandbox.restore()
  })
  afterEach(function () {
    sandbox.restore()
  })
  describe('when applied to a component', function () {
    let store
    let registerFieldStub
    let getFormStub
    let getFormStubResult = {
      submitting: true,
      canSubmit: true,
      submitError: 'test error'
    }
    let ComponentStub
    beforeEach(function () {
      store =
        slexStore.createStore(
          slexStore.createDispatch({
            reducer: slexStore.createReducer({
              form
            })
          })
        )
      getFormStub = sandbox.stub(formSelectors, 'getForm').returns(getFormStubResult)
      ComponentStub = sandbox.stub().returns(null)
      const WrappedComponent = connectForm('test')(ComponentStub)
      mount(<WrappedComponent store={store} />)
    })
    it('should provide form component with submitting flag', function () {
      expect(ComponentStub.calledOnce).to.be.true
      expect(ComponentStub.firstCall.args[0].submitting).to.exist
      expect(ComponentStub.firstCall.args[0].submitting).to.be.a('boolean')
      expect(ComponentStub.firstCall.args[0].submitting).to.equal(getFormStubResult.submitting)
    })
    it('should provide form component with canSubmit flag', function () {
      expect(ComponentStub.calledOnce).to.be.true
      expect(ComponentStub.firstCall.args[0].canSubmit).to.exist
      expect(ComponentStub.firstCall.args[0].canSubmit).to.be.a('boolean')
      expect(ComponentStub.firstCall.args[0].canSubmit).to.equal(getFormStubResult.canSubmit)
    })
    it('should provide form component with submitError flag', function () {
      expect(ComponentStub.calledOnce).to.be.true
      expect(ComponentStub.firstCall.args[0].submitError).to.exist
      expect(ComponentStub.firstCall.args[0].submitError).to.be.a('string')
      expect(ComponentStub.firstCall.args[0].submitError).to.equal(getFormStubResult.submitError)
    })
    it('should provide form component with resetForm function', function () {
      expect(ComponentStub.calledOnce).to.be.true
      expect(ComponentStub.firstCall.args[0].resetForm).to.exist
      expect(ComponentStub.firstCall.args[0].resetForm).to.be.a('function')
    })
    it('should provide form component with submitForm function', function () {
      expect(ComponentStub.calledOnce).to.be.true
      expect(ComponentStub.firstCall.args[0].submitForm).to.exist
      expect(ComponentStub.firstCall.args[0].submitForm).to.be.a('function')
    })
    it('should provide form component with dispatchForm function', function () {
      expect(ComponentStub.calledOnce).to.be.true
      expect(ComponentStub.firstCall.args[0].dispatchForm).to.equal(store.dispatch)
    })
    it('should provide form component with getFormState function', function () {
      expect(ComponentStub.calledOnce).to.be.true
      expect(ComponentStub.firstCall.args[0].getFormState).to.equal(store.getState)
    })
  })
  describe('submitForm', function () {
    describe('when the form has validation errors', function () {
      let store
      let state
      let ComponentStub
      let validatorStub
      let validatorStub2
      let submitterStub
      let dispatchSpy
      let getStateStub
      let submitFormActionStub
      let submitFormFailActionStub
      const validateResult = new Error('validate result')
      const submitResult = { test: 'test' }
      const submitFormActionStubResult = {}
      const submitFormFailActionStubResult = {}
      beforeEach(function () {
        store =
          slexStore.createStore(
            slexStore.createDispatch({
              reducer: slexStore.createReducer({
                form
              })
            })
          )
        validatorStub = sandbox.stub().returns(Promise.resolve(validateResult))
        validatorStub2 = sandbox.stub().returns(Promise.resolve(validateResult))
        state = {
          form: {
            [formName]: {
              status: formStatuses.VALID,
              [fieldName]: {
                validate: validatorStub
              },
              [fieldName2]: {
                validate: validatorStub2
              }
            }
          }
        }
        dispatchSpy = sandbox.spy(store, 'dispatch')
        getStateStub = sandbox.stub(store, 'getState').returns(state)
        submitterStub = sandbox.stub().returns(Promise.resolve(submitResult))
        submitFormActionStub = sandbox.stub(formActions, 'submitForm').returns(submitFormActionStubResult)
        submitFormFailActionStub = sandbox.stub(formActions, 'submitFormFail').returns(submitFormFailActionStubResult)
        ComponentStub = sandbox.stub().returns(null)
        const WrappedComponent = connectForm(formName)(ComponentStub)
        mount(<WrappedComponent store={store} />)
      })
      it('should dispatch submitForm, then validate all fields, then dispatch submitFormFail', function () {
        const submitForm = ComponentStub.firstCall.args[0].submitForm
        return submitForm(submitterStub)
          .then(() => {
            expect(submitterStub.notCalled).to.equal(true)
            expect(validatorStub.called).to.equal(true)
            expect(validatorStub.lastCall.calledBefore(dispatchSpy.secondCall)).to.equal(true)
            expect(validatorStub2.called).to.equal(true)
            expect(validatorStub2.lastCall.calledBefore(dispatchSpy.secondCall)).to.equal(true)
            expect(submitFormFailActionStub.calledOnce).to.equal(true)
            expect(submitFormFailActionStub.firstCall.args[0].validationErrors[fieldName]).to.equal(validateResult.message)
            expect(submitFormFailActionStub.firstCall.args[0].validationErrors[fieldName2]).to.equal(validateResult.message)
            expect(submitFormFailActionStub.firstCall.args[0].formName).to.equal(formName)
            expect(dispatchSpy.firstCall.args[0]).to.equal(submitFormActionStubResult)
            expect(dispatchSpy.secondCall.args[0]).to.equal(submitFormFailActionStubResult)
          })
      })
    })
    describe('when the form doesnt have any validation errors', function () {
      let store
      let state
      let ComponentStub
      let validatorStub
      let validatorStub2
      let submitterStub
      let dispatchSpy
      let getStateStub
      let submitFormActionStub
      let submitFormSuccessActionStub
      const validateResult = undefined
      const submitResult = { test: 'test' }
      const submitFormActionStubResult = {}
      const submitFormSuccessActionStubResult = {}
      beforeEach(function () {
        store =
          slexStore.createStore(
            slexStore.createDispatch({
              reducer: slexStore.createReducer({
                form
              })
            })
          )
        validatorStub = sandbox.stub().returns(Promise.resolve(validateResult))
        validatorStub2 = sandbox.stub().returns(Promise.resolve(validateResult))
        state = {
          form: {
            [formName]: {
              status: formStatuses.VALID,
              [fieldName]: {
                validate: validatorStub
              },
              [fieldName2]: {
                validate: validatorStub2
              }
            }
          }
        }
        dispatchSpy = sandbox.spy(store, 'dispatch')
        getStateStub = sandbox.stub(store, 'getState').returns(state)
        submitterStub = sandbox.stub().returns(Promise.resolve(submitResult))
        submitFormActionStub = sandbox.stub(formActions, 'submitForm').returns(submitFormActionStubResult)
        submitFormSuccessActionStub = sandbox.stub(formActions, 'submitFormSuccess').returns(submitFormSuccessActionStubResult)
        ComponentStub = sandbox.stub().returns(null)
        const WrappedComponent = connectForm(formName)(ComponentStub)
        mount(<WrappedComponent store={store} />)
      })
      it('should dispatch submitForm, then validate all fields, then apply submitter, then dispatch submitFormSuccess', function () {
        const submitForm = ComponentStub.firstCall.args[0].submitForm
        return submitForm(submitterStub)
          .then((result) => {
            expect(submitterStub.calledOnce).to.equal(true)
            expect(validatorStub.called).to.equal(true)
            expect(validatorStub.lastCall.calledBefore(dispatchSpy.secondCall)).to.equal(true)
            expect(validatorStub2.called).to.equal(true)
            expect(validatorStub2.lastCall.calledBefore(dispatchSpy.secondCall)).to.equal(true)
            expect(submitterStub.firstCall.calledBefore(dispatchSpy.secondCall)).to.equal(true)
            expect(submitFormSuccessActionStub.calledOnce).to.equal(true)
            expect(submitFormSuccessActionStub.firstCall.args[0].formName).to.equal(formName)
            expect(submitFormSuccessActionStub.firstCall.args[0].result).to.equal(submitResult)
            expect(dispatchSpy.firstCall.args[0]).to.equal(submitFormActionStubResult)
            expect(dispatchSpy.secondCall.args[0]).to.equal(submitFormSuccessActionStubResult)
            expect(result).to.equal(submitResult)
          })
      })
    })
  })
  describe('when the form doesnt have any validation errors but the submitter fails', function () {
    let store
    let state
    let ComponentStub
    let validatorStub
    let validatorStub2
    let submitterStub
    let dispatchSpy
    let getStateStub
    let submitFormActionStub
    let submitFormFailActionStub
    const validateResult = undefined
    const submitResult = new Error('submit error')
    const submitFormActionStubResult = {}
    const submitFormFailActionStubResult = {}
    beforeEach(function () {
      store =
        slexStore.createStore(
          slexStore.createDispatch({
            reducer: slexStore.createReducer({
              form
            })
          })
        )
      validatorStub = sandbox.stub().returns(Promise.resolve(validateResult))
      validatorStub2 = sandbox.stub().returns(Promise.resolve(validateResult))
      state = {
        form: {
          [formName]: {
            status: formStatuses.VALID,
            [fieldName]: {
              validate: validatorStub
            },
            [fieldName2]: {
              validate: validatorStub2
            }
          }
        }
      }
      dispatchSpy = sandbox.spy(store, 'dispatch')
      getStateStub = sandbox.stub(store, 'getState').returns(state)
      submitterStub = sandbox.stub().returns(Promise.reject(submitResult))
      submitFormActionStub = sandbox.stub(formActions, 'submitForm').returns(submitFormActionStubResult)
      submitFormFailActionStub = sandbox.stub(formActions, 'submitFormFail').returns(submitFormFailActionStubResult)
      ComponentStub = sandbox.stub().returns(null)
      const WrappedComponent = connectForm(formName)(ComponentStub)
      mount(<WrappedComponent store={store} />)
    })
    it('should dispatch submitForm, then validate all fields, then apply submitter, then dispatch submitFormFail', function () {
      const submitForm = ComponentStub.firstCall.args[0].submitForm
      return submitForm(submitterStub)
        .then((result) => {
          expect(submitterStub.calledOnce).to.equal(true)
          expect(validatorStub.called).to.equal(true)
          expect(validatorStub.lastCall.calledBefore(dispatchSpy.secondCall)).to.equal(true)
          expect(validatorStub2.called).to.equal(true)
          expect(validatorStub2.lastCall.calledBefore(dispatchSpy.secondCall)).to.equal(true)
          expect(submitterStub.firstCall.calledBefore(dispatchSpy.secondCall)).to.equal(true)
          expect(submitFormFailActionStub.calledOnce).to.equal(true)
          expect(submitFormFailActionStub.firstCall.args[0].formName).to.equal(formName)
          expect(submitFormFailActionStub.firstCall.args[0].error).to.equal(submitResult.message)
          expect(dispatchSpy.firstCall.args[0]).to.equal(submitFormActionStubResult)
          expect(dispatchSpy.secondCall.args[0]).to.equal(submitFormFailActionStubResult)
        })
    })
  })
  describe('resetForm', function () {
      let store
      let ComponentStub
      let dispatchSpy
      let resetFormActionStub
      const resetFormActionStubResult = {}
      beforeEach(function () {
        store =
          slexStore.createStore(
            slexStore.createDispatch({
              reducer: slexStore.createReducer({
                form
              })
            })
          )
        resetFormActionStub = sandbox.stub(formActions, 'resetForm').returns(resetFormActionStubResult)
        dispatchSpy = sandbox.spy(store, 'dispatch')
        ComponentStub = sandbox.stub().returns(null)
        const WrappedComponent = connectForm(formName)(ComponentStub)
        mount(<WrappedComponent store={store} />)
      })
      it('should dispatch resetForm', function () {
        const resetForm = ComponentStub.firstCall.args[0].resetForm
        resetForm()
        expect(dispatchSpy.calledOnce).to.equal(true)
        expect(resetFormActionStub.calledOnce).to.equal(true)
        expect(dispatchSpy.firstCall.args[0]).to.equal(resetFormActionStubResult)
      })
  })
})
