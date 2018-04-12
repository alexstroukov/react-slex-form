import { expect } from 'chai'
import sinon from 'sinon'
import formActions from '../src/form.actions'
import * as formActionTypes from '../src/form.actionTypes'
import * as formStatuses from '../src/form.statuses'
import { createDispatch, createGetState } from 'slex-store'

describe('form.actions', function () {
  const sandbox = sinon.sandbox.create()
  beforeEach(function () {
    sandbox.restore()
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('resetFormStore', function () {
    it('should create an object action', function () {
      const resetFormStoreAction = formActions.resetFormStore()
      expect(resetFormStoreAction !== null && typeof resetFormStoreAction === 'object').to.equal(true)
    })
    it('should be of type RESET_FORM_STORE', function () {
      const resetFormStoreAction = formActions.resetFormStore()
      expect(resetFormStoreAction.type).to.equal(formActionTypes.RESET_FORM_STORE)
    })
  })
  describe('submitForm', function () {
    it('should create an object action', function () {
      const params = { formName: 'testFormName' }
      const submitFormAction = formActions.submitForm(params)
      expect(submitFormAction !== null && typeof submitFormAction === 'object').to.equal(true)
    })
    it('should be of type SUBMIT_FORM', function () {
      const params = { formName: 'testformName' }
      const submitFormAction = formActions.submitForm(params)
      expect(submitFormAction.type).to.equal(formActionTypes.SUBMIT_FORM)
    })
    it('should include the given formName in the returned object', function () {
      const params = { formName: 'testformName' }
      const submitFormAction = formActions.submitForm(params)
      expect(submitFormAction.formName).to.equal(params.formName)
    })
  })
  describe('submitFormSuccess', function () {
    const params = { formName: 'testFormName', result: 'testResult' }
    it('should create an object action', function () {
      const submitFormSuccessAction = formActions.submitFormSuccess(params)
      expect(submitFormSuccessAction !== null && typeof submitFormSuccessAction === 'object').to.equal(true)
    })
    it('should be of type SUBMIT_FORM_SUCCESS', function () {
      const submitFormSuccessAction = formActions.submitFormSuccess(params)
      expect(submitFormSuccessAction.type).to.equal(formActionTypes.SUBMIT_FORM_SUCCESS)
    })
    it('should include the given formName in the returned object', function () {
      const submitFormSuccessAction = formActions.submitFormSuccess(params)
      expect(submitFormSuccessAction.formName).to.equal(params.formName)
    })
    it('should include the given result in the returned object', function () {
      const submitFormSuccessAction = formActions.submitFormSuccess(params)
      expect(submitFormSuccessAction.result).to.equal(params.result)
    })
  })
  describe('submitFormFail', function () {
    const params = { formName: 'testFormName', error: 'testError', validationErrors: {} }
    it('should create an object action', function () {
      const submitFormFailAction = formActions.submitFormFail(params)
      expect(submitFormFailAction !== null && typeof submitFormFailAction === 'object').to.equal(true)
    })
    it('should be of type SUBMIT_FORM_FAIL', function () {
      const submitFormFailAction = formActions.submitFormFail(params)
      expect(submitFormFailAction.type).to.equal(formActionTypes.SUBMIT_FORM_FAIL)
    })
    it('should include the given formName in the returned object', function () {
      const submitFormFailAction = formActions.submitFormFail(params)
      expect(submitFormFailAction.formName).to.equal(params.formName)
    })
    it('should include the given error in the returned object', function () {
      const submitFormFailAction = formActions.submitFormFail(params)
      expect(submitFormFailAction.error).to.equal(params.error)
    })
    it('should include the given validationErrors in the returned object', function () {
      const submitFormFailAction = formActions.submitFormFail(params)
      expect(submitFormFailAction.validationErrors).to.equal(params.validationErrors)
    })
  })
  describe('resetForm', function () {
    it('should create an object action', function () {
      const params = { formName: 'testFormName' }
      const resetFormAction = formActions.resetForm(params)
      expect(resetFormAction !== null && typeof resetFormAction === 'object').to.equal(true)
    })
    it('should be of type RESET_FORM', function () {
      const params = { formName: 'testformName' }
      const resetFormAction = formActions.resetForm(params)
      expect(resetFormAction.type).to.equal(formActionTypes.RESET_FORM)
    })
    it('should include the given formName in the returned object', function () {
      const params = { formName: 'testformName' }
      const resetFormAction = formActions.resetForm(params)
      expect(resetFormAction.formName).to.equal(params.formName)
    })
  })
  describe('changeInitialValue', function () {
    it('should create an object action', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue' }
      const updateInitialValueAction = formActions.changeInitialValue(params)
      expect(updateInitialValueAction !== null && typeof updateInitialValueAction === 'object').to.equal(true)
    })
    it('should be of type CHANGE_INITIAL_VALUE', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue' }
      const updateInitialValueAction = formActions.changeInitialValue(params)
      expect(updateInitialValueAction.type).to.equal(formActionTypes.CHANGE_INITIAL_VALUE)
    })
    it('should include the given formName in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue' }
      const updateInitialValueAction = formActions.changeInitialValue(params)
      expect(updateInitialValueAction.formName).to.equal(params.formName)
    })
    it('should include the given fieldName in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue' }
      const updateInitialValueAction = formActions.changeInitialValue(params)
      expect(updateInitialValueAction.fieldName).to.equal(params.fieldName)
    })
    it('should include the given value in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue' }
      const updateInitialValueAction = formActions.changeInitialValue(params)
      expect(updateInitialValueAction.value).to.equal(params.value)
    })
  })
  describe('changeValue', function () {
    it('should create an object action', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue', isSilent: false }
      const changeValueAction = formActions.changeValue(params)
      expect(changeValueAction !== null && typeof changeValueAction === 'object').to.equal(true)
    })
    it('should be of type CHANGE_VALUE', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue', isSilent: false }
      const changeValueAction = formActions.changeValue(params)
      expect(changeValueAction.type).to.equal(formActionTypes.CHANGE_VALUE)
    })
    it('should include the given formName in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue', isSilent: false }
      const changeValueAction = formActions.changeValue(params)
      expect(changeValueAction.formName).to.equal(params.formName)
    })
    it('should include the given fieldName in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue', isSilent: false }
      const changeValueAction = formActions.changeValue(params)
      expect(changeValueAction.fieldName).to.equal(params.fieldName)
    })
    it('should include the given value in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue', isSilent: false }
      const changeValueAction = formActions.changeValue(params)
      expect(changeValueAction.value).to.equal(params.value)
    })
    it('should include the given isSilent in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue', isSilent: false }
      const changeValueAction = formActions.changeValue(params)
      expect(changeValueAction.isSilent).to.equal(params.isSilent)
    })
  })
  describe('updateMeta', function () {
    const params = { formName: 'testformName', fieldName: 'testFieldName', meta: { metaValue: 'testValue' } }
    it('should create an object action', function () {
      const updateMetaAction = formActions.updateMeta(params)
      expect(updateMetaAction !== null && typeof updateMetaAction === 'object').to.equal(true)
    })
    it('should be of type UPDATE_META', function () {
      const updateMetaAction = formActions.updateMeta(params)
      expect(updateMetaAction.type).to.equal(formActionTypes.UPDATE_META)
    })
    it('should include the given formName in the returned object', function () {
      const updateMetaAction = formActions.updateMeta(params)
      expect(updateMetaAction.formName).to.equal(params.formName)
    })
    it('should include the given fieldName in the returned object', function () {
      const updateMetaAction = formActions.updateMeta(params)
      expect(updateMetaAction.fieldName).to.equal(params.fieldName)
    })
    it('should include the given meta in the returned object', function () {
      const updateMetaAction = formActions.updateMeta(params)
      expect(updateMetaAction.meta).to.equal(params.meta)
    })
  })
  describe('resetField', function () {
    it('should create an object action', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName' }
      const resetFieldAction = formActions.resetField(params)
      expect(resetFieldAction !== null && typeof resetFieldAction === 'object').to.equal(true)
    })
    it('should be of type RESET_FIELD', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName' }
      const resetFieldAction = formActions.resetField(params)
      expect(resetFieldAction.type).to.equal(formActionTypes.RESET_FIELD)
    })
    it('should include the given formName in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName' }
      const resetFieldAction = formActions.resetField(params)
      expect(resetFieldAction.formName).to.equal(params.formName)
    })
    it('should include the given fieldName in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName' }
      const resetFieldAction = formActions.resetField(params)
      expect(resetFieldAction.fieldName).to.equal(params.fieldName)
    })
  })
  describe('isValid', function () {
    it('should create an object action', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName' }
      const isValidAction = formActions.isValid(params)
      expect(isValidAction !== null && typeof isValidAction === 'object').to.equal(true)
    })
    it('should be of type IS_VALID', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName' }
      const isValidAction = formActions.isValid(params)
      expect(isValidAction.type).to.equal(formActionTypes.IS_VALID)
    })
    it('should include the given formName in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName' }
      const isValidAction = formActions.isValid(params)
      expect(isValidAction.formName).to.equal(params.formName)
    })
    it('should include the given fieldName in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName' }
      const isValidAction = formActions.isValid(params)
      expect(isValidAction.fieldName).to.equal(params.fieldName)
    })
  })
  describe('isInvalid', function () {
    it('should create an object action', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', error: new Error() }
      const isInvalidAction = formActions.isInvalid(params)
      expect(isInvalidAction !== null && typeof isInvalidAction === 'object').to.equal(true)
    })
    it('should be of type IS_INVALID', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', error: new Error() }
      const isInvalidAction = formActions.isInvalid(params)
      expect(isInvalidAction.type).to.equal(formActionTypes.IS_INVALID)
    })
    it('should include the given formName in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', error: new Error() }
      const isInvalidAction = formActions.isInvalid(params)
      expect(isInvalidAction.formName).to.equal(params.formName)
    })
    it('should include the given fieldName in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', error: new Error() }
      const isInvalidAction = formActions.isInvalid(params)
      expect(isInvalidAction.fieldName).to.equal(params.fieldName)
    })
    it('should include the given error in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', error: new Error() }
      const isInvalidAction = formActions.isInvalid(params)
      expect(isInvalidAction.error).to.equal(params.error)
    })
  })
  describe('registerField', function () {
    it('should create an object action', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue', validate: () => {} }
      const registerFieldAction = formActions.registerField(params)
      expect(registerFieldAction !== null && typeof registerFieldAction === 'object').to.equal(true)
    })
    it('should be of type REGISTER_FIELD', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue', validate: () => {} }
      const registerFieldAction = formActions.registerField(params)
      expect(registerFieldAction.type).to.equal(formActionTypes.REGISTER_FIELD)
    })
    it('should include the given formName in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue', validate: () => {} }
      const registerFieldAction = formActions.registerField(params)
      expect(registerFieldAction.formName).to.equal(params.formName)
    })
    it('should include the given fieldName in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue', validate: () => {} }
      const registerFieldAction = formActions.registerField(params)
      expect(registerFieldAction.fieldName).to.equal(params.fieldName)
    })
    it('should include the given value in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName', value: 'testValue', validate: () => {} }
      const registerFieldAction = formActions.registerField(params)
      expect(registerFieldAction.value).to.equal(params.value)
    })
  })
  describe('unregisterField', function () {
    it('should create an object action', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName' }
      const unregisterFieldAction = formActions.unregisterField(params)
      expect(unregisterFieldAction !== null && typeof unregisterFieldAction === 'object').to.equal(true)
    })
    it('should be of type UNREGISTER_FIELD', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName' }
      const unregisterFieldAction = formActions.unregisterField(params)
      expect(unregisterFieldAction.type).to.equal(formActionTypes.UNREGISTER_FIELD)
    })
    it('should include the given formName in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName' }
      const unregisterFieldAction = formActions.unregisterField(params)
      expect(unregisterFieldAction.formName).to.equal(params.formName)
    })
    it('should include the given fieldName in the returned object', function () {
      const params = { formName: 'testformName', fieldName: 'testFieldName' }
      const unregisterFieldAction = formActions.unregisterField(params)
      expect(unregisterFieldAction.fieldName).to.equal(params.fieldName)
    })
  })
})
