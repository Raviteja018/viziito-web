import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Search,
  Plus,
  X,
  CheckCircle2,
  Trash2,
  Phone,
  MapPin,
  Mail,
  UserPlus,
  Send,
  Ban,
  Building2,
  Clock,
  ShieldAlert,
  ArrowRightLeft
} from 'lucide-react';
import { useRole } from '../../store/role/RoleContext';
import { useHospitalRole } from '../../store/hospital/HospitalRoleContext';

// ─── Interfaces ──────────────────────────────────────────────────────────────
interface Partner {
  id: string;
  name: string;
  type: 'Pharmacy' | 'Laboratory' | 'Ambulance';
  contact: string;
  address: string;
  status: 'Connected' | 'Pending Outgoing' | 'Incoming' | 'Invited';
  connectedDate?: string;
}

// Registered providers on Vizito who are NOT yet partners
const REGISTERED_DIRECTORY: Omit<Partner, 'status'>[] = [
  { id: 'dir_p1', name: 'Wellness Pharmacy Madhapur', type: 'Pharmacy', contact: '+91 98765 99101', address: 'Metro Pillar 12, Madhapur' },
  { id: 'dir_p2', name: 'Apollo Pharmacy Ameerpet', type: 'Pharmacy', contact: '+91 98765 99102', address: 'Ameerpet X Roads, Hyderabad' },
  { id: 'dir_l1', name: 'Vijaya Diagnostic Centre', type: 'Laboratory', contact: '+91 98765 99201', address: 'Banjara Hills Road No 1' },
  { id: 'dir_l2', name: 'Lucid Medical Diagnostics', type: 'Laboratory', contact: '+91 98765 99202', address: 'Gachibowli Main Road' },
  { id: 'dir_a1', name: 'Apollo Life Ambulance Service', type: 'Ambulance', contact: '+91 98765 99301', address: 'Apollo Hospitals, Jubilee Hills' },
  { id: 'dir_a2', name: 'Aster Prime Emergency Ambulance', type: 'Ambulance', contact: '+91 98765 99302', address: 'Aster Prime Hospital, Ameerpet' }
];

const DEFAULT_PARTNERS: Partner[] = [
  { id: 'p_1', name: 'Apollo Pharmacy Jubilee Hills', type: 'Pharmacy', contact: '+91 98765 11101', address: 'Road No 36, Jubilee Hills', status: 'Connected', connectedDate: '12 May 2026' },
  { id: 'p_2', name: 'MedPlus Gachibowli', type: 'Pharmacy', contact: '+91 98765 11102', address: 'DLF Road, Gachibowli', status: 'Pending Outgoing' },
  { id: 'p_3', name: 'Aster Pharmacy Kukatpally', type: 'Pharmacy', contact: '+91 98765 11103', address: 'JNTU Road, Kukatpally', status: 'Incoming' },
  { id: 'l_1', name: 'Dr. Lal PathLabs Begumpet', type: 'Laboratory', contact: '+91 98765 22201', address: 'Begumpet Main Road', status: 'Connected', connectedDate: '10 Jun 2026' },
  { id: 'l_2', name: 'Thyrocare Secunderabad', type: 'Laboratory', contact: '+91 98765 22202', address: 'MG Road, Secunderabad', status: 'Incoming' },
  { id: 'a_1', name: 'GVK EMRI 108 Ambulance', type: 'Ambulance', contact: '108', address: 'Sanjeevaiah Park Road, Secunderabad', status: 'Connected', connectedDate: '01 Jan 2026' },
  { id: 'a_2', name: 'Red Ambulance Services', type: 'Ambulance', contact: '+91 98765 33301', address: 'Madhapur Metro Station', status: 'Pending Outgoing' }
];

