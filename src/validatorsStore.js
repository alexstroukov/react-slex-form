class ValidatorsStore {
  validators = {}
  setValidator = ({ formName, fieldName, validate }) => {
    this.validators = {
      ...this.validators,
      [formName + fieldName]: validate
    }
  }
  removeValidator = ({ formName, fieldName }) => {
    this.validators = _.omit(this.validators, fieldName)
  }
  getValidator = ({ formName, fieldName }) => {
    return this.validators[formName + fieldName]
  }
}

export default new ValidatorsStore()
