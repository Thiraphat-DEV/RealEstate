import { useState } from 'react'
import { Button } from '../ui'
import { inquiryService } from '../../services/inquiryService'

interface ContactAgentProps {
  propertyTitle?: string
  propertyId?: string
  className?: string
}

export const ContactAgent = ({ 
  propertyTitle = 'this property',
  propertyId,
  className = '' 
}: ContactAgentProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const question = propertyId 
        ? `I'm interested in ${propertyTitle} (ID: ${propertyId}). ${formData.message || 'Please contact me for more information.'}`
        : formData.message || `I'm interested in ${propertyTitle}. Please contact me for more information.`

      await inquiryService.submitInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        question: question,
      })

      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({ name: '', email: '', phone: '', message: '' })

      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setIsExpanded(false)
      }, 3000)
    } catch (error: any) {
      console.error('ContactAgent: Error submitting inquiry:', error)
      setIsSubmitting(false)
      alert('Failed to submit inquiry. Please try again.')
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
    <>
      {/* Button - Always visible */}
      <div className={className}>
        <Button
          onClick={() => setIsExpanded(true)}
          className={`w-full ${isExpanded ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : ''}`}
          size="lg"
          disabled={isExpanded}
        >
          Inquiry
        </Button>
      </div>

      {/* Modal - Show when expanded */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Inquiry</h3>
                  <p className="text-xs opacity-90">Submit your inquiry about this property</p>
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

            {/* Content */}
            <div className="p-6">
              {isSubmitted ? (
                // Success message
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
                    Our agent will contact you soon about {propertyTitle}.
                  </p>
                </div>
              ) : (
                // Form
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="agent-name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Your Name
                    </label>
                    <input
                      id="agent-name"
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
                      htmlFor="agent-email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      id="agent-email"
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
                      htmlFor="agent-phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      id="agent-phone"
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
                      htmlFor="agent-message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="agent-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm resize-none"
                      placeholder="Tell us about your interest in this property..."
                    />
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
                      'Send Message'
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Our agent will respond within 24 hours
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ContactAgent
