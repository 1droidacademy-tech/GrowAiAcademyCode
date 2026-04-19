import { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Have a question about our AI curriculum? Connect with the GrowAiEdu team for support and partnerships.",
}

export default function ContactPage() {
  return <ContactClient />
}
