"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { 
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CheckIcon
} from "@heroicons/react/24/outline"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const socialLinks = [
    { 
      name: "LinkedIn",
      icon: () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ), 
      href: "https://linkedin.com/in/yourprofile", 
      label: "LinkedIn" 
    },
    { 
      name: "Twitter",
      icon: () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ), 
      href: "https://twitter.com/yourhandle", 
      label: "Twitter" 
    },
    { 
      name: "GitHub",
      icon: () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      ), 
      href: "https://github.com/yourusername", 
      label: "GitHub" 
    },
    { 
      name: "Instagram",
      icon: () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-12C24.007 5.367 18.641.001.012.001z" clipRule="evenodd" />
        </svg>
      ), 
      href: "https://instagram.com/yourhandle", 
      label: "Instagram" 
    }
  ]

  const contactInfo = [
    {
      icon: EnvelopeIcon,
      label: "Email",
      value: "hello@andydev.com",
      href: "mailto:hello@andydev.com"
    },
    {
      icon: PhoneIcon,
      label: "Phone",
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567"
    },
    {
      icon: MapPinIcon,
      label: "Location",
      value: "San Francisco, CA",
      href: null
    }
  ]

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real app, you would send the data to your backend
      console.log('Form submitted:', formData)
      
      toast.success("Message sent successfully! I'll get back to you soon.")
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      toast.error("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.25, 0, 1] }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    hover: {
      y: -2,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  }

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Back Navigation */}
      <div className="max-w-screen-xl mx-auto px-[150px] pt-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm text-light-mini dark:text-dark-mini hover:text-light-heading dark:hover:text-dark-heading transition-colors duration-300"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.div>
      </div>

      {/* Header Section */}
      <section className="py-16">
        <div className="max-w-screen-xl mx-auto px-[150px]">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="space-y-6">
              <motion.h1 
                className="text-3xl font-semibold text-light-heading dark:text-dark-heading transition-colors duration-300"
                whileInView={{ scale: [0.98, 1] }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                Get In Touch
              </motion.h1>
              
              <motion.p 
                className="text-base text-light-text dark:text-dark-text leading-relaxed max-w-2xl"
                initial={{ opacity: 0.8 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Have a project in mind or want to collaborate? I'd love to hear from you. 
                Let's discuss how we can bring your ideas to life.
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <div className="max-w-screen-xl mx-auto px-[150px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={containerVariants}
              className="space-y-8"
            >
              <motion.h2 
                variants={itemVariants}
                className="text-xl font-medium text-light-heading dark:text-dark-heading"
              >
                Send a Message
              </motion.h2>

              <motion.form 
                variants={itemVariants}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Name Field */}
                <div className="space-y-2">
                  <label 
                    htmlFor="name" 
                    className="text-sm font-medium text-light-heading dark:text-dark-heading"
                  >
                    Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    className={errors.name ? "border-red-500 focus:border-red-500" : ""}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-sm text-red-500">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label 
                    htmlFor="email" 
                    className="text-sm font-medium text-light-heading dark:text-dark-heading"
                  >
                    Email *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className={errors.email ? "border-red-500 focus:border-red-500" : ""}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-sm text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Subject Field */}
                <div className="space-y-2">
                  <label 
                    htmlFor="subject" 
                    className="text-sm font-medium text-light-heading dark:text-dark-heading"
                  >
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="What's this about?"
                  />
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <label 
                    htmlFor="message" 
                    className="text-sm font-medium text-light-heading dark:text-dark-heading"
                  >
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell me about your project or how I can help..."
                    rows={6}
                    className={errors.message ? "border-red-500 focus:border-red-500" : ""}
                    aria-describedby={errors.message ? "message-error" : undefined}
                  />
                  {errors.message && (
                    <p id="message-error" className="text-sm text-red-500">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3 text-base"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Send Message
                        <CheckIcon className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </motion.div>
              </motion.form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={containerVariants}
              className="space-y-8"
            >
              <motion.h2 
                variants={itemVariants}
                className="text-xl font-medium text-light-heading dark:text-dark-heading"
              >
                Connect With Me
              </motion.h2>

              {/* Contact Info Cards */}
              <motion.div variants={itemVariants} className="space-y-4">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon
                  const content = (
                    <motion.div
                      variants={cardVariants}
                      whileHover="hover"
                      className="flex items-center gap-4 p-4 bg-light-bg dark:bg-dark-bg rounded-lg border border-light-mini/10 dark:border-dark-mini/10 hover:border-light-mini/20 dark:hover:border-dark-mini/20 transition-all duration-300"
                    >
                      <div className="p-2 bg-light-mini/10 dark:bg-dark-mini/10 rounded-lg">
                        <IconComponent className="w-5 h-5 text-light-heading dark:text-dark-heading" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-light-heading dark:text-dark-heading">
                          {info.label}
                        </p>
                        <p className="text-sm text-light-text dark:text-dark-text">
                          {info.value}
                        </p>
                      </div>
                    </motion.div>
                  )

                  return info.href ? (
                    <motion.a
                      key={index}
                      href={info.href}
                      className="block"
                      initial="hidden"
                      whileInView="visible"
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      {content}
                    </motion.a>
                  ) : (
                    <motion.div
                      key={index}
                      initial="hidden"
                      whileInView="visible"
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      {content}
                    </motion.div>
                  )
                })}
              </motion.div>

              {/* Social Media Links */}
              <motion.div variants={itemVariants} className="space-y-4">
                <h3 className="text-lg font-medium text-light-heading dark:text-dark-heading">
                  Follow Me
                </h3>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon
                    return (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-light-bg dark:bg-dark-bg rounded-lg border border-light-mini/10 dark:border-dark-mini/10 hover:border-light-mini/20 dark:hover:border-dark-mini/20 text-light-mini dark:text-dark-mini hover:text-light-heading dark:hover:text-dark-heading transition-all duration-300"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <IconComponent />
                        <span className="sr-only">{social.label}</span>
                      </motion.a>
                    )
                  })}
                </div>
              </motion.div>

              {/* Additional Info */}
              <motion.div 
                variants={itemVariants}
                className="p-6 bg-light-mini/5 dark:bg-dark-mini/5 rounded-lg border border-light-mini/10 dark:border-dark-mini/10"
              >
                <h3 className="text-lg font-medium text-light-heading dark:text-dark-heading mb-3">
                  Let's Work Together
                </h3>
                <p className="text-sm text-light-text dark:text-dark-text leading-relaxed mb-4">
                  I'm always interested in new opportunities and exciting projects. 
                  Whether you need help with web development, SEO optimization, or 
                  technical consulting, I'd love to discuss how we can collaborate.
                </p>
                <div className="space-y-2 text-sm text-light-mini dark:text-dark-mini">
                  <p>• Typical response time: Within 24 hours</p>
                  <p>• Available for: Projects, consulting, collaborations</p>
                  <p>• Time zone: PST (UTC-8)</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage