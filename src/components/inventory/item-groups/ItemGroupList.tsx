
import React from 'react';
import { ItemGroup } from '@/types/inventory';
import ItemGroupListItem from './ItemGroupListItem';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { Skeleton } from '@/components/ui/skeleton';

interface ItemGroupListProps {
  groups: ItemGroup[];
  loading: boolean;
  onEdit: (group: ItemGroup) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  getParentGroupName: (parentId?: string) => string | null;
}

const ItemGroupList: React.FC<ItemGroupListProps> = ({
  groups,
  loading,
  onEdit,
  onDelete,
  onAdd,
  getParentGroupName
}) => {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[72px] w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="text-center p-8">
        <p>No item groups found matching your search.</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={onAdd}
        >
          <Plus className="mr-2 h-4 w-4" /> Create your first item group
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {groups.map((group) => (
        <ErrorBoundary key={group.id}>
          <ItemGroupListItem
            group={group}
            parentGroupName={getParentGroupName(group.parentId)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </ErrorBoundary>
      ))}
    </div>
  );
};

export default ItemGroupList;
