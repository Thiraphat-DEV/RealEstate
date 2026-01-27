import { useState } from 'react'
import { Button } from '../ui'
import { inquiryService } from '../../services/inquiryService'

interface ContactToExpertProps {
  className?: string
}

export const ContactToExpert = ({ className = '' }: ContactToExpertProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    question: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await inquiryService.submitInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        question: formData.question,
      })

      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({ name: '', email: '', phone: '', question: '' })

      setTimeout(() => {
        setIsSubmitted(false)
        setIsExpanded(false)
      }, 3000)
    } catch (err: any) {
      setIsSubmitting(false)
      
      let errorMessage = 'Failed to submit inquiry. Please try again.'
      
      if (err?.response?.data?.message) {
        const messages = err.response.data.message
        if (Array.isArray(messages)) {
          errorMessage = messages.join('. ')
        } else {
          errorMessage = messages
        }
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error
      } else if (err?.message) {
        errorMessage = err.message
      } else if (err?.response?.status === 400) {
        const responseData = err?.response?.data
        if (responseData) {
          if (Array.isArray(responseData.message)) {
            errorMessage = responseData.message.join('. ')
          } else if (typeof responseData.message === 'string') {
            errorMessage = responseData.message
          } else {
            errorMessage = 'Invalid form data. Please check your inputs and try again.'
          }
        } else {
          errorMessage = 'Invalid form data. Please check your inputs and try again.'
        }
      } else if (err?.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.'
      } else if (err?.code === 'ECONNABORTED' || err?.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your connection and try again.'
      } else if (err?.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check your connection and try again.'
      }
      
      setError(errorMessage)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div
      className={`fixed bottom-0 right-0 md:bottom-6 md:right-10 z-50 ${className}`}
      style={{ maxWidth: '380px' }}
    >
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-full shadow-2xl hover:shadow-gold-500/50 p-3 md:p-4 hover:scale-110 transition-all duration-300 flex items-center gap-2 md:gap-3 group"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <div className="text-left hidden sm:block">
            <p className="font-semibold text-sm">Contact to Expert</p>
            <p className="text-xs opacity-90">Get expert advice</p>
          </div>
          <svg
            className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      ) : (
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-gold-500 to-gold-600 text-white p-4 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Contact to Expert</h3>
                <p className="text-xs opacity-90">Get expert property advice</p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-white/80 hover:text-white transition-colors p-1"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="p-6">
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Thank You!
                </h4>
                <p className="text-sm text-gray-600">
                  Our property expert will contact you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800">
                        {error}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setError(null)}
                      className="text-red-600 hover:text-red-800 flex-shrink-0"
                      aria-label="Close error"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}
                <div>
                  <label
                    htmlFor="guru-name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Name
                  </label>
                  <input
                    id="guru-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="guru-email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="guru-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="guru-phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    id="guru-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm"
                    placeholder="081-234-5678"
                  />
                </div>

                <div>
                  <label
                    htmlFor="guru-question"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Question
                  </label>
                  <textarea
                    id="guru-question"
                    name="question"
                    value={formData.question}
                    onChange={handleChange}
                    required
                    minLength={10}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm resize-none"
                    placeholder="Please enter your question (minimum 10 characters)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 10 characters required ({formData.question.length}/10)
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                  size="md"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Question'
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Our property expert will respond within 24 hours
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ContactToExpert
