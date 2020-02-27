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

type RequestStatus = RequestStatuses[RequestType]

type RequestType = 'success' | 'fail'

type RequestStatuses = {
  success: 'successLogin'
  fail: 'failLogin'
}


export { Form, AuthForm, FormField, RequestStatus, RequestStatuses, RequestType }