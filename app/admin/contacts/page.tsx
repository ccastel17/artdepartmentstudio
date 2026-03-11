'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Clock, CheckCircle } from 'lucide-react';

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function ContactsAdmin() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contact');
      if (!response.ok) throw new Error('Failed to fetch contacts');
      
      const data = await response.json();
      setContacts(data.contacts || []);
    } catch (err) {
      setError('Error loading contacts');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      });

      if (response.ok) {
        setContacts(contacts.map(c => 
          c._id === id ? { ...c, read: true } : c
        ));
      }
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  return (
    <div className="min-h-screen bg-black py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-accent-blue hover:text-blue-400 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Contact <span className="text-accent-blue">Messages</span>
          </h1>
          <p className="text-gray-400">View and manage contact form submissions</p>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading...</div>
        ) : error ? (
          <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-400">
            {error}
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center text-gray-400 py-12">No messages yet</div>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div
                key={contact._id}
                className={`bg-gray-900 p-6 rounded-lg border-2 ${
                  contact.read ? 'border-gray-800' : 'border-accent-blue'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{contact.name}</h3>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-accent-blue hover:text-blue-400 transition-colors"
                    >
                      {contact.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Clock size={16} />
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </div>
                    {!contact.read && (
                      <button
                        onClick={() => markAsRead(contact._id)}
                        className="flex items-center gap-2 px-3 py-1 bg-accent-blue text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        <CheckCircle size={16} />
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-gray-300 whitespace-pre-wrap">{contact.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
