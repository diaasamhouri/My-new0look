import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface AddWishlistItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: any) => Promise<any>;
}

export const AddWishlistItemModal = ({ isOpen, onClose, onSubmit }: AddWishlistItemModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    item_name: '',
    brand: '',
    price: '',
    url: '',
    image_url: '',
    category: '',
    priority: 3,
    is_adaptive_clothing: false,
    notes: ''
  });

  const categories = [
    { value: 'tops', label: 'Tops' },
    { value: 'bottoms', label: 'Bottoms' },
    { value: 'shoes', label: 'Shoes' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'outerwear', label: 'Outerwear' },
    { value: 'undergarments', label: 'Undergarments' },
    { value: 'other', label: 'Other' }
  ];

  const priorities = [
    { value: 1, label: 'Low Priority' },
    { value: 2, label: 'Low Priority' },
    { value: 3, label: 'Medium Priority' },
    { value: 4, label: 'High Priority' },
    { value: 5, label: 'Must Have' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.item_name) {
      toast({
        title: "Item Name Required",
        description: "Please provide a name for the item.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const itemData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : undefined
      };

      await onSubmit(itemData);
      toast({
        title: "Item Added",
        description: "Item has been added to your wishlist.",
      });
      
      onClose();
      setFormData({
        item_name: '',
        brand: '',
        price: '',
        url: '',
        image_url: '',
        category: '',
        priority: 3,
        is_adaptive_clothing: false,
        notes: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to wishlist.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Wishlist Item</DialogTitle>
          <DialogDescription>
            Add a new item to your shopping wishlist
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="item_name">Item Name *</Label>
            <Input
              id="item_name"
              value={formData.item_name}
              onChange={(e) => setFormData(prev => ({ ...prev, item_name: e.target.value }))}
              placeholder="e.g., Adaptive Blue Jeans"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                placeholder="e.g., Tommy Adaptive"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority Level</Label>
            <Select 
              value={formData.priority.toString()} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, priority: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value.toString()}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Product URL</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://example.com/product"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional notes about this item..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="adaptive"
              checked={formData.is_adaptive_clothing}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_adaptive_clothing: checked }))}
            />
            <Label htmlFor="adaptive" className="text-sm">
              This is adaptive clothing designed for accessibility
            </Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-healing-purple hover:bg-healing-purple/90"
            >
              {loading ? 'Adding...' : 'Add to Wishlist'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};