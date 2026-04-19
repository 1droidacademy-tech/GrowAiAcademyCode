import { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: "Contact GrowAiEdu | AI Course Enquiry India",
  description: "Get in touch with GrowAiEdu for the best AI course for school students in India. Inquire about our online AI training, curriculum, and live classes.",
}

export default function ContactPage() {
  return <ContactClient />
}
