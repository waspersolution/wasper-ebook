
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ChevronRight } from 'lucide-react';
import { ItemGroup } from '@/types/inventory';

interface ItemGroupListItemProps {
  group: ItemGroup;
  parentGroupName: string | null;
  onEdit: (group: ItemGroup) => void;
  onDelete: (id: string) => void;
}

const ItemGroupListItem: React.FC<ItemGroupListItemProps> = ({
  group,
  parentGroupName,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors">
      <div>
        <p className="font-medium">{group.name}</p>
        {group.description && (
          <p className="text-sm text-muted-foreground">{group.description}</p>
        )}
        {parentGroupName && (
          <div className="text-xs text-muted-foreground flex items-center mt-1">
            <span>Parent: {parentGroupName}</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => onEdit(group)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-red-500"
          onClick={() => onDelete(group.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ItemGroupListItem;
