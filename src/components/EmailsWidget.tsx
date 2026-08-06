import React, { useState } from 'react';
import {
  Mail,
  Search,
  CheckCircle2,
  Trash2,
  Plus,
  X,
  Send,
  Tag,
  Clock,
  Sparkles,
  Inbox
} from 'lucide-react';
import { EmailItem } from '../lib/default-data';

interface EmailsWidgetProps {
  emails: EmailItem[];
  userEmail: string;
  onUpdateEmail: (email: EmailItem) => void;
  onDeleteEmail: (id: number) => void;
  onAddEmail: (email: Omit<EmailItem, 'id'>) => void;
}

export function EmailsWidget({
  emails,
  userEmail,
  onUpdateEmail,
  onDeleteEmail,
  onAddEmail,
}: EmailsWidgetProps) {
  const [selectedEmail, setSelectedEmail] = useState<EmailItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCompose, setShowCompose] = useState<boolean>(false);

  // New Email form state
  const [newSender, setNewSender] = useState<string>('Guidance Counselor');
  const [newSenderEmail, setNewSenderEmail] = useState<string>('guidance@lincolnhigh.edu');
  const [newSubject, setNewSubject] = useState<string>('College Application Workshop Next Week');
  const [newBody, setNewBody] = useState<string>('Hello students, Join us for a step-by-step application walkthrough in the Auditorium at 3 PM on Tuesday.');
  const [newCategory, setNewCategory] = useState<'inbox' | 'homework' | 'announcement'>('announcement');

  const unreadCount = emails.filter((e) => !e.isRead).length;

  const filteredEmails = emails.filter((e) => {
    const matchesCategory = filterCategory === 'all' || e.category === filterCategory;
    const matchesSearch =
      e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.body.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenEmail = (email: EmailItem) => {
    setSelectedEmail(email);
    if (!email.isRead) {
      onUpdateEmail({ ...email, isRead: true });
    }
  };

  const handleToggleRead = (email: EmailItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateEmail({ ...email, isRead: !email.isRead });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject || !newBody) return;

    onAddEmail({
      sender: newSender || 'School Admin',
      senderEmail: newSenderEmail || 'admin@school.edu',
      subject: newSubject,
      body: newBody,
      date: 'Just now',
      isRead: false,
      category: newCategory,
    });

    setShowCompose(false);
    setNewSubject('');
    setNewBody('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[560px]">
      
      {/* Widget Header */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">My Emails</h2>
              {unreadCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-xs font-bold shadow-xs">
                  {unreadCount} new
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-xs font-medium">
                  All read
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">Inbox for {userEmail}</p>
          </div>
        </div>

        <button
          onClick={() => setShowCompose(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Email</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-3 border-b border-slate-100 bg-white space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search emails or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto text-xs pb-1">
          {['all', 'inbox', 'homework', 'announcement'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-md capitalize font-medium transition ${
                filterCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {filteredEmails.length === 0 ? (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <Inbox className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm font-medium">No emails found</p>
          </div>
        ) : (
          filteredEmails.map((email) => (
            <div
              key={email.id}
              onClick={() => handleOpenEmail(email)}
              className={`p-3.5 hover:bg-slate-50 cursor-pointer transition flex items-start gap-3 ${
                !email.isRead ? 'bg-blue-50/40 border-l-4 border-l-blue-600' : ''
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                  !email.isRead ? 'bg-blue-600' : 'bg-transparent'
                }`}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs font-semibold truncate ${
                      !email.isRead ? 'text-slate-900' : 'text-slate-600'
                    }`}
                  >
                    {email.sender}
                  </span>
                  <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                    {email.date}
                  </span>
                </div>

                <div className={`text-xs truncate ${!email.isRead ? 'font-bold text-slate-900' : 'text-slate-700'}`}>
                  {email.subject}
                </div>

                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {email.body}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 hover:opacity-100 transition shrink-0">
                <button
                  onClick={(e) => handleToggleRead(email, e)}
                  title={email.isRead ? 'Mark as Unread' : 'Mark as Read'}
                  className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-200"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Read Email Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="px-2 py-0.5 text-[10px] rounded font-semibold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                  {selectedEmail.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  {selectedEmail.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEmail(null)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div>
                <div className="font-semibold text-slate-800">{selectedEmail.sender}</div>
                <div className="text-slate-400">{selectedEmail.senderEmail}</div>
              </div>
              <div className="text-right font-mono text-slate-400">
                {selectedEmail.date}
              </div>
            </div>

            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap pt-2">
              {selectedEmail.body}
            </div>

            <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
              <button
                onClick={() => {
                  onDeleteEmail(selectedEmail.id);
                  setSelectedEmail(null);
                }}
                className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Delete Email
              </button>

              <button
                onClick={() => setSelectedEmail(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Compose / Add Mock Email Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleAddSubmit}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-600" />
                Add Incoming Email
              </h3>
              <button
                type="button"
                onClick={() => setShowCompose(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Sender Name</label>
                <input
                  type="text"
                  required
                  value={newSender}
                  onChange={(e) => setNewSender(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Sender Email</label>
                <input
                  type="email"
                  required
                  value={newSenderEmail}
                  onChange={(e) => setNewSenderEmail(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-medium text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                required
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="text-xs">
              <label className="block font-medium text-slate-700 mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e: any) => setNewCategory(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="inbox">Inbox</option>
                <option value="homework">Homework</option>
                <option value="announcement">Announcement</option>
              </select>
            </div>

            <div className="text-xs">
              <label className="block font-medium text-slate-700 mb-1">Email Content</label>
              <textarea
                rows={4}
                required
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCompose(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Add Email
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
