import React, { Component } from 'react'
import { mount, configure } from 'enzyme'
import ReactSixteenAdapter from 'enzyme-adapter-react-16'
import { expect } from 'chai'
import sinon from 'sinon'
import withForm from '../src/withForm'
import form from '../src'
import formActions from '../src/form.actions'
import * as formStatuses from '../src/form.statuses'
import formSelectors from '../src/form.selectors'
import slexStore from 'slex-store'

// need adapter to work with react ^16
configure({ adapter: new ReactSixteenAdapter() })

describe('withForm', function () {
  const sandbox = sinon.sandbox.create()
  const formName = 'formName'
  beforeEach(function () {
    sandbox.restore()
  })
  afterEach(function () {
    sandbox.restore()
  })
  describe('when applied to a component', function () {
    let store
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
      ComponentStub = sandbox.stub().returns(null)
      const WrappedComponent = withForm(ComponentStub)
      mount(<WrappedComponent store={store} />)
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
})