const IntegrationsScreen: React.FC = () => {
  const { role } = useRole();
  const hospitalRoleContext = useHospitalRole();
  const isHospital = role === 'hospital';
  const subRole = hospitalRoleContext?.role; // 'admin' | 'receptionist'

  // Route path active tab switcher
  const location = useLocation();
  const path = location.pathname;

  const [activeTab, setActiveTab] = useState<'Pharmacy' | 'Laboratory' | 'Ambulance'>(() => {
    if (path.includes('pharmacy')) return 'Pharmacy';
    if (path.includes('laboratory')) return 'Laboratory';
    if (path.includes('ambulance')) return 'Ambulance';
    return 'Pharmacy';
  });

  useEffect(() => {
    if (path.includes('pharmacy')) setActiveTab('Pharmacy');
    else if (path.includes('laboratory')) setActiveTab('Laboratory');
    else if (path.includes('ambulance')) setActiveTab('Ambulance');
  }, [path]);

  // Integration database state
  const [partners, setPartners] = useState<Partner[]>(() => {
    const saved = localStorage.getItem('vizito_integrations');
    return saved ? JSON.parse(saved) : DEFAULT_PARTNERS;
  });

  // Search registered directory state
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Invite Form State
  const [inviteName, setInviteName] = useState('');
  const [inviteContact, setInviteContact] = useState('');
  const [inviteAddress, setInviteAddress] = useState('');

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const saveToStorage = (updated: Partner[]) => {
    setPartners(updated);
    localStorage.setItem('vizito_integrations', JSON.stringify(updated));
  };

  // Connect registered provider
  const handleConnectProvider = (dirPartner: Omit<Partner, 'status'>) => {
    const newPartner: Partner = {
      ...dirPartner,
      status: 'Pending Outgoing'
    };
    saveToStorage([...partners, newPartner]);
    showToast(`Integration request sent to ${dirPartner.name}.`, 'success');
  };

  // Accept incoming request
  const handleAcceptRequest = (id: string, name: string) => {
    const updated = partners.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: 'Connected' as const,
          connectedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        };
      }
      return p;
    });
    saveToStorage(updated);
    showToast(`Successfully connected with ${name}!`, 'success');
  };

  // Reject/Cancel request
  const handleRejectRequest = (id: string, name: string, isIncoming = true) => {
    const updated = partners.filter(p => p.id !== id);
    saveToStorage(updated);
    showToast(isIncoming ? `Request from ${name} rejected.` : `Connection request to ${name} cancelled.`, 'info');
  };

  // Remove active integration
  const handleRemoveIntegration = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to disconnect ${name}? This will revoke access between systems.`)) {
      const updated = partners.filter(p => p.id !== id);
      saveToStorage(updated);
      showToast(`Disconnected from ${name}.`, 'info');
    }
  };

  // Send external Vizito Registration Invite
  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteContact || !inviteAddress) {
      showToast('Please fill out all invitation details.', 'info');
      return;
    }

    const newInvite: Partner = {
      id: `invite_${Date.now()}`,
      name: inviteName,
      type: activeTab,
      contact: inviteContact,
      address: inviteAddress,
      status: 'Invited'
    };

    saveToStorage([...partners, newInvite]);
    showToast(`Vizito registration invitation sent to ${inviteName}.`, 'success');
    
    // reset form
    setInviteName('');
    setInviteContact('');
    setInviteAddress('');
    setIsInviteModalOpen(false);
  };

  // Filtering Directory search results (Registered directory not yet added/pending)
  const directoryResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const addedIds = new Set(partners.map(p => p.id));
    return REGISTERED_DIRECTORY.filter(d => {
      return d.type === activeTab &&
        !addedIds.has(d.id) &&
        d.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [activeTab, searchQuery, partners]);

  // Connected Partners List
  const connectedPartners = useMemo(() => {
    return partners.filter(p => p.type === activeTab && p.status === 'Connected');
  }, [activeTab, partners]);

  // Outgoing Pending Requests
  const outgoingRequests = useMemo(() => {
    return partners.filter(p => p.type === activeTab && p.status === 'Pending Outgoing');
  }, [activeTab, partners]);

  // Incoming Requests
  const incomingRequests = useMemo(() => {
    return partners.filter(p => p.type === activeTab && p.status === 'Incoming');
  }, [activeTab, partners]);

  // Invited Partners List
  const invitedPartners = useMemo(() => {
    return partners.filter(p => p.type === activeTab && p.status === 'Invited');
  }, [activeTab, partners]);

  if (isHospital && subRole === 'receptionist') {
    return (
      <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl shadow-sm font-sans">
        <ShieldAlert className="w-10 h-10 text-rose-600 mx-auto mb-3" />
        <h2 className="text-lg font-black text-rose-600 mb-2">Access Denied</h2>
        <p className="text-sm text-slate-500 font-bold">Receptionists are not authorized to configure healthcare provider integrations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-fade flex items-center gap-3 bg-slate-900 border border-slate-800 text-white px-5 py-3.5 rounded-2xl shadow-xl max-w-sm">
          <CheckCircle2 className={`w-5 h-5 shrink-0 ${toast.type === 'info' ? 'text-rose-500' : 'text-teal-400'}`} />
          <p className="text-xs font-bold leading-normal text-white">{toast.message}</p>
        </div>
      )}

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2B2B2B] tracking-tight">Integration Hub</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">Connect your hospital system with pharmacies, diagnostic labs, and ambulance providers on the Vizito platform</p>
        </div>
        
        {/* Tabs Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 self-start md:self-auto">
          {[
            { id: 'Pharmacy', label: 'Pharmacies' },
            { id: 'Laboratory', label: 'Laboratories' },
            { id: 'Ambulance', label: 'Ambulances' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer ${activeTab === tab.id ? 'bg-white text-[#7C3AED] shadow-sm font-black' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ─── LEFT COLUMN: SEARCH & CONNECT DIRECTORY ────────────────────────── */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-800">Find Registered Providers</h2>
            <p className="text-[11px] font-semibold text-slate-400 leading-normal">Search registered providers already active on the platform to link them instantly</p>
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={`Search registered ${activeTab.toLowerCase()}s...`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-purple-600/10 focus:border-[#5C2494]/30"
              />
            </div>

            {/* Search Results directory */}
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {searchQuery.trim().length > 0 && directoryResults.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs font-bold">
                  No unconnected providers found.
                </div>
              )}
              {directoryResults.map(dirP => (
                <div key={dirP.id} className="border border-slate-150 p-3 rounded-xl flex items-center justify-between gap-2 hover:bg-slate-50/50">
                  <div className="space-y-0.5 max-w-[70%]">
                    <div className="text-xs font-black text-slate-850 truncate">{dirP.name}</div>
                    <div className="text-[9.5px] font-bold text-slate-400 truncate">{dirP.address}</div>
                  </div>
                  <button
                    onClick={() => handleConnectProvider(dirP)}
                    className="flex items-center gap-1 bg-purple-50 hover:bg-purple-100 text-[#7C3AED] px-2.5 py-1.5 rounded-lg text-[10px] font-black tracking-wide shrink-0 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Connect
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4 flex flex-col items-center gap-3">
              <div className="text-center">
                <p className="text-[11px] font-bold text-slate-500">Partner not found in directory search?</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Invite them to register an account on Vizito</p>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="flex items-center gap-2 border border-slate-200 hover:border-slate-300 text-slate-700 bg-white px-4 py-2 rounded-xl text-xs font-black shadow-sm transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-[#7C3AED]" />
                Invite New Provider
              </button>
            </div>

          </div>
        </div>

        {/* ─── RIGHT COLUMN: PARTNERSHIP REQUESTS & INVITATIONS ─────────────── */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Requests Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Incoming Requests */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col max-h-[300px] overflow-hidden">
              <h2 className="text-sm font-black text-slate-850 shrink-0">Incoming Requests ({incomingRequests.length})</h2>
              
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {incomingRequests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center">
                    <Clock className="w-7 h-7 text-slate-300 mb-2" />
                    <p className="text-xs font-bold">No incoming partner requests.</p>
                  </div>
                ) : (
                  incomingRequests.map(req => (
                    <div key={req.id} className="border border-slate-150 p-3 rounded-xl space-y-3 hover:bg-slate-50/20">
                      <div>
                        <div className="text-xs font-black text-slate-850">{req.name}</div>
                        <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{req.address}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAcceptRequest(req.id, req.name)}
                          className="flex-1 bg-[#7C3AED] hover:opacity-95 text-white py-1.5 rounded-lg text-[10px] font-black cursor-pointer text-center"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectRequest(req.id, req.name, true)}
                          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 rounded-lg text-[10px] font-black cursor-pointer text-center"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Outgoing Requests & Invited */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col max-h-[300px] overflow-hidden">
              <h2 className="text-sm font-black text-slate-855 shrink-0">Pending Outgoing / Invited</h2>
              
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {outgoingRequests.length === 0 && invitedPartners.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center">
                    <Clock className="w-7 h-7 text-slate-300 mb-2" />
                    <p className="text-xs font-bold">No outgoing requests pending.</p>
                  </div>
                ) : (
                  <>
                    {outgoingRequests.map(req => (
                      <div key={req.id} className="border border-slate-150 p-3 rounded-xl flex items-center justify-between gap-3 bg-slate-50/50">
                        <div>
                          <div className="text-xs font-black text-slate-850">{req.name}</div>
                          <span className="inline-block text-[8px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1 py-0.5 rounded mt-1 uppercase">Awaiting Partner Accept</span>
                        </div>
                        <button
                          onClick={() => handleRejectRequest(req.id, req.name, false)}
                          className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg shrink-0 cursor-pointer"
                          title="Cancel Connection Request"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {invitedPartners.map(req => (
                      <div key={req.id} className="border border-slate-150 p-3 rounded-xl flex items-center justify-between gap-3 bg-purple-50/30">
                        <div>
                          <div className="text-xs font-black text-slate-850">{req.name}</div>
                          <span className="inline-block text-[8px] font-bold text-purple-600 bg-purple-50 border border-purple-200 px-1 py-0.5 rounded mt-1 uppercase">Invited to Join Platform</span>
                        </div>
                        <button
                          onClick={() => handleRejectRequest(req.id, req.name, false)}
                          className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg shrink-0 cursor-pointer"
                          title="Revoke Invitation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

          </div>

          {/* Connected Providers List */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-black text-slate-850">Connected {activeTab}s ({connectedPartners.length})</h2>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">Approved provider partnerships sharing integrated referral records</p>
              </div>
              <span className="text-[10px] font-black text-[#7C3AED] bg-purple-50 px-2.5 py-1 rounded-full uppercase border border-purple-100">Active integrations</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connectedPartners.length === 0 ? (
                <div className="col-span-2 text-center py-12 text-slate-400 text-xs font-bold">
                  No active provider integrations linked. Configure connections using directory search.
                </div>
              ) : (
                connectedPartners.map(partner => (
                  <div key={partner.id} className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between gap-4 hover:border-purple-600/30 hover:shadow-md transition-all">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-slate-800">{partner.name}</h4>
                        <span className="text-[8px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-250 px-1.5 py-0.5 rounded uppercase">Connected</span>
                      </div>
                      
                      <div className="space-y-1 text-[11px] text-slate-500 font-semibold">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{partner.contact}</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span className="leading-tight">{partner.address}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                      <span className="text-[9px] font-bold text-slate-400">Integrated: {partner.connectedDate}</span>
                      <button
                        onClick={() => handleRemoveIntegration(partner.id, partner.name)}
                        className="text-rose-500 hover:bg-rose-50 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Disconnect
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ─── MODAL: SEND REGISTRATION INVITATION ───────────────────────────────── */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl animate-fade">
            
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-slate-50">
              <div>
                <h3 className="text-sm font-black text-slate-800">Invite New Partner</h3>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">Send Vizito invite link to an unregistered provider</p>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-400 hover:text-slate-650 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="p-5 space-y-4">
              
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1.5">Provider Name *</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  placeholder={`e.g. Wellness Diagnostics ${activeTab}`}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1.5">Contact Number *</label>
                <input
                  type="text"
                  required
                  value={inviteContact}
                  onChange={e => setInviteContact(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1.5">Address *</label>
                <textarea
                  required
                  rows={3}
                  value={inviteAddress}
                  onChange={e => setInviteAddress(e.target.value)}
                  placeholder="Street address, city details..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#5C2494] to-[#7C3AED] hover:opacity-95 text-white px-4 py-2 rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send Invitation
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default IntegrationsScreen;
