import React, { Component } from 'react'
import { mount, configure } from 'enzyme'
import ReactSixteenAdapter from 'enzyme-adapter-react-16'
import { expect } from 'chai'
import sinon from 'sinon'
import withFormState from '../src/withFormState'
import form from '../src'
import formActions from '../src/form.actions'
import * as formStatuses from '../src/form.statuses'
import formSelectors from '../src/form.selectors'
import slexStore from 'slex-store'

// need adapter to work with react ^16
configure({ adapter: new ReactSixteenAdapter() })

describe('withFormState', function () {
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
      const WrappedComponent = withFormState('test')(ComponentStub)
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
  })
})
