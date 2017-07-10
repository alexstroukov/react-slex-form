import React from 'react'
import { mount, shallow } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'
import Field, { Field as DisconnectedField } from '../src/Field'
import form from '../src'
import formActions from '../src/form.actions'
import * as formActionTypes from '../src/form.actionTypes'
import createStore from 'slex-store'
import { Provider } from 'react-slex-store'

describe('Field', function () {
  const sandbox = sinon.sandbox.create()
  const formName = 'formName'
  const fieldName = 'fieldName'
  let store

  beforeEach(function () {
    sandbox.restore()
    store = createStore({
      reducers: {
        form
      }
    })
  })

  afterEach(function () {
    sandbox.restore()
  })

  it('should register the field on the store when mounted', function () {
    const dispatchSpy = sandbox.spy(store, 'dispatch')
    const stubRegisterFieldAction = {}
    const registerFieldStub = sandbox.stub(formActions, 'registerField').returns(stubRegisterFieldAction)
    mount(
      <Provider store={store}>
        <Field formName={formName} fieldName={fieldName} />
      </Provider>
    )
    expect(dispatchSpy.calledOnce).to.be.true
    expect(registerFieldStub.calledOnce).to.be.true
    expect(dispatchSpy.firstCall.args[0]).to.equal(stubRegisterFieldAction)
  })
  it('should unregister the field on the store before unmounting', function () {
    const dispatchSpy = sandbox.spy(store, 'dispatch')
    const stubUnregisterFieldAction = {}
    const stubRegisterFieldAction = {}
    const registerFieldStub = sandbox.stub(formActions, 'registerField').returns(stubRegisterFieldAction)
    const unregisterFieldStub = sandbox.stub(formActions, 'unregisterField').returns(stubUnregisterFieldAction)
    const wrapper = mount(
      <Provider store={store}>
        <Field formName={formName} fieldName={fieldName} />
      </Provider>
    )

    wrapper.unmount()

    expect(dispatchSpy.calledTwice).to.be.true
    expect(registerFieldStub.calledOnce).to.be.true
    expect(unregisterFieldStub.calledOnce).to.be.true
    expect(dispatchSpy.secondCall.args[0]).to.equal(stubUnregisterFieldAction)
  })
  it('should skip unregistering the field on the store before unmounting if the field is rendered with stayRegistered prop', function () {
    const dispatchSpy = sandbox.spy(store, 'dispatch')
    const stubUnregisterFieldAction = {}
    const stubRegisterFieldAction = {}
    const registerFieldStub = sandbox.stub(formActions, 'registerField').returns(stubRegisterFieldAction)
    const unregisterFieldStub = sandbox.stub(formActions, 'unregisterField').returns(stubUnregisterFieldAction)
    const wrapper = mount(
      <Provider store={store}>
        <Field formName={formName} fieldName={fieldName} stayRegistered />
      </Provider>
    )

    wrapper.unmount()

    expect(dispatchSpy.calledOnce).to.be.true
    expect(registerFieldStub.calledOnce).to.be.true
    expect(unregisterFieldStub.notCalled).to.be.true
    expect(dispatchSpy.firstCall.args[0]).to.equal(stubRegisterFieldAction)
  })

  describe('given that the value given to the field from its own props has changed', function () {
    it('should change the fields initial value in the store')
  })

  describe('given that the field has been registered on the store', function () {
    it('should get its value from the store')
    it('should get its isTouched from the store')
    it('should get isLoading when the store status is VALIDATING')
    it('should get an array of string messages from the fields error in the store when error is an array of Error objects')
    it('should get an array of string messages from the fields error in the store when error is an Error object')
  })

  describe('given that the field has not finished registering on the store', function () {
    it('should get its value from its own props')
    it('should get isTouched false')

  })
})
