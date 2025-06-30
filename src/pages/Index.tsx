import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { CollectionGrid } from "@/components/CollectionGrid";
import { AddItemForm } from "@/components/AddItemForm";
import { StatsCard } from "@/components/StatsCard";
import { FilterBar } from "@/components/FilterBar";
import { Plus, BarChart3, Grid3X3, AlertCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PopMartItem } from "@/types/collection";
import { supabaseApi } from "@/services/supabaseApi";

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<PopMartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [filter, setFilter] = useState("All");
  const { toast } = useToast();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Load collection data when user is authenticated
  useEffect(() => {
    if (user) {
      loadCollection();
    }
  }, [user]);

  const loadCollection = async () => {
    try {
      setLoading(true);
      setError(null);
      const collection = await supabaseApi.getCollection();
      setItems(collection);
    } catch (err) {
      setError('Failed to load collection. Please try again.');
      console.error('Error loading collection:', err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (newItem: Omit<PopMartItem, "id" | "userId" | "dateAdded" | "createdAt" | "updatedAt">) => {
    try {
      const item = await supabaseApi.addItem(newItem);
      setItems([item, ...items]);
      setShowAddForm(false);
      toast({
        title: "Item Added!",
        description: `${item.character} - ${item.item} has been added to your collection.`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive",
      });
      console.error('Error adding item:', err);
    }
  };

  const updateItem = async (id: string, updatedItem: Partial<PopMartItem>) => {
    try {
      await supabaseApi.updateItem(id, updatedItem);
      setItems(items.map(item => 
        item.id === id ? { ...item, ...updatedItem } : item
      ));
      toast({
        title: "Item Updated!",
        description: "Your item has been successfully updated.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update item. Please try again.",
        variant: "destructive",
      });
      console.error('Error updating item:', err);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await supabaseApi.deleteItem(id);
      setItems(items.filter(item => item.id !== id));
      toast({
        title: "Item Deleted",
        description: "The item has been removed from your collection.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      });
      console.error('Error deleting item:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredItems = items.filter(item => {
    return filter === "All" || item.status === filter;
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your collection...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Collection</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button 
            onClick={loadCollection}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Pop Mart Collection
            </h1>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut size={16} />
              Sign Out
            </Button>
          </div>
          <p className="text-gray-600">Track your adorable collectibles</p>
          {user.email && (
            <p className="text-sm text-gray-500 mt-1">Welcome back, {user.email}!</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <Plus className="mr-2" size={20} />
            Add New Item
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => setShowStats(!showStats)}
            className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <BarChart3 className="mr-2" size={20} />
            {showStats ? "Hide Stats" : "Show Stats"}
          </Button>
        </div>

        {/* Stats Section */}
        {showStats && (
          <div className="mb-8">
            <StatsCard items={items} />
          </div>
        )}

        {/* Filter Bar */}
        <FilterBar 
          filter={filter}
          setFilter={setFilter}
          items={items}
        />

        {/* Collection Grid */}
        <CollectionGrid 
          items={filteredItems} 
          onUpdateItem={updateItem}
          onDeleteItem={deleteItem}
        />

        {/* Add Item Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <AddItemForm 
                onSubmit={addItem}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <Grid3X3 className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No items found</h3>
            <p className="text-gray-500">
              {filter === "All" ? "Start building your collection!" : `No items with status "${filter}"`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
