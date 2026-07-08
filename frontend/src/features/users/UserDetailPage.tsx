import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Shield, Check, Minus, ChevronDown, ChevronRight, Settings, Plus, Trash2, Edit2 } from 'lucide-react';
import { PageHeader } from '@/layout/PageHeader';
import { useUsers } from '@/hooks/useUsers';
import { useDepartments } from '@/hooks/useDepartments';
import { Avatar, Modal, Button, Input } from '@/design-system';
import { ROLE_LABELS } from '@/utils';
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { mockUsers, mockDepartments, mockPermissions } from '@/mockData';
import type { Role, PermissionCategory, PermissionNode } from '@/types';

export function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useUsers();
  const { data: deptsData } = useDepartments();
  const queryClient = useQueryClient();
  
  const user = data?.results?.find(u => u.id === Number(id));
  const depts = deptsData?.results ?? [];
  
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({
    'tms:ticket': true,
    'iam:user': true
  });

  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<Role>('MEMBER');
  const [departmentId, setDepartmentId] = useState('');

  // Policies states
  const [availablePermissions, setAvailablePermissions] = useState<PermissionCategory[]>(mockPermissions);
  const [showManagePolicies, setShowManagePolicies] = useState(false);
  
  // Add Policy form
  const [addingPolicyToCat, setAddingPolicyToCat] = useState<string | null>(null);
  const [newPolicyId, setNewPolicyId] = useState('');
  const [newPolicyName, setNewPolicyName] = useState('');
  const [newPolicyDesc, setNewPolicyDesc] = useState('');

  // Edit Policy form
  const [editingPolicy, setEditingPolicy] = useState<{ catId: string; permId: string } | null>(null);
  const [editPolicyName, setEditPolicyName] = useState('');
  const [editPolicyDesc, setEditPolicyDesc] = useState('');

  // Add Category form
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCatId, setNewCatId] = useState('');
  const [newCatName, setNewCatName] = useState('');

  // Mock initial permissions based on role
  useEffect(() => {
    if (user) {
      setFullName(user.full_name);
      setRole(user.role);
      setDepartmentId(user.department?.id ? String(user.department.id) : '');

      const isSuper = user.role === 'SUPER_ADMIN';
      const isHead = user.role === 'DEPT_HEAD';
      const isMember = user.role === 'MEMBER';
      const isCaller = user.role === 'CALLER';
      
      const initialPerms: Record<string, boolean> = {};
      
      availablePermissions.forEach(cat => {
        cat.permissions.forEach(p => {
          if (user.permissions?.includes(p.id)) {
            initialPerms[p.id] = true;
          } else if (user.permissions) {
            initialPerms[p.id] = false;
          } else {
            if (isSuper) initialPerms[p.id] = true;
            else if (isHead && (p.id.startsWith('tms:ticket') || p.id === 'ai:engine:reports')) initialPerms[p.id] = true;
            else if ((isMember || isCaller) && ['tms:ticket:read_dept', 'tms:ticket:create', 'tms:ticket:update'].includes(p.id)) initialPerms[p.id] = true;
            else initialPerms[p.id] = false;
          }
        });
      });
      
      setPermissions(initialPerms);
    }
  }, [user, availablePermissions]);

  if (!user) {
    return <div className="p-8 text-center text-text-muted">Loading user...</div>;
  }

  const handleTogglePerm = (permId: string) => {
    setPermissions(prev => ({ ...prev, [permId]: !prev[permId] }));
  };

  const handleToggleCat = (catId: string, state: boolean) => {
    const cat = availablePermissions.find(c => c.id === catId);
    if (!cat) return;
    
    setPermissions(prev => {
      const next = { ...prev };
      cat.permissions.forEach(p => { next[p.id] = state; });
      return next;
    });
  };

  const toggleExpand = (catId: string) => {
    setExpandedCats(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  const getCategoryState = (catId: string) => {
    const cat = availablePermissions.find(c => c.id === catId);
    if (!cat) return 'none';
    const activeCount = cat.permissions.filter(p => permissions[p.id]).length;
    if (activeCount === 0) return 'none';
    if (activeCount === cat.permissions.length) return 'all';
    return 'partial';
  };

  // Manage Category & Permissions Actions
  const handleAddCategory = () => {
    if (!newCatId || !newCatName) {
      toast.error('All fields are required');
      return;
    }
    if (availablePermissions.some(c => c.id === newCatId)) {
      toast.error('Category ID already exists');
      return;
    }
    mockPermissions.push({
      id: newCatId,
      name: newCatName,
      permissions: []
    });
    setAvailablePermissions([...mockPermissions]);
    setNewCatId('');
    setNewCatName('');
    setShowAddCategory(false);
    toast.success('Category added successfully');
  };

  const handleDeleteCategory = (catId: string) => {
    const idx = mockPermissions.findIndex(c => c.id === catId);
    if (idx !== -1) {
      const cat = mockPermissions[idx];
      setPermissions(prev => {
        const next = { ...prev };
        cat.permissions.forEach(p => { delete next[p.id]; });
        return next;
      });
      mockPermissions.splice(idx, 1);
      setAvailablePermissions([...mockPermissions]);
      toast.success('Category deleted successfully');
    }
  };

  const handleAddPermission = () => {
    if (!addingPolicyToCat || !newPolicyId || !newPolicyName || !newPolicyDesc) {
      toast.error('All fields are required');
      return;
    }
    const cat = mockPermissions.find(c => c.id === addingPolicyToCat);
    if (!cat) return;
    if (cat.permissions.some(p => p.id === newPolicyId)) {
      toast.error('Policy URN already exists');
      return;
    }
    cat.permissions.push({
      id: newPolicyId,
      name: newPolicyName,
      description: newPolicyDesc
    });
    setAvailablePermissions([...mockPermissions]);
    setNewPolicyId('');
    setNewPolicyName('');
    setNewPolicyDesc('');
    setAddingPolicyToCat(null);
    toast.success('Permission policy created');
  };

  const handleStartEditPermission = (catId: string, p: PermissionNode) => {
    setEditingPolicy({ catId, permId: p.id });
    setEditPolicyName(p.name);
    setEditPolicyDesc(p.description);
  };

  const handleSaveEditPermission = () => {
    if (!editingPolicy || !editPolicyName || !editPolicyDesc) return;
    const cat = mockPermissions.find(c => c.id === editingPolicy.catId);
    if (!cat) return;
    const perm = cat.permissions.find(p => p.id === editingPolicy.permId);
    if (perm) {
      perm.name = editPolicyName;
      perm.description = editPolicyDesc;
      setAvailablePermissions([...mockPermissions]);
      setEditingPolicy(null);
      toast.success('Permission policy updated');
    }
  };

  const handleDeletePermission = (catId: string, permId: string) => {
    const cat = mockPermissions.find(c => c.id === catId);
    if (!cat) return;
    const idx = cat.permissions.findIndex(p => p.id === permId);
    if (idx !== -1) {
      cat.permissions.splice(idx, 1);
      setPermissions(prev => {
        const next = { ...prev };
        delete next[permId];
        return next;
      });
      setAvailablePermissions([...mockPermissions]);
      toast.success('Permission policy deleted');
    }
  };

  const handleSave = () => {
    const idx = mockUsers.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      const parts = fullName.trim().split(/\s+/);
      const first_name = parts[0] || '';
      const last_name = parts.slice(1).join(' ') || '';
      const selectedDept = mockDepartments.find(d => String(d.id) === departmentId);
      const activePermissions = Object.keys(permissions).filter(k => permissions[k]);

      mockUsers[idx] = {
        ...mockUsers[idx],
        full_name: fullName,
        first_name,
        last_name,
        role,
        department: selectedDept,
        permissions: activePermissions
      };

      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('User profile and access policies saved successfully!');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="h-8 w-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-surface-secondary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <PageHeader
            title="User Profile & Access Control"
            subtitle="Manage user details and enterprise IAM policies"
            actions={
              <button 
                onClick={handleSave}
                className="h-9 px-4 rounded-lg bg-brand-purple text-white text-sm font-semibold hover:bg-brand-purple/90 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Save className="h-4 w-4" /> Save Policies
              </button>
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Col - Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-surface-border p-6 shadow-sm flex flex-col items-center text-center">
            <Avatar name={user.full_name} size="lg" className="h-20 w-20 text-2xl mb-4" />
            <h2 className="text-xl font-bold text-text-primary">{user.full_name}</h2>
            <p className="text-sm font-medium text-brand-purple mt-1 bg-brand-purple-faint px-3 py-1 rounded-full">
              {ROLE_LABELS[user.role]}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-surface-border shadow-sm">
            <div className="px-5 py-4 border-b border-surface-border">
              <h3 className="font-semibold text-text-primary text-sm">Identity Profile</h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-surface-border bg-white text-sm focus:outline-none focus:border-brand-purple" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Email Address</label>
                <input type="email" defaultValue={user.email} className="w-full h-9 px-3 rounded-lg border border-surface-border bg-surface-secondary/50 text-sm focus:outline-none text-text-secondary" readOnly />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Base Role</label>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full h-9 px-3 rounded-lg border border-surface-border bg-white text-sm focus:outline-none focus:border-brand-purple"
                >
                  {Object.entries(ROLE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Department</label>
                <select 
                  value={departmentId} 
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-surface-border bg-white text-sm focus:outline-none focus:border-brand-purple"
                >
                  <option value="">No Department</option>
                  {depts.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col - Detailed RBAC IAM */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-surface-border shadow-sm h-full flex flex-col">
            <div className="px-6 py-5 border-b border-surface-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary text-base">IAM Permission Policies</h3>
                  <p className="text-xs text-text-muted mt-0.5">Granular resource-level access control</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowManagePolicies(true)}
                  className="h-8 px-3 rounded-lg border border-brand-purple/20 text-brand-purple text-xs font-semibold hover:bg-brand-purple-faint transition-colors flex items-center gap-1.5"
                >
                  <Settings className="h-3.5 w-3.5" /> Manage Policies
                </button>
                <div className="text-xs font-semibold text-text-muted bg-surface-secondary px-3 py-1.5 rounded-lg border border-surface-border">
                  {Object.values(permissions).filter(Boolean).length} Policies Active
                </div>
              </div>
            </div>
            
            <div className="p-0 flex-1 overflow-y-auto">
              <div className="divide-y divide-surface-border">
                {availablePermissions.map(category => {
                  const state = getCategoryState(category.id);
                  const isExpanded = expandedCats[category.id];
                  
                  return (
                    <div key={category.id} className="bg-white">
                      {/* Category Header */}
                      <div className="flex items-center px-4 py-3 hover:bg-surface-secondary/30 transition-colors">
                        <button 
                          className="p-1 text-text-muted hover:text-text-primary mr-2"
                          onClick={() => toggleExpand(category.id)}
                        >
                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </button>
                        
                        <div className="flex-1 cursor-pointer" onClick={() => toggleExpand(category.id)}>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-text-primary">{category.name}</h4>
                            <span className="text-[10px] font-mono text-text-muted bg-surface-secondary px-1.5 py-0.5 rounded border border-surface-border">
                              {category.id}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-text-muted w-24 text-right">
                            {state === 'all' ? 'All granted' : state === 'partial' ? 'Partially granted' : 'None granted'}
                          </span>
                          <button
                            onClick={() => handleToggleCat(category.id, state !== 'all')}
                            className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${
                              state === 'all' ? 'bg-brand-purple border-brand-purple text-white' : 
                              state === 'partial' ? 'bg-brand-purple/20 border-brand-purple text-brand-purple' : 
                              'border-surface-border bg-white text-transparent'
                            }`}
                          >
                            {state === 'all' ? <Check className="h-3.5 w-3.5" /> : state === 'partial' ? <Minus className="h-3.5 w-3.5" /> : null}
                          </button>
                        </div>
                      </div>

                      {/* Permissions List */}
                      {isExpanded && (
                        <div className="bg-surface-secondary/20 border-t border-surface-border">
                          {category.permissions.length === 0 ? (
                            <div className="p-4 text-center text-xs text-text-muted">No policies inside this category</div>
                          ) : (
                            <table className="w-full text-sm">
                              <thead className="bg-surface-secondary/50">
                                <tr>
                                  <th className="px-11 py-2 text-left text-[10px] font-bold text-text-muted uppercase tracking-wider w-[200px]">Action Name</th>
                                  <th className="px-4 py-2 text-left text-[10px] font-bold text-text-muted uppercase tracking-wider w-[250px]">Resource Action (URN)</th>
                                  <th className="px-4 py-2 text-left text-[10px] font-bold text-text-muted uppercase tracking-wider">Description</th>
                                  <th className="px-6 py-2 text-right text-[10px] font-bold text-text-muted uppercase tracking-wider w-[80px]">Access</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-surface-border">
                                {category.permissions.map(perm => (
                                  <tr key={perm.id} className="hover:bg-white transition-colors group">
                                    <td className="px-11 py-2.5 font-medium text-text-primary text-xs">
                                      {perm.name}
                                    </td>
                                    <td className="px-4 py-2.5">
                                      <span className="font-mono text-[11px] text-text-secondary bg-surface-tertiary px-1.5 py-0.5 rounded border border-surface-border group-hover:bg-white transition-colors">
                                        {perm.id}
                                      </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-xs text-text-secondary">
                                      {perm.description}
                                    </td>
                                    <td className="px-6 py-2.5 text-right">
                                      <button
                                        onClick={() => handleTogglePerm(perm.id)}
                                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-1 ${
                                          permissions[perm.id] ? 'bg-brand-purple' : 'bg-surface-border'
                                        }`}
                                      >
                                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                                          permissions[perm.id] ? 'translate-x-4' : 'translate-x-1'
                                        }`} />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="p-4 border-t border-surface-border bg-surface-secondary/30 text-xs text-text-muted text-center">
              Policies are evaluated in a logical OR manner. Explicit deny rules are managed via Department configurations.
            </div>
          </div>
        </div>
      </div>

      {/* Global IAM Policies Management Modal */}
      <Modal
        isOpen={showManagePolicies}
        onClose={() => {
          setShowManagePolicies(false);
          setAddingPolicyToCat(null);
          setEditingPolicy(null);
          setShowAddCategory(false);
        }}
        title="Manage Global IAM Permission Policies"
        size="lg"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <p className="text-xs text-text-muted">
              Add, edit, or remove permission definitions available system-wide.
            </p>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setShowAddCategory(true)}
            >
              Add Category
            </Button>
          </div>

          {/* Add Category Form Overlay */}
          {showAddCategory && (
            <div className="bg-surface-secondary p-4 rounded-lg border border-surface-border space-y-4">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">New Policy Category</h4>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Category Name"
                  placeholder="e.g. System Logs"
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                />
                <Input
                  label="Category URN / ID"
                  placeholder="e.g. sys:log"
                  value={newCatId}
                  onChange={e => setNewCatId(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" size="sm" onClick={() => setShowAddCategory(false)}>Cancel</Button>
                <Button variant="primary" size="sm" onClick={handleAddCategory}>Save Category</Button>
              </div>
            </div>
          )}

          {/* Add Policy Form Overlay */}
          {addingPolicyToCat && (
            <div className="bg-surface-secondary p-4 rounded-lg border border-surface-border space-y-4">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Add Policy to {availablePermissions.find(c => c.id === addingPolicyToCat)?.name}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  label="Policy Name"
                  placeholder="e.g. Export Reports"
                  value={newPolicyName}
                  onChange={e => setNewPolicyName(e.target.value)}
                />
                <Input
                  label="Policy URN / ID"
                  placeholder="e.g. ai:engine:export"
                  value={newPolicyId}
                  onChange={e => setNewPolicyId(e.target.value)}
                />
                <Input
                  label="Description"
                  placeholder="Allows downloading analytical exports"
                  value={newPolicyDesc}
                  onChange={e => setNewPolicyDesc(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" size="sm" onClick={() => setAddingPolicyToCat(null)}>Cancel</Button>
                <Button variant="primary" size="sm" onClick={handleAddPermission}>Create Policy</Button>
              </div>
            </div>
          )}

          {/* Edit Policy Form Overlay */}
          {editingPolicy && (
            <div className="bg-surface-secondary p-4 rounded-lg border border-surface-border space-y-4">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Edit Policy URN: {editingPolicy.permId}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  label="Policy Name"
                  value={editPolicyName}
                  onChange={e => setEditPolicyName(e.target.value)}
                />
                <Input
                  label="Description"
                  value={editPolicyDesc}
                  onChange={e => setEditPolicyDesc(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" size="sm" onClick={() => setEditingPolicy(null)}>Cancel</Button>
                <Button variant="primary" size="sm" onClick={handleSaveEditPermission}>Update Policy</Button>
              </div>
            </div>
          )}

          {/* Categories and Policies list */}
          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
            {availablePermissions.map(cat => (
              <div key={cat.id} className="border border-surface-border rounded-lg overflow-hidden bg-white">
                <div className="bg-surface-secondary px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-text-primary">{cat.name}</span>
                    <span className="font-mono text-[10px] text-text-muted bg-white border border-surface-border px-1 py-0.5 rounded">{cat.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      leftIcon={<Plus className="h-3 w-3" />}
                      onClick={() => setAddingPolicyToCat(cat.id)}
                    >
                      Add Policy
                    </Button>
                    <button 
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-surface-border">
                  {cat.permissions.map(p => (
                    <div key={p.id} className="px-4 py-2 flex items-center justify-between text-xs hover:bg-surface-secondary/10 transition-colors">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-text-primary">{p.name}</span>
                          <span className="font-mono text-[10px] text-text-muted">{p.id}</span>
                        </div>
                        <p className="text-[11px] text-text-muted mt-0.5">{p.description}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleStartEditPermission(cat.id, p)}
                          className="p-1.5 text-text-secondary hover:bg-surface-secondary rounded transition-colors"
                          title="Edit Policy"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDeletePermission(cat.id, p.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Policy"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {cat.permissions.length === 0 && (
                    <div className="p-3 text-center text-xs text-text-muted italic bg-surface-secondary/10">No policies in this category. Click Add Policy to create one.</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
