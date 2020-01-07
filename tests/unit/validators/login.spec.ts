import { FormErrors } from '@/lib/validation'
import { createEmptyFormErrors } from '@/utils/helper'
import { LoginFormValidator, LoginForm } from '@/utils/validators/login'
import { usernameLengthError, passwordFormatError, passwordLengthError } from '@/const/errorMessage'

const defaultData: LoginForm = {
  username: 'Andy',
  password: 'Examp1e'
}

function validate(seed: Partial<LoginForm>) {
  const data: LoginForm = { ...defaultData, ...seed }
  return LoginFormValidator(data)
}

// Create form errors
function e(errors: Partial<FormErrors<LoginForm>>): FormErrors<LoginForm> {
  const defaultErrors = createEmptyFormErrors(defaultData)
  return { ...defaultErrors, ...errors }
}

describe('LoginFormValidator', () => {
  describe('username', () => {
    test('has no error', () => {
      expect(validate({ username: 'andy' })).toBeRight()
      expect(validate({ username: 'Andy' })).toBeRight()
      expect(validate({ username: 'Andy21' })).toBeRight()
    })

    test('has errors', () => {
      expect(validate({ username: 'A' })).toBeLeft(e({ username: [usernameLengthError] }))
      expect(validate({ username: '1' })).toBeLeft(e({ username: [usernameLengthError] }))
      expect(validate({ username: '@' })).toBeLeft(e({ username: [usernameLengthError] }))
    })
  })

  describe('password', () => {
    test('has no error', () => {
      expect(validate({ password: 'Examp1e' })).toBeRight()
      expect(validate({ password: 'examplE00000000000000' })).toBeRight()
      expect(validate({ password: 'sn0w!!' })).toBeRight()
    })

    test('has errors', () => {
      expect(validate({ password: 'sn0w' })).toBeLeft(e({ password: [passwordLengthError] }))
      expect(validate({ password: 'snow!!' })).toBeLeft(e({ password: [passwordFormatError] }))
      expect(validate({ password: 'snow' })).toBeLeft(e({ password: [passwordLengthError, passwordFormatError] }))
    })
  })
})

