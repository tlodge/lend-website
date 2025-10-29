"use client"

import { useState, FormEvent } from "react"
import styles from "./Form.module.css"
import type { Form as FormType, FormQuestion } from "../lib/types"

interface FormProps {
  form: FormType
}

const Form = ({ form }: FormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleChange = (questionId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleCheckboxChange = (questionId: string, option: string, checked: boolean) => {
    setFormData(prev => {
      const current = prev[questionId] || []
      if (checked) {
        return {
          ...prev,
          [questionId]: [...current, option]
        }
      } else {
        return {
          ...prev,
          [questionId]: current.filter((item: string) => item !== option)
        }
      }
    })
  }

  const validateForm = (): boolean => {
    for (const section of form.sections) {
      for (const question of section.questions) {
        if (question.required) {
          const value = formData[question.id]
          if (!value || (Array.isArray(value) && value.length === 0)) {
            alert(`Please answer the required question: ${question.label}`)
            return false
          }
        }
      }
    }
    return true
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    // Simulate form submission
    try {
      // In a real application, you would send this data to your backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log("Form data:", formData)
      setSubmitStatus("success")
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderQuestion = (question: FormQuestion) => {
    const value = formData[question.id] || (question.type === "checkbox" ? [] : "")

    switch (question.type) {
      case "text":
        return (
          <input
            type="text"
            id={question.id}
            value={value}
            onChange={(e) => handleChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            required={question.required}
            className={styles.input}
          />
        )

      case "textarea":
        return (
          <textarea
            id={question.id}
            value={value}
            onChange={(e) => handleChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            required={question.required}
            rows={question.rows || 4}
            className={styles.textarea}
          />
        )

      case "radio":
        return (
          <div className={styles.radioGroup}>
            {question.options?.map((option, index) => (
              <label key={index} className={styles.radioLabel}>
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleChange(question.id, e.target.value)}
                  required={question.required && index === 0}
                  className={styles.radio}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )

      case "checkbox":
        return (
          <div className={styles.checkboxGroup}>
            {question.options?.map((option, index) => {
              const checked = Array.isArray(value) && value.includes(option)
              return (
                <label key={index} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    value={option}
                    checked={checked}
                    onChange={(e) => handleCheckboxChange(question.id, option, e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span>{option}</span>
                </label>
              )
            })}
          </div>
        )

      case "select":
        return (
          <select
            id={question.id}
            value={value}
            onChange={(e) => handleChange(question.id, e.target.value)}
            required={question.required}
            className={styles.select}
          >
            <option value="">-- Please select --</option>
            {question.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      default:
        return null
    }
  }

  if (submitStatus === "success") {
    return (
      <div className={styles.successMessage}>
        <h2>Thank you!</h2>
        <p>Your response has been successfully submitted. We appreciate your time and participation.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.introduction}>
        <p>{form.introduction}</p>
      </div>

      {form.sections.map((section, sectionIndex) => (
        <div key={section.id} className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>{sectionIndex + 1}</span>
              {section.title}
            </h2>
            {section.description && (
              <p className={styles.sectionDescription}>{section.description}</p>
            )}
          </div>

          <div className={styles.questions}>
            {section.questions.map((question) => (
              <div key={question.id} className={styles.question}>
                <label htmlFor={question.id} className={styles.questionLabel}>
                  {question.label}
                  {question.required && <span className={styles.required}> *</span>}
                </label>
                {renderQuestion(question)}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className={styles.submitSection}>
        {submitStatus === "error" && (
          <p className={styles.errorMessage}>
            There was an error submitting your form. Please try again.
          </p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
        <p className={styles.requiredNote}>
          * Required fields
        </p>
      </div>
    </form>
  )
}

export default Form

