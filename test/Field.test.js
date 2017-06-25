// import ReactTestUtils from 'react-addons-test-utils' // try enzyme instead
import { expect } from 'chai'
import sinon from 'sinon'
import Field from '../src/Field'
import formActions from '../src/form.actions'
import * as formActionTypes from '../src/form.actionTypes'

describe('Field', function () {
  const sandbox = sinon.sandbox.create()
  beforeEach(function () {
    sandbox.restore()
  })

  afterEach(function () {
    sandbox.restore()
  })

  it('should register the field on the store when mounted')
  it('should unregister the field on the store before unmounting')

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
