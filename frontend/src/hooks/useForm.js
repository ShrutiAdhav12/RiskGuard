import { useState } from 'react'

export function useForm(initialValues, onSubmit) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const setFieldValue = (name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const resetForm = () => {
    setValues(initialValues)
    setErrors({})
  }

  const setFieldError = (name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  return {
    values,
    errors,
    handleChange,
    setFieldValue,
    setFieldError,
    resetForm
  }
}

export default useForm
