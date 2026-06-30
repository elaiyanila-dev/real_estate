import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Building2,
  CheckCircle2,
  Clock3,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Search,
  MessageSquare,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
  Loader2,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import ProfileEditor from '../components/ProfileEditor.jsx';
import {
  approveBroker,
  deleteProperty,
  fetchAdminStats,
  fetchAdminUsers,
  fetchPendingBrokers,
  fetchProperties,
  rejectBroker,
  updateProperty,
  updateUserRole,
} from '../services/api.jsx';

function formatPrice(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value || 0));
}

const analytics = [
  { label: 'Total Properties', value: '10,840', change: '+18%', icon: Building2 },
  { label: 'Pending Approval', value: '128', change: '-9%', icon: Clock3 },
  { label: 'Active Listings', value: '8,926', change: '+22%', icon: CheckCircle2 },
  { label: 'User Analytics', value: '42.7K', change: '+18%', icon: BarChart3 },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ propertiesCount: 0, usersCount: 0, enquiriesCount: 0, brokerRequestsCount: 0 });
  const [pendingBrokers, setPendingBrokers] = useState([]);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);

  const filteredProperties = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return properties;
    return properties.filter((property) =>
      [property.title, property.location, property.city, property.property_type]
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  }, [properties, query]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const [statsData, pendingData, usersData, propertiesData] = await Promise.all([
          fetchAdminStats(),
          fetchPendingBrokers(),
          fetchAdminUsers(),
          fetchProperties({ status: '' }),
        ]);
        if (!active) return;
        setStats(statsData);
        setPendingBrokers(pendingData);
        setUsers(usersData);
        setProperties(propertiesData);
      } catch (error) {
        if (active) setToast(error.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const refresh = async () => {
    const [statsData, pendingData, usersData, propertiesData] = await Promise.all([
      fetchAdminStats(),
      fetchPendingBrokers(),
      fetchAdminUsers(),
      fetchProperties({ status: '' }),
    ]);
    setStats(statsData);
    setPendingBrokers(pendingData);
    setUsers(usersData);
    setProperties(propertiesData);
  };

  const handleApprove = async (brokerId) => {
    setSaving(true);
    try {
      await approveBroker(brokerId, user.id);
      await refresh();
      setToast('Broker approved and notified.');
    } catch (error) {
      setToast(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReject = async (brokerId) => {
    setSaving(true);
    try {
      await rejectBroker(brokerId, user.id);
      await refresh();
      setToast('Broker rejected and notified.');
    } catch (error) {
      setToast(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRoleChange = async (profileId, role) => {
    setSaving(true);
    try {
      await updateUserRole(profileId, role);
      await refresh();
      setToast('User role updated.');
    } catch (error) {
      setToast(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePropertyDelete = async (propertyId) => {
    if (!window.confirm('Delete this property?')) return;
    setSaving(true);
    try {
      await deleteProperty(propertyId);
      await refresh();
      setToast('Property deleted.');
    } catch (error) {
      setToast(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePropertyStatus = async (property, nextStatus) => {
    setSaving(true);
    try {
      await updateProperty(property.id, { ...property, status: nextStatus });
      await refresh();
      setToast('Property status updated.');
    } catch (error) {
      setToast(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r border-[#E5E7EB] bg-white p-5 lg:flex lg:flex-col">
        <Link to="/" className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F766E] font-extrabold text-white">A</div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B7280]">Admin</div>
            <div className="text-xl font-extrabold text-[#134E4A]">ALAYAA</div>
          </div>
        </Link>
        <nav className="flex-1 space-y-2">
          {[
            ['overview', 'Overview', LayoutDashboard],
            ['brokers', 'Brokers', ShieldCheck],
            ['properties', 'Properties', Building2],
            ['users', 'Users', Users],
            ['profile', 'Profile', Settings],
          ].map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                tab === id ? 'bg-[#0F766E] text-white' : 'text-[#6B7280] hover:bg-[#F0FAF8] hover:text-[#0F766E]'
              }`}
            >
              <Icon size={17} /> {label}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-[#6B7280] hover:bg-[#F8F8F7]">
          <LogOut size={17} /> Logout
        </button>
      </aside>

      <main className="p-5 lg:ml-64 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)] sm:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="section-eyebrow">Operations</p>
                <h1 className="mt-2 text-4xl font-extrabold text-[#1F2937]">Admin dashboard</h1>
                <p className="mt-2 text-[#6B7280]">
                  Manage users, properties, and broker approvals from one secure workspace.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge>{user?.profile?.full_name || 'Admin'}</Badge>
                <Badge>{user?.email || user?.profile?.email}</Badge>
              </div>
            </div>
          </div>

          {toast ? <Toast text={toast} onClose={() => setToast('')} /> : null}

          {/* OVERVIEW TAB */}
          {tab === 'overview' ? (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Metric icon={Building2} label="Properties" value={stats.propertiesCount} />
                <Metric icon={Users} label="Users" value={stats.usersCount} />
                <Metric icon={MessageSquare} label="Enquiries" value={stats.enquiriesCount} />
                <Metric icon={Clock3} label="Pending brokers" value={stats.brokerRequestsCount} />
              </div>
            </div>
          ) : null}

          {/* BROKERS TAB */}
          {tab === 'brokers' ? (
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-14 text-[#6B7280]">
                  <Loader2 className="mr-2 animate-spin" size={18} /> Loading brokers...
                </div>
              ) : pendingBrokers.length === 0 ? (
                <EmptyState
                  title="No pending brokers"
                  description="New broker requests will show up here for approval."
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {pendingBrokers.map((item) => (
                    <PendingCard
                      key={item.broker_id}
                      item={item}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      saving={saving}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {/* PROPERTIES TAB */}
          {tab === 'properties' ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3">
                <Search size={18} className="text-[#6B7280]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by title, location, city, or type..."
                  className="w-full border-none bg-transparent text-sm outline-none placeholder:text-[#9CA3AF]"
                />
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-14 text-[#6B7280]">
                  <Loader2 className="mr-2 animate-spin" size={18} /> Loading properties...
                </div>
              ) : filteredProperties.length === 0 ? (
                <EmptyState
                  title="No properties found"
                  description="Try a different search term, or check back once listings are added."
                />
              ) : (
                <div className="space-y-3">
                  {filteredProperties.map((property) => (
                    <div
                      key={property.id}
                      className="flex flex-col gap-3 rounded-[24px] border border-[#E5E7EB] bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <div className="font-extrabold text-[#1F2937]">{property.title}</div>
                        <div className="mt-1 text-sm text-[#6B7280]">
                          {property.location}, {property.city} &middot; {property.property_type}
                        </div>
                        <div className="mt-1 text-sm font-bold text-[#0F766E]">{formatPrice(property.price)}</div>
                        <div className="mt-2">
                          <StatusPill>{property.status}</StatusPill>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {property.status !== 'approved' ? (
                          <button
                            disabled={saving}
                            onClick={() => handlePropertyStatus(property, 'approved')}
                            className="rounded-2xl bg-[#0F766E] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
                          >
                            Approve
                          </button>
                        ) : null}
                        {property.status !== 'rejected' ? (
                          <button
                            disabled={saving}
                            onClick={() => handlePropertyStatus(property, 'rejected')}
                            className="rounded-2xl bg-amber-50 px-4 py-2.5 text-sm font-bold text-amber-600 disabled:opacity-60"
                          >
                            Reject
                          </button>
                        ) : null}
                        <button
                          disabled={saving}
                          onClick={() => handlePropertyDelete(property.id)}
                          className="flex items-center gap-2 rounded-2xl bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-600 disabled:opacity-60"
                        >
                          <Trash2 size={15} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {/* USERS TAB */}
          {tab === 'users' ? (
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-14 text-[#6B7280]">
                  <Loader2 className="mr-2 animate-spin" size={18} /> Loading users...
                </div>
              ) : users.length === 0 ? (
                <EmptyState title="No users yet" description="Registered users will appear here." />
              ) : (
                <div className="space-y-3">
                  {users.map((person) => (
                    <div
                      key={person.id}
                      className="flex flex-col gap-3 rounded-[24px] border border-[#E5E7EB] bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <div className="font-extrabold text-[#1F2937]">{person.full_name || 'Unnamed user'}</div>
                        <div className="mt-1 text-sm text-[#6B7280]">{person.email}</div>
                        <div className="mt-2">
                          <Badge>{person.role || 'customer'}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserCog size={16} className="text-[#6B7280]" />
                        <select
                          disabled={saving}
                          value={person.role || 'customer'}
                          onChange={(e) => handleRoleChange(person.id, e.target.value)}
                          className="rounded-2xl border border-[#E5E7EB] px-3 py-2 text-sm font-bold text-[#1F2937] disabled:opacity-60"
                        >
                          <option value="customer">Customer</option>
                          <option value="broker">Broker</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {/* PROFILE TAB */}
          {tab === 'profile' ? (
            <div className="space-y-4">
              <ProfileEditor />
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="surface rounded-[28px] p-6">
      <Icon size={22} className="mb-5 text-[#0F766E]" />
      <div className="text-3xl font-extrabold text-[#1F2937]">{value}</div>
      <div className="mt-1 text-sm text-[#6B7280]">{label}</div>
    </div>
  );
}

function PendingCard({ item, onApprove, onReject, saving }) {
  return (
    <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5">
      <div className="font-extrabold text-[#1F2937]">{item.profile?.full_name || 'Broker'}</div>
      <div className="mt-1 text-sm text-[#6B7280]">{item.profile?.email}</div>
      <div className="mt-1 text-sm text-[#6B7280]">{item.profile?.city || 'No city set'}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge>{item.status}</Badge>
        <Badge>{item.profile?.role || 'broker'}</Badge>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          disabled={saving}
          onClick={() => onApprove(item.broker_id)}
          className="rounded-2xl bg-[#0F766E] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
        >
          Approve
        </button>
        <button
          disabled={saving}
          onClick={() => onReject(item.broker_id)}
          className="rounded-2xl bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-600 disabled:opacity-60"
        >
          Reject
        </button>
      </div>
    </div>
  );
}

function StatusPill({ children }) {
  return <span className="rounded-full bg-[#F0FAF8] px-3 py-1 text-xs font-bold text-[#0F766E]">{children}</span>;
}

function Badge({ children }) {
  return <span className="rounded-full bg-[#F8F8F7] px-3 py-1 text-xs font-bold text-[#6B7280]">{children}</span>;
}

function EmptyState({ title, description }) {
  return (
    <div className="rounded-[24px] border border-dashed border-[#E5E7EB] bg-white px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0FAF8] text-[#0F766E]">
        <ListChecks size={20} />
      </div>
      <div className="mt-4 text-lg font-extrabold text-[#1F2937]">{title}</div>
      <p className="mt-2 text-sm text-[#6B7280]">{description}</p>
    </div>
  );
}

function Toast({ text, onClose }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-[#134E4A] px-5 py-4 text-sm font-bold text-white shadow-xl">
      {text}
      <button onClick={onClose} className="ml-4 text-white/70 hover:text-white">x</button>
    </div>
  );
}
