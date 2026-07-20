import React, { useState, useMemo } from 'react';
import {
  Search, Plus, X, CheckCircle2, Trash2, Phone, Mail,
  UserPlus, Send, Clock, Stethoscope, BadgeCheck, ShieldOff
} from 'lucide-react';
import { useClinicRole } from '../../store/clinic/ClinicRoleContext';
import { DOCTOR_DIRECTORY, type PartnerDoctor } from '../../mocks/clinicMocks';

const PartnerDoctorsScreen: React.FC = () => {
  const { partnerDoctors, addPartnerDoctor, updatePartnerDoctor, removePartnerDoctor } = useClinicRole();

  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteContact, setInviteContact] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSpec, setInviteSpec] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Directory results: registered Vizito doctors not already in partnerDoctors
  const existingIds = new Set(partnerDoctors.map(d => d.id));
  const directoryResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return DOCTOR_DIRECTORY.filter(
      d => !existingIds.has(d.id) && d.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, partnerDoctors]);

  const connected = partnerDoctors.filter(d => d.status === 'Connected');
  const outgoing = partnerDoctors.filter(d => d.status === 'Pending Outgoing');
  const incoming = partnerDoctors.filter(d => d.status === 'Incoming');
  const invited = partnerDoctors.filter(d => d.status === 'Invited');

  const handleSendRequest = (dir: Omit<PartnerDoctor, 'status'>) => {
    addPartnerDoctor({ ...dir, status: 'Pending Outgoing' });
    showToast(`Partnership request sent to ${dir.name}.`);
  };

  const handleAccept = (doctor: PartnerDoctor) => {
    updatePartnerDoctor({
      ...doctor,
      status: 'Connected',
      connectedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    });
    showToast(`${doctor.name} is now a partner doctor!`);
  };

  const handleDecline = (doctor: PartnerDoctor) => {
    removePartnerDoctor(doctor.id);
    showToast(`Request from ${doctor.name} declined.`, 'info');
  };

  const handleCancel = (doctor: PartnerDoctor) => {
    removePartnerDoctor(doctor.id);
    showToast(`Request to ${doctor.name} cancelled.`, 'info');
  };

  const handleRemove = (doctor: PartnerDoctor) => {
    if (window.confirm(`Remove ${doctor.name} as a partner doctor? This will end their affiliation with your clinic.`)) {
      removePartnerDoctor(doctor.id);
      showToast(`${doctor.name} removed from clinic.`, 'info');
    }
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteContact || !inviteEmail || !inviteSpec) {
      showToast('Please fill all fields.', 'info');
      return;
    }
    addPartnerDoctor({
      id: `inv_${Date.now()}`,
      name: inviteName,
      title: 'Dr.',
      specialisation: inviteSpec,
      contact: inviteContact,
      email: inviteEmail,
      experience: '—',
      vizitoDoctorId: '—',
      status: 'Invited',
    });
    showToast(`Vizito invitation sent to ${inviteName}.`);
    setInviteName(''); setInviteContact(''); setInviteEmail(''); setInviteSpec('');
    setIsInviteModalOpen(false);
  };

  return (
    <div className="space-y-6 font-sans">

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl max-w-sm animate-fade">
          <CheckCircle2 className={`w-4 h-4 shrink-0 ${toast.type === 'info' ? 'text-rose-400' : 'text-teal-400'}`} />
          <p className="text-xs font-bold">{toast.msg}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2B2B2B] tracking-tight">Partner Doctors</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Invite registered Vizito doctors to practice at your clinic and manage existing partnerships
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {incoming.length > 0 && (
            <span className="text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
              {incoming.length} incoming request{incoming.length > 1 ? 's' : ''}
            </span>
          )}
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#5C2494] to-[#7C3AED] text-white px-4 py-2 rounded-xl text-xs font-black shadow-sm cursor-pointer hover:opacity-95"
          >
            <UserPlus className="w-4 h-4" /> Invite Doctor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ─── LEFT: Directory Search ─────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-800">Find Registered Doctors</h2>
            <p className="text-[11px] font-semibold text-slate-400 leading-normal">Search doctors already registered on Vizito to send a partnership request</p>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or specialisation..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-purple-600/10 focus:border-[#7C3AED]/30"
              />
            </div>

            <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
              {searchQuery.trim().length > 0 && directoryResults.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs font-bold">No unconnected doctors found.</div>
              )}
              {directoryResults.map(dir => (
                <div key={dir.id} className="border border-slate-150 p-3 rounded-xl space-y-2 hover:bg-slate-50/50">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-black text-slate-800">{dir.name}</p>
                      <p className="text-[10px] font-bold text-slate-400">{dir.specialisation} · {dir.experience}</p>
                      <p className="text-[9px] text-slate-400 font-semibold mt-0.5">ID: {dir.vizitoDoctorId}</p>
                    </div>
                    <button
                      onClick={() => handleSendRequest(dir)}
                      className="flex items-center gap-1 bg-purple-50 hover:bg-purple-100 text-[#7C3AED] px-2.5 py-1.5 rounded-lg text-[10px] font-black shrink-0 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Invite
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4 flex flex-col items-center gap-3">
              <div className="text-center">
                <p className="text-[11px] font-bold text-slate-500">Doctor not on Vizito yet?</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Send them a platform registration invitation</p>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="flex items-center gap-2 border border-slate-200 hover:border-slate-300 text-slate-700 bg-white px-4 py-2 rounded-xl text-xs font-black shadow-sm cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-[#7C3AED]" /> Invite New Doctor
              </button>
            </div>
          </div>
        </div>

        {/* ─── RIGHT: Requests + Connected ───────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Request Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Incoming Requests */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col max-h-[280px] overflow-hidden">
              <h2 className="text-sm font-black text-slate-800 shrink-0 mb-3">Incoming Requests ({incoming.length})</h2>
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {incoming.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Clock className="w-7 h-7 text-slate-300 mb-2" />
                    <p className="text-xs font-bold text-slate-400">No incoming requests.</p>
                  </div>
                ) : incoming.map(doc => (
                  <div key={doc.id} className="border border-slate-150 p-3 rounded-xl space-y-3">
                    <div>
                      <p className="text-xs font-black text-slate-800">{doc.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{doc.specialisation} · {doc.experience}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleAccept(doc)} className="flex-1 bg-[#7C3AED] text-white py-1.5 rounded-lg text-[10px] font-black cursor-pointer">Accept</button>
                      <button onClick={() => handleDecline(doc)} className="flex-1 bg-slate-100 text-slate-700 py-1.5 rounded-lg text-[10px] font-black cursor-pointer">Decline</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outgoing / Invited */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col max-h-[280px] overflow-hidden">
              <h2 className="text-sm font-black text-slate-800 shrink-0 mb-3">Pending / Invited</h2>
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {outgoing.length === 0 && invited.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Clock className="w-7 h-7 text-slate-300 mb-2" />
                    <p className="text-xs font-bold text-slate-400">No pending requests.</p>
                  </div>
                ) : (
                  <>
                    {outgoing.map(doc => (
                      <div key={doc.id} className="border border-slate-150 p-3 rounded-xl flex items-center justify-between gap-2 bg-slate-50/50">
                        <div>
                          <p className="text-xs font-black text-slate-800">{doc.name}</p>
                          <span className="text-[8px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1 py-0.5 rounded uppercase">Awaiting Accept</span>
                        </div>
                        <button onClick={() => handleCancel(doc)} className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {invited.map(doc => (
                      <div key={doc.id} className="border border-slate-150 p-3 rounded-xl flex items-center justify-between gap-2 bg-purple-50/30">
                        <div>
                          <p className="text-xs font-black text-slate-800">{doc.name}</p>
                          <span className="text-[8px] font-bold text-purple-600 bg-purple-50 border border-purple-200 px-1 py-0.5 rounded uppercase">Invited to Vizito</span>
                        </div>
                        <button onClick={() => removePartnerDoctor(doc.id)} className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Connected Partner Doctors */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-black text-slate-800">Connected Doctors ({connected.length})</h2>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">Approved partner doctors affiliated with your clinic</p>
              </div>
              <span className="text-[10px] font-black text-[#7C3AED] bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100 uppercase">Active Partnerships</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connected.length === 0 ? (
                <div className="col-span-2 text-center py-12 text-slate-400 text-xs font-bold">
                  No active partner doctors yet. Use directory search to connect with Vizito doctors.
                </div>
              ) : (
                connected.map(doc => (
                  <div key={doc.id} className="border border-slate-200 rounded-xl p-4 hover:border-purple-300 hover:shadow-md transition-all flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-black">
                          {doc.name.split(' ').slice(1).map((w: string) => w[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-black text-slate-800 truncate">{doc.name}</p>
                          <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        </div>
                        <p className="text-[10px] font-bold text-slate-500">{doc.specialisation}</p>
                        <p className="text-[9px] font-semibold text-slate-400">{doc.experience} experience</p>
                      </div>
                      <span className="text-[8px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 px-1.5 py-0.5 rounded shrink-0">Connected</span>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-500 font-semibold">
                      <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-400" />{doc.contact}</div>
                      <div className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-slate-400" />{doc.email}</div>
                      <div className="flex items-center gap-1.5"><Stethoscope className="w-3 h-3 text-slate-400" />Vizito ID: {doc.vizitoDoctorId}</div>
                    </div>

                    <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                      <span className="text-[9px] font-bold text-slate-400">Since: {doc.connectedDate}</span>
                      <button
                        onClick={() => handleRemove(doc)}
                        className="flex items-center gap-1 text-rose-500 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all"
                      >
                        <ShieldOff className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ─── INVITE MODAL ──────────────────────────────────────────────────── */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-fade">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-slate-50">
              <div>
                <h3 className="text-sm font-black text-slate-800">Invite New Doctor</h3>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">Send Vizito platform invitation to an unregistered doctor</p>
              </div>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleInvite} className="p-5 space-y-4">
              {[
                { label: 'Doctor Full Name *', value: inviteName, set: setInviteName, placeholder: 'e.g. Dr. Priya Sharma' },
                { label: 'Specialisation *', value: inviteSpec, set: setInviteSpec, placeholder: 'e.g. Dermatology' },
                { label: 'Contact Number *', value: inviteContact, set: setInviteContact, placeholder: '+91 98765 43210' },
                { label: 'Email Address *', value: inviteEmail, set: setInviteEmail, placeholder: 'doctor@example.com' },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1.5">{f.label}</label>
                  <input
                    type="text"
                    required
                    value={f.value}
                    onChange={e => f.set(e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-purple-400"
                  />
                </div>
              ))}
              <div className="flex justify-end gap-2.5 pt-2">
                <button type="button" onClick={() => setIsInviteModalOpen(false)} className="bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer">Cancel</button>
                <button type="submit" className="bg-gradient-to-r from-[#5C2494] to-[#7C3AED] text-white px-4 py-2 rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 cursor-pointer">
                  <Send className="w-3.5 h-3.5" /> Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PartnerDoctorsScreen;
