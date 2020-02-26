type Form = {
  data: FormField[],
  error: string,
  errors: FormError[],
  isLoading: boolean,
  validationIsShown: boolean,
}

type FormField = {
  name: keyof AuthForm,
  value: AuthForm[FormField["name"]],
  validationRequired: boolean,
  isValid: boolean,
  errorType: FormError['type'],
  errorMsg: string
}

type AuthForm = {
  login: string,
  pswd: string
}

type FormError = {
  type: 'empty' | 'default',
  msg: string
}

export { Form, AuthForm, FormField }