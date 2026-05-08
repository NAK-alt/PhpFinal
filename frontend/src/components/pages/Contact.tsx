import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import api from '../../lib/api'

const SUBJECTS = ['General Inquiry','Product Information','Sales Support','After-Sales Service','Warranty Claim','Partnership Inquiry']

const CONTACT_INFO = [
  { icon: MapPin, title: 'Showroom', lines: ['ACLEDA University of Bussiness', 'Phnom Penh, Cambodia'] },
  { icon: Phone, title: 'Phone', lines: ['+855 123 4567', 'Mon–Sat: 9AM–7PM'] },
  { icon: Mail, title: 'Email', lines: ['info@chronosluxury.com', 'support@chronosluxury.com'] },
  { icon: Clock, title: 'Hours', lines: ['Mon–Fri: 9AM–7PM', 'Sat: 10AM–6PM', 'Sun: 12PM–5PM'] },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/contact', form)
      setSent(true)
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">We're Here to Help</p>
          <h1 className="font-serif text-4xl font-light mb-4">Get in Touch</h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            Our watch specialists are ready to provide personalized assistance. Whether you're seeking a specific timepiece or have questions about our collection, we're here.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact info */}
          <div className="space-y-6">
            {CONTACT_INFO.map(({ icon: Icon, title, lines }) => (
              <div key={title} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-base mb-1">{title}</h3>
                  {lines.map((line, i) => <p key={i} className="text-sm text-muted-foreground">{line}</p>)}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {sent ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <CheckCircle className="h-14 w-14 text-primary mx-auto mb-6" strokeWidth={1.5} />
                <h2 className="font-serif text-2xl font-light mb-3">Message Sent</h2>
                <p className="text-muted-foreground text-sm mb-8">
                  Thank you for reaching out. One of our specialists will be in touch within 24 hours.
                </p>
                <Button variant="outline" onClick={() => setSent(false)} className="tracking-widest uppercase text-sm font-light">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="font-serif text-xl mb-7">Send a Message</h2>

                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md px-4 py-3 mb-6">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-xs tracking-widest uppercase text-muted-foreground">Full Name</Label>
                      <Input id="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs tracking-widest uppercase text-muted-foreground">Email</Label>
                      <Input id="email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" required />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs tracking-widest uppercase text-muted-foreground">Subject</Label>
                    <Select value={form.subject} onValueChange={v => setForm(f => ({ ...f, subject: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger>
                      <SelectContent>
                        {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="message" className="text-xs tracking-widest uppercase text-muted-foreground">Message</Label>
                    <Textarea id="message" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="How can we help you?" rows={6} required />
                  </div>

                  <Button type="submit" size="lg" className="w-full tracking-widest uppercase text-sm font-light" disabled={loading}>
                    {loading ? 'Sending…' : 'Send Message'}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
