import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ItemGroup } from '@/types/inventory';
import ItemGroupFormDialog from '@/components/inventory/item-groups/ItemGroupFormDialog';
import ItemGroupSearch from '@/components/inventory/item-groups/ItemGroupSearch';
import ItemGroupList from '@/components/inventory/item-groups/ItemGroupList';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useItemGroups } from '@/hooks/inventory/useItemGroups';
import { useItemGroupFiltering } from '@/hooks/inventory/useItemGroupFiltering';

const ItemGroups = () => {
  const { 
    itemGroups, 
    loading, 
    error, 
    addItemGroup, 
    updateItemGroup, 
    deleteItemGroup 
  } = useItemGroups();
  
  const { searchTerm, setSearchTerm, filteredGroups } = useItemGroupFiltering(itemGroups);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ItemGroup | null>(null);

  const handleSubmit = async (values: any) => {
    const timestamp = new Date().toISOString();
    
    if (editingGroup) {
      const updatedGroup = { 
        ...editingGroup,
        name: values.name, 
        description: values.description,
        parentId: values.parentId,
        updatedAt: timestamp
      };
      updateItemGroup(updatedGroup);
    } else {
      const newGroup: ItemGroup = {
        id: Math.random().toString(36).substring(7),
        name: values.name,
        description: values.description,
        parentId: values.parentId,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      addItemGroup(newGroup);
    }
    
    setIsDialogOpen(false);
    setEditingGroup(null);
  };

  const handleEdit = (group: ItemGroup) => {
    setEditingGroup(group);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteItemGroup(id);
  };

  const handleAddGroup = () => {
    setEditingGroup(null);
    setIsDialogOpen(true);
  };

  const getParentGroupName = (parentId?: string) => {
    if (!parentId) return null;
    const parent = itemGroups.find(group => group.id === parentId);
    return parent ? parent.name : null;
  };

  if (error) {
    return (
      <Layout>
        <div className="space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Item Groups</h1>
            <p className="text-muted-foreground">
              Manage categories for your inventory items
            </p>
          </div>
          
          <Button onClick={handleAddGroup} size="sm">
            <Plus className="mr-2 h-4 w-4" /> Add Group
          </Button>
        </div>

        <ErrorBoundary>
          <div className="flex justify-between items-center">
            <ItemGroupSearch 
              searchTerm={searchTerm}
              onSearch={setSearchTerm}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Item Groups</CardTitle>
              <CardDescription>
                {filteredGroups.length} item {filteredGroups.length === 1 ? 'group' : 'groups'} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ItemGroupList
                groups={filteredGroups}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={handleAddGroup}
                getParentGroupName={getParentGroupName}
              />
            </CardContent>
          </Card>
        </ErrorBoundary>

        <ItemGroupFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleSubmit}
          itemGroups={itemGroups}
          editingGroup={editingGroup}
        />
      </div>
    </Layout>
  );
};

export default ItemGroups;
