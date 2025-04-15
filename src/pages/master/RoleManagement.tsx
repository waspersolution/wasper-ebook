
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, RefreshCw, Search, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import RolePermissionsForm from '@/components/roles/RolePermissionsForm';

// Mock data for roles
const mockRoles = [
  {
    id: '1',
    name: 'Manager',
    description: 'Full company access',
    isDefault: true
  },
  {
    id: '2',
    name: 'Inventory Manager',
    description: 'Stock & warehouse only',
    isDefault: true
  },
  {
    id: '3',
    name: 'Sales Manager',
    description: 'POS, daily sales only',
    isDefault: true
  },
  {
    id: '4',
    name: 'Accountant',
    description: 'Custom role with accounting permissions',
    isDefault: false
  },
];

const RoleManagement = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [roles, setRoles] = useState(mockRoles);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEditRole = (role: any) => {
    setEditingRole(role);
    setIsDialogOpen(true);
  };

  const handleAddRole = () => {
    setEditingRole(null);
    setIsDialogOpen(true);
  };

  const handleSaveRole = (values: any) => {
    if (editingRole) {
      // Update existing role
      setRoles(roles.map(role => role.id === editingRole.id ? { ...role, ...values } : role));
      toast({
        title: 'Role updated',
        description: `Role "${values.name}" has been updated successfully.`
      });
    } else {
      // Add new role
      const newRole = {
        id: Math.random().toString(36).substring(7),
        ...values,
        isDefault: false
      };
      setRoles([...roles, newRole]);
      toast({
        title: 'Role created',
        description: `Role "${values.name}" has been created successfully.`
      });
    }
    setIsDialogOpen(false);
  };

  const handleDeleteRole = (id: string) => {
    const role = roles.find(r => r.id === id);
    if (role?.isDefault) {
      toast({
        title: 'Cannot delete default role',
        description: 'Default system roles cannot be deleted.',
        variant: 'destructive'
      });
      return;
    }
    
    setRoles(roles.filter(role => role.id !== id));
    toast({
      title: 'Role deleted',
      description: 'The role has been deleted successfully.'
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Role Management</h1>
            <p className="text-muted-foreground">
              Create and manage custom roles with tailored permissions
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
            <Button size="sm" onClick={handleAddRole}>
              <Plus className="mr-2 h-4 w-4" /> Add Custom Role
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search roles..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Roles</CardTitle>
            <CardDescription>
              {filteredRoles.length} role{filteredRoles.length !== 1 ? 's' : ''} available
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-4">
                <p>Loading roles...</p>
              </div>
            ) : filteredRoles.length > 0 ? (
              <div className="grid gap-4">
                {filteredRoles.map((role) => (
                  <div key={role.id} className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{role.name}</h3>
                        {role.isDefault && (
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditRole(role)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      {!role.isDefault && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 border-red-200 hover:bg-red-50"
                          onClick={() => handleDeleteRole(role.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4">
                <p>No roles found matching your search.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRole ? 'Edit Role' : 'Create New Role'}</DialogTitle>
          </DialogHeader>
          
          <RolePermissionsForm
            onSubmit={handleSaveRole}
            initialData={editingRole ? {
              name: editingRole.name,
              description: editingRole.description,
              // In a real app, we would load the actual permissions from the database
            } : undefined}
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default RoleManagement;
