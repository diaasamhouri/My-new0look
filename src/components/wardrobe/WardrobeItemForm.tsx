import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface WardrobeItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: any) => Promise<any>;
}

export const WardrobeItemForm = ({ isOpen, onClose, onSubmit }: WardrobeItemFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    color: '',
    brand: '',
    care_instructions: '',
    is_adaptive_clothing: false,
    tags: ''
  });

  const categories = [
    { value: 'tops', label: 'Tops' },
    { value: 'bottoms', label: 'Bottoms' },
    { value: 'shoes', label: 'Shoes' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'outerwear', label: 'Outerwear' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in the item name and category.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const itemData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        wear_count: 0
      };

      await onSubmit(itemData);
      toast({
        title: "Item Added",
        description: "Your wardrobe item has been added successfully.",
      });
      onClose();
      setFormData({
        name: '',
        category: '',
        color: '',
        brand: '',
        care_instructions: '',
        is_adaptive_clothing: false,
        tags: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to wardrobe.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Wardrobe Item</DialogTitle>
          <DialogDescription>
            Add a new item to your virtual wardrobe
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Blue Cotton T-Shirt"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              required
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                placeholder="e.g., Navy Blue"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                placeholder="e.g., Nike"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="e.g., casual, summer, comfortable"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="care">Care Instructions</Label>
            <Textarea
              id="care"
              value={formData.care_instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, care_instructions: e.target.value }))}
              placeholder="e.g., Machine wash cold, tumble dry low"
              rows={2}
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
              {loading ? 'Adding...' : 'Add Item'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};