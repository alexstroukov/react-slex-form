import React, { Component } from 'react'
import { mount, shallow, configure } from 'enzyme'
import ReactSixteenAdapter from 'enzyme-adapter-react-16'
import { expect } from 'chai'
import sinon from 'sinon'
import FormProvider from '../src/FormProvider'
import form from '../src'
import formActions from '../src/form.actions'
import * as formStatuses from '../src/form.statuses'
import validatorsStore from '../src/validatorsStore'
import slexStore from 'slex-store'

// need adapter to work with react ^16
configure({ adapter: new ReactSixteenAdapter() })

describe('FormProvider', function () {
  const sandbox = sinon.sandbox.create()
  let StubComponent
  let store
  let wrapper
  beforeEach(function () {
    sandbox.restore()
    StubComponent = sandbox.stub().returns(null)
    store =
      slexStore.createStore(
        slexStore.createDispatch({
          reducer: slexStore.createReducer({
            form
          })
        })
      )
    wrapper = mount(
      <FormProvider store={store} />
    )
  })
  afterEach(function () {
    sandbox.restore()
  })
  it('should provide from context', function () {
    const formProviderForm = wrapper.instance().getChildContext().form
    expect(formProviderForm).to.exist
    expect(formProviderForm.registerField).to.exist
    expect(formProviderForm.unregisterField).to.exist
    expect(formProviderForm.changeValue).to.exist
    expect(formProviderForm.changeInitialValue).to.exist
    expect(formProviderForm.getField).to.exist
  })

  describe('changeValue', function () {
    describe('when called', function () {
      const formName = 'testFormName'
      const fieldName = 'testField'
      let store
      let wrapper
      let getStateStub
      let dispatchSpy
      let changeValue
      let changeValueStub
      const stubChangeValueAction = {}
      beforeEach(function () {
        store =
          slexStore.createStore(
            slexStore.createDispatch({
              reducer: slexStore.createReducer({
                form
              })
            })
          )
        getStateStub = sandbox.stub(store, 'getState').returns({
          form: {}
        })
        dispatchSpy = sandbox.spy(store, 'dispatch')
        wrapper = mount(
          <FormProvider store={store} />
        )
        changeValue = wrapper.instance().getChildContext().form.changeValue
        changeValueStub = sandbox.stub(formActions, 'changeValue').returns(stubChangeValueAction)
      })
      it('should dispatch change value', function () {
        changeValue({ formName, fieldName, value: '' })
        expect(dispatchSpy.callCount).to.equal(1)
        expect(dispatchSpy.firstCall.args[0]).to.equal(stubChangeValueAction)
      })
    })
    describe('given the field value remains the same upon completing validation', function () {
      describe('when the validation succeeds', function () {
        const formName = 'testFormName'
        const fieldName = 'testField'
        let store
        let state
        let wrapper
        let getStateStub
        let dispatchSpy
        let changeValue
        let changeValueStub
        let validatorStub
        let getValidatorStub
        let isValidActionStub
        const validateResult = {}
        const stubChangeValueAction = {}
        const isValidActionStubResult = {}
        beforeEach(function () {
          store =
            slexStore.createStore(
              slexStore.createDispatch({
                reducer: slexStore.createReducer({
                  form
                })
              })
            )
          getStateStub = sandbox.stub(store, 'getState').returns({
            form: {
              [formName]: {
                status: formStatuses.VALIDATING,
                [fieldName]: {}
              }
            }
          })
          dispatchSpy = sandbox.spy(store, 'dispatch')
          wrapper = mount(
            <FormProvider store={store} />
          )
          changeValue = wrapper.instance().getChildContext().form.changeValue
          changeValueStub = sandbox.stub(formActions, 'changeValue').returns(stubChangeValueAction)
          validatorStub = sandbox.stub().returns(Promise.resolve(validateResult))
          getValidatorStub = sandbox.stub(validatorsStore, `getValidator`).returns(validatorStub)
          isValidActionStub = sandbox.stub(formActions, 'isValid').returns(isValidActionStubResult)
        })
        it('should validate field and dispatch isValid', function () {
          return changeValue({ formName, fieldName })
            .then(() => {
              expect(validatorStub.calledOnce).to.equal(true)
              expect(isValidActionStub.calledOnce).to.equal(true)
              expect(isValidActionStub.firstCall.args[0].formName).to.equal(formName)
              expect(isValidActionStub.firstCall.args[0].fieldName).to.equal(fieldName)
            })
        })
      })
      describe('when the validation fails', function () {
        const formName = 'testFormName'
        const fieldName = 'testField'
        let store
        let state
        let wrapper
        let getStateStub
        let dispatchSpy
        let changeValue
        let changeValueStub
        let validatorStub
        let getValidatorStub
        let isInvalidActionStub
        const validateResult = new Error('validation error')
        const stubChangeValueAction = {}
        const isInvalidActionStubResult = {}
        beforeEach(function () {
          store =
            slexStore.createStore(
              slexStore.createDispatch({
                reducer: slexStore.createReducer({
                  form
                })
              })
            )
          getStateStub = sandbox.stub(store, 'getState').returns({
            form: {
              [formName]: {
                status: formStatuses.VALIDATING,
                [fieldName]: {}
              }
            }
          })
          dispatchSpy = sandbox.spy(store, 'dispatch')
          wrapper = mount(
            <FormProvider store={store} />
          )
          changeValue = wrapper.instance().getChildContext().form.changeValue
          changeValueStub = sandbox.stub(formActions, 'changeValue').returns(stubChangeValueAction)
          validatorStub = sandbox.stub().returns(Promise.resolve(validateResult))
          getValidatorStub = sandbox.stub(validatorsStore, `getValidator`).returns(validatorStub)
          isInvalidActionStub = sandbox.stub(formActions, 'isInvalid').returns(isInvalidActionStubResult)
        })
        it('should validate field and dispatch isInvalid', function () {
          return changeValue({ formName, fieldName })
            .then(() => {
              expect(validatorStub.calledOnce).to.equal(true)
              expect(isInvalidActionStub.calledOnce).to.equal(true)
              expect(isInvalidActionStub.firstCall.args[0].formName).to.equal(formName)
              expect(isInvalidActionStub.firstCall.args[0].fieldName).to.equal(fieldName)
            })
        })
      })
      describe('when the validation rejects', function () {
        const formName = 'testFormName'
        const fieldName = 'testField'
        let store
        let state
        let wrapper
        let getStateStub
        let dispatchSpy
        let changeValue
        let changeValueStub
        let validatorStub
        let getValidatorStub
        let isInvalidActionStub
        const validateResult = new Error('validation error')
        const stubChangeValueAction = {}
        const isInvalidActionStubResult = {}
        beforeEach(function () {
          store =
            slexStore.createStore(
              slexStore.createDispatch({
                reducer: slexStore.createReducer({
                  form
                })
              })
            )
          getStateStub = sandbox.stub(store, 'getState').returns({
            form: {
              [formName]: {
                status: formStatuses.VALIDATING,
                [fieldName]: {}
              }
            }
          })
          dispatchSpy = sandbox.spy(store, 'dispatch')
          wrapper = mount(
            <FormProvider store={store} />
          )
          changeValue = wrapper.instance().getChildContext().form.changeValue
          changeValueStub = sandbox.stub(formActions, 'changeValue').returns(stubChangeValueAction)
          validatorStub = sandbox.stub().returns(Promise.reject(validateResult))
          getValidatorStub = sandbox.stub(validatorsStore, `getValidator`).returns(validatorStub)
          isInvalidActionStub = sandbox.stub(formActions, 'isInvalid').returns(isInvalidActionStubResult)
        })
        it('should validate field and dispatch isInvalid', function () {
          return changeValue({ formName, fieldName })
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
        const formName = 'testFormName'
        const fieldName = 'testField'
        let store
        let state
        let wrapper
        let getStateStub
        let dispatchSpy
        let changeValue
        let changeValueStub
        let validatorStub
        let getValidatorStub
        let isValidActionStub
        const validateResult = {}
        const stubChangeValueAction = {}
        const isValidActionStubResult = {}
        beforeEach(function () {
          store =
            slexStore.createStore(
              slexStore.createDispatch({
                reducer: slexStore.createReducer({
                  form
                })
              })
            )
          getStateStub = sandbox.stub(store, 'getState').returns({
            form: {
              [formName]: {
                status: formStatuses.VALIDATING,
                [fieldName]: {}
              }
            }
          })
          dispatchSpy = sandbox.spy(store, 'dispatch')
          wrapper = mount(
            <FormProvider store={store} />
          )
          changeValue = wrapper.instance().getChildContext().form.changeValue
          changeValueStub = sandbox.stub(formActions, 'changeValue').returns(stubChangeValueAction)
          validatorStub = sandbox.stub().returns(Promise.resolve(validateResult))
          getValidatorStub = sandbox.stub(validatorsStore, `getValidator`).returns(validatorStub)
          isValidActionStub = sandbox.stub(formActions, 'isValid').returns(isValidActionStubResult)
        })
        it('should validate field and should do nothing', function () {
          return changeValue({ formName, fieldName, value: 'differentValueToWhatsInStore' })
            .then(() => {
              expect(validatorStub.calledOnce).to.equal(true)
              expect(dispatchSpy.calledOnce).to.equal(true)
              expect(dispatchSpy.firstCall.args[0]).to.equal(stubChangeValueAction)
            })
        })
      })
      describe('when the validation fails', function () {
        const formName = 'testFormName'
        const fieldName = 'testField'
        let store
        let state
        let wrapper
        let getStateStub
        let dispatchSpy
        let changeValue
        let changeValueStub
        let validatorStub
        let getValidatorStub
        let isInvalidActionStub
        const validateResult = new Error('validation error')
        const stubChangeValueAction = {}
        const isInvalidActionStubResult = {}
        beforeEach(function () {
          store =
            slexStore.createStore(
              slexStore.createDispatch({
                reducer: slexStore.createReducer({
                  form
                })
              })
            )
          getStateStub = sandbox.stub(store, 'getState').returns({
            form: {
              [formName]: {
                status: formStatuses.VALIDATING,
                [fieldName]: {}
              }
            }
          })
          dispatchSpy = sandbox.spy(store, 'dispatch')
          wrapper = mount(
            <FormProvider store={store} />
          )
          changeValue = wrapper.instance().getChildContext().form.changeValue
          changeValueStub = sandbox.stub(formActions, 'changeValue').returns(stubChangeValueAction)
          validatorStub = sandbox.stub().returns(Promise.resolve(validateResult))
          getValidatorStub = sandbox.stub(validatorsStore, `getValidator`).returns(validatorStub)
          isInvalidActionStub = sandbox.stub(formActions, 'isInvalid').returns(isInvalidActionStubResult)
        })
        it('should validate field and should do nothing', function () {
          return changeValue({ formName, fieldName, value: 'differentValueToWhatsInStore' })
            .then(() => {
              expect(validatorStub.calledOnce).to.equal(true)
              expect(dispatchSpy.calledOnce).to.equal(true)
              expect(dispatchSpy.firstCall.args[0]).to.equal(stubChangeValueAction)
            })
        })
      })
      describe('when the validation rejects', function () {
        const formName = 'testFormName'
        const fieldName = 'testField'
        let store
        let state
        let wrapper
        let getStateStub
        let dispatchSpy
        let changeValue
        let changeValueStub
        let validatorStub
        let getValidatorStub
        let isInvalidActionStub
        const validateResult = new Error('validation error')
        const stubChangeValueAction = {}
        const isInvalidActionStubResult = {}
        beforeEach(function () {
          store =
            slexStore.createStore(
              slexStore.createDispatch({
                reducer: slexStore.createReducer({
                  form
                })
              })
            )
          getStateStub = sandbox.stub(store, 'getState').returns({
            form: {
              [formName]: {
                status: formStatuses.VALIDATING,
                [fieldName]: {}
              }
            }
          })
          dispatchSpy = sandbox.spy(store, 'dispatch')
          wrapper = mount(
            <FormProvider store={store} />
          )
          changeValue = wrapper.instance().getChildContext().form.changeValue
          changeValueStub = sandbox.stub(formActions, 'changeValue').returns(stubChangeValueAction)
          validatorStub = sandbox.stub().returns(Promise.reject(validateResult))
          getValidatorStub = sandbox.stub(validatorsStore, `getValidator`).returns(validatorStub)
          isInvalidActionStub = sandbox.stub(formActions, 'isInvalid').returns(isInvalidActionStubResult)
        })
        it('should validate field and should do nothing', function () {
          return changeValue({ formName, fieldName, value: 'differentValueToWhatsInStore' })
            .then(() => {
              expect(validatorStub.calledOnce).to.equal(true)
              expect(dispatchSpy.calledOnce).to.equal(true)
              expect(dispatchSpy.firstCall.args[0]).to.equal(stubChangeValueAction)
            })
        })
      })
    })
  })
})
