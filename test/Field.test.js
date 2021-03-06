import React, { Component } from 'react'
import { mount, shallow, configure } from 'enzyme'
import ReactSixteenAdapter from 'enzyme-adapter-react-16'
import { expect } from 'chai'
import sinon from 'sinon'
import Field from '../src/Field'
import FormProvider from '../src/FormProvider'
import form from '../src'
import formActions from '../src/form.actions'
import * as formStatuses from '../src/form.statuses'
import slexStore from 'slex-store'

// need adapter to work with react ^16
configure({ adapter: new ReactSixteenAdapter() })

describe('Field', function () {
  const sandbox = sinon.sandbox.create()
  const formName = 'formName'
  const fieldName = 'fieldName'
  beforeEach(function () {
    sandbox.restore()
  })
  afterEach(function () {
    sandbox.restore()
  })
  describe('when mounting', function () {
    const stubRegisterFieldAction = {}
    const ownProps = {
      testOwnProp: 'testOwnProp'
    }
    let store
    let dispatchSpy
    let registerFieldStub
    let renderStub
    beforeEach(function () {
      store =
        slexStore.createStore(
          slexStore.createDispatch({
            reducer: slexStore.createReducer({
              form
            })
          })
        )
      dispatchSpy = sandbox.spy(store, 'dispatch')
      renderStub = sandbox.stub().returns(null)
      registerFieldStub = sandbox.stub(formActions, 'registerField').returns(stubRegisterFieldAction)
      mount(
        <FormProvider store={store}>
          <Field formName={formName} fieldName={fieldName} render={renderStub} {...ownProps} />
        </FormProvider>
      )
    })
    it('should register the field on the store', function () {
      expect(dispatchSpy.calledOnce).to.be.true
      expect(registerFieldStub.calledOnce).to.be.true
      expect(dispatchSpy.firstCall.args[0]).to.equal(stubRegisterFieldAction)
    })
    it('should render with all additional own props', function () {
      expect(renderStub.calledOnce).to.be.true
      expect(renderStub.firstCall.args[0].testOwnProp).to.equal(ownProps.testOwnProp)
    })
  })
  describe('when unmounting', function () {
    let store
    beforeEach(function () {
      store =
        slexStore.createStore(
          slexStore.createDispatch({
            reducer: slexStore.createReducer({
              form
            })
          })
        )
    })
    it('should unregister the field on the store', function () {
      const dispatchSpy = sandbox.spy(store, 'dispatch')
      const stubUnregisterFieldAction = {}
      const stubRegisterFieldAction = {}
      const registerFieldStub = sandbox.stub(formActions, 'registerField').returns(stubRegisterFieldAction)
      const unregisterFieldStub = sandbox.stub(formActions, 'unregisterField').returns(stubUnregisterFieldAction)
      const wrapper = mount(
        <FormProvider store={store}>
          <Field formName={formName} fieldName={fieldName} />
        </FormProvider>
      )
      wrapper.unmount()
      expect(dispatchSpy.calledTwice).to.be.true
      expect(registerFieldStub.calledOnce).to.be.true
      expect(unregisterFieldStub.calledOnce).to.be.true
      expect(dispatchSpy.secondCall.args[0]).to.equal(stubUnregisterFieldAction)
    })
    it('should skip unregistering the field on the store if the field is rendered with stayRegistered prop', function () {
      const dispatchSpy = sandbox.spy(store, 'dispatch')
      const stubUnregisterFieldAction = {}
      const stubRegisterFieldAction = {}
      const registerFieldStub = sandbox.stub(formActions, 'registerField').returns(stubRegisterFieldAction)
      const unregisterFieldStub = sandbox.stub(formActions, 'unregisterField').returns(stubUnregisterFieldAction)
      const wrapper = mount(
        <FormProvider store={store}>
          <Field formName={formName} fieldName={fieldName} stayRegistered />
        </FormProvider>
      )
      wrapper.unmount()
      expect(dispatchSpy.calledOnce).to.be.true
      expect(registerFieldStub.calledOnce).to.be.true
      expect(unregisterFieldStub.notCalled).to.be.true
      expect(dispatchSpy.firstCall.args[0]).to.equal(stubRegisterFieldAction)
    })
  })
  describe('when its a valid field', function () {
    let store
    let wrapper
    let field
    let registerFieldStub
    let unregisterFieldStub
    let changeValueStub
    let getStateStub
    let renderStub
    let dispatchSpy
    const stubRegisterFieldAction = {}
    const stubUnregisterFieldAction = {}
    const stubChangeValueAction = {}
    class MyField extends Component {
      render () {
        return null
      }
    }
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
            [fieldName]: {
              status: formStatuses.VALID,
              value: 2,
              touched: true
            }
          }
        }
      })
      registerFieldStub = sandbox.stub(formActions, 'registerField').returns(stubRegisterFieldAction)
      unregisterFieldStub = sandbox.stub(formActions, 'unregisterField').returns(stubUnregisterFieldAction)
      renderStub = sandbox.stub().returns(<MyField />)
      dispatchSpy = sandbox.spy(store, 'dispatch')

      wrapper = shallow(
        <FormProvider store={store} />
      )
      const formProviderForm = wrapper.instance().getChildContext().form
      changeValueStub = sandbox.stub(formProviderForm, 'changeValue').returns(stubChangeValueAction)
      field = mount(
        <Field store={store} form={formProviderForm} formName={formName} fieldName={fieldName} render={renderStub} />
      )
    })
    it('should render the result of the render function that was passed through props', function () {
      const renderedField = field.find('MyField')
      expect(renderedField).to.have.length(1)
    })
    it('should render with a changeValue function which changes value on the store', function () {
      expect(renderStub.calledOnce).to.be.true
      expect(renderStub.firstCall.args[0].changeValue).to.be.a('function')
      const nextValue = 'nextValue'
      renderStub.firstCall.args[0].changeValue(nextValue)
      expect(changeValueStub.callCount).to.equal(1)
      expect(changeValueStub.firstCall.args[0].formName).to.equal(formName)
      expect(changeValueStub.firstCall.args[0].fieldName).to.equal(fieldName)
      expect(changeValueStub.firstCall.args[0].value).to.equal(nextValue)
    })
    it('should render the field value from the store', function () {
      expect(renderStub.calledOnce).to.be.true
      expect(renderStub.firstCall.args[0].value).to.equal(2)
    })
    it('should render touched from the store', function () {
      expect(renderStub.calledOnce).to.be.true
      expect(renderStub.firstCall.args[0].touched).to.equal(true)
    })
    it('should get loading false', function () {
      expect(renderStub.calledOnce).to.be.true
      expect(renderStub.firstCall.args[0].loading).to.equal(false)
    })
    it('should get submitting false', function () {
      expect(renderStub.calledOnce).to.be.true
      expect(renderStub.firstCall.args[0].submitting).to.equal(false)
    })
  })
  describe('when its a field with a cleared value', function () {
    let store
    let wrapper
    let registerFieldStub
    let unregisterFieldStub
    let getStateStub
    let renderStub
    let dispatchSpy
    const stubRegisterFieldAction = {}
    const stubUnregisterFieldAction = {}
    const stubChangeValueAction = {}
    class MyField extends Component {
      render () {
        return null
      }
    }
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
            [fieldName]: {
              status: formStatuses.VALID,
              initialValue: 2,
              value: undefined,
              touched: true
            }
          }
        }
      })
      registerFieldStub = sandbox.stub(formActions, 'registerField').returns(stubRegisterFieldAction)
      unregisterFieldStub = sandbox.stub(formActions, 'unregisterField').returns(stubUnregisterFieldAction)
      renderStub = sandbox.stub().returns(<MyField />)
      dispatchSpy = sandbox.spy(store, 'dispatch')
      wrapper = mount(
        <FormProvider store={store}>
          <Field formName={formName} fieldName={fieldName} render={renderStub} />
        </FormProvider>
      )
    })
    it('should render the field value from the store', function () {
      expect(renderStub.calledOnce).to.be.true
      expect(renderStub.firstCall.args[0].value).to.equal(undefined)
    })
  })
  describe('when its a field that has been provided a value different from the one on the store', function () {
    let store
    let wrapper
    let field
    let registerFieldStub
    let unregisterFieldStub
    const stubRegisterFieldAction = {}
    const stubUnregisterFieldAction = {}
    beforeEach(function () {
      store =
        slexStore.createStore(
          slexStore.createDispatch({
            reducer: slexStore.createReducer({
              form
            })
          })
        )
      registerFieldStub = sandbox.stub(formActions, 'registerField').returns(stubRegisterFieldAction)
      unregisterFieldStub = sandbox.stub(formActions, 'unregisterField').returns(stubUnregisterFieldAction)
      wrapper = shallow(
        <FormProvider store={store} />
      )
      const formProviderForm = wrapper.instance().getChildContext().form
      field = mount(<Field store={store} form={formProviderForm} value={1} formName={formName} fieldName={fieldName} />)
    })
    it('should change the fields initial value in the store', function () {
      const dispatchSpy = sandbox.spy(store, 'dispatch')
      const stubChangeInitialValue = {}
      const changeInitialValueStub = sandbox.stub(formActions, 'changeInitialValue').returns(stubChangeInitialValue)
      field.setProps({ value: 2 })
      expect(dispatchSpy.callCount).to.equal(1)
      expect(changeInitialValueStub.calledOnce).to.be.true
      expect(changeInitialValueStub.firstCall.args[0].value).to.equal(2)
      expect(dispatchSpy.firstCall.args[0]).to.equal(stubChangeInitialValue)
    })
  })
  describe('when its a validating field', function () {
    let store
    let wrapper
    let registerFieldStub
    let unregisterFieldStub
    let getStateStub
    let renderStub
    const stubRegisterFieldAction = {}
    const stubUnregisterFieldAction = {}
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
            [fieldName]: {
              status: formStatuses.VALIDATING,
              value: 2,
              touched: true
            }
          }
        }
      })
      registerFieldStub = sandbox.stub(formActions, 'registerField').returns(stubRegisterFieldAction)
      unregisterFieldStub = sandbox.stub(formActions, 'unregisterField').returns(stubUnregisterFieldAction)
      renderStub = sandbox.stub().returns(null)
      wrapper = mount(
        <FormProvider store={store}>
          <Field formName={formName} fieldName={fieldName} render={renderStub} />
        </FormProvider>
      )
    })
    it('should get loading true', function () {
      expect(renderStub.calledOnce).to.be.true
      expect(renderStub.firstCall.args[0].loading).to.equal(true)
    })
  })
  describe('when its a submitting form', function () {
    let store
    let wrapper
    let registerFieldStub
    let unregisterFieldStub
    let getStateStub
    let renderStub
    const stubRegisterFieldAction = {}
    const stubUnregisterFieldAction = {}
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
            status: formStatuses.SUBMITTING,
            [fieldName]: {
              status: formStatuses.VALID,
              value: 2,
              touched: true
            }
          }
        }
      })
      registerFieldStub = sandbox.stub(formActions, 'registerField').returns(stubRegisterFieldAction)
      unregisterFieldStub = sandbox.stub(formActions, 'unregisterField').returns(stubUnregisterFieldAction)
      renderStub = sandbox.stub().returns(null)
      wrapper = mount(
        <FormProvider store={store}>
          <Field formName={formName} fieldName={fieldName} render={renderStub} />
        </FormProvider>
      )
    })
    it('should get submitting true', function () {
      expect(renderStub.calledOnce).to.be.true
      expect(renderStub.firstCall.args[0].submitting).to.equal(true)
    })
  })
  describe('when its an error field', function () {
    let store
    let wrapper
    let registerFieldStub
    let unregisterFieldStub
    let getStateStub
    let renderStub
    const stubRegisterFieldAction = {}
    const stubUnregisterFieldAction = {}
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
            [fieldName]: {
              status: formStatuses.INVALID,
              value: 2,
              error: [
                'testError1',
                'testError2'
              ]
            }
          }
        }
      })
      registerFieldStub = sandbox.stub(formActions, 'registerField').returns(stubRegisterFieldAction)
      unregisterFieldStub = sandbox.stub(formActions, 'unregisterField').returns(stubUnregisterFieldAction)
      renderStub = sandbox.stub().returns(null)
      wrapper = mount(
        <FormProvider store={store}>
          <Field formName={formName} fieldName={fieldName} render={renderStub} />
        </FormProvider>
      )
    })
    it('should get an array of string messages from the fields error in the store', function () {
      expect(renderStub.calledOnce).to.be.true
      expect(renderStub.firstCall.args[0].messages[0]).to.equal('testError1')
      expect(renderStub.firstCall.args[0].messages[1]).to.equal('testError2')
    })
  })
})
