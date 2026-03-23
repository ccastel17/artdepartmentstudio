'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Contact Info */}
        <div>
          <h1 className="text-white mb-6">
            Let's Work Together
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-12 leading-relaxed">
            Have a project in mind? We'd love to hear from you and bring your vision to life.
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-french-blue/10 rounded-lg group-hover:bg-french-blue/20 transition-colors">
                <Mail className="text-french-blue" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Email</h3>
                <a 
                  href="mailto:info@artdepartmentstudio.es" 
                  className="text-gray-400 hover:text-french-blue transition-colors"
                >
                  info@artdepartmentstudio.es
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-french-blue/10 rounded-lg group-hover:bg-french-blue/20 transition-colors">
                <Phone className="text-french-blue" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Phone</h3>
                <a 
                  href="tel:+34656945183" 
                  className="text-gray-400 hover:text-french-blue transition-colors"
                >
                  +34 656 94 51 83
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-french-blue/10 rounded-lg group-hover:bg-french-blue/20 transition-colors">
                <MapPin className="text-french-blue" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Location</h3>
                <p className="text-gray-400">
                  Carrer de Cobalt, 14<br />
                  Hospitalet de Llobregat<br />
                  Barcelona, Spain
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white">
          <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="name" 
                className={`block text-sm font-medium mb-2 transition-colors ${
                  focusedField === 'name' ? 'text-french-blue' : 'text-gray-400'
                }`}
              >
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-white/5 border border-white rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-french-blue focus:bg-white/10 transition-all"
              />
            </div>

            <div>
              <label 
                htmlFor="email" 
                className={`block text-sm font-medium mb-2 transition-colors ${
                  focusedField === 'email' ? 'text-french-blue' : 'text-gray-400'
                }`}
              >
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="john@example.com"
                className="w-full px-4 py-3 bg-white/5 border border-white rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-french-blue focus:bg-white/10 transition-all"
              />
            </div>

            <div>
              <label 
                htmlFor="phone" 
                className={`block text-sm font-medium mb-2 transition-colors ${
                  focusedField === 'phone' ? 'text-french-blue' : 'text-gray-400'
                }`}
              >
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
                placeholder="+34 656 94 51 83"
                className="w-full px-4 py-3 bg-white/5 border border-white rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-french-blue focus:bg-white/10 transition-all"
              />
            </div>

            <div>
              <label 
                htmlFor="message" 
                className={`block text-sm font-medium mb-2 transition-colors ${
                  focusedField === 'message' ? 'text-french-blue' : 'text-gray-400'
                }`}
              >
                Your Message *
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
                placeholder="Tell us about your project..."
                className="w-full px-4 py-3 bg-white/5 border border-white rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-french-blue focus:bg-white/10 transition-all resize-none"
              />
            </div>

            {status === 'success' && (
              <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <CheckCircle className="text-green-500" size={20} />
                <p className="text-green-500 text-sm">
                  Message sent successfully! We'll get back to you soon.
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle className="text-red-500" size={20} />
                <p className="text-red-500 text-sm">
                  There was an error sending your message. Please try again.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full px-6 py-4 bg-french-blue text-white font-semibold rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {status === 'loading' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
