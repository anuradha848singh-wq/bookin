"use client";

import React, { useState, useEffect } from "react";
import { X, Database, Plus, Table2, LayoutList, Check, Trash2, Edit2, Loader2, Type, Image as ImageIcon, ToggleLeft, Hash } from "lucide-react";

interface CMSManagerModalProps {
  onClose: () => void;
  websiteId: string;
}

type FieldType = "text" | "number" | "image" | "boolean" | "richtext";

interface FieldDef {
  name: string;
  type: FieldType;
}

interface Collection {
  id: string;
  name: string;
  slug: string;
  fields: FieldDef[];
  _count?: { items: number };
}

interface CollectionItem {
  id: string;
  data: Record<string, any>;
  isPublished: boolean;
}

export const CMSManagerModal = ({ onClose, websiteId }: CMSManagerModalProps) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Create Collection State
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [newColName, setNewColName] = useState("");
  const [newColFields, setNewColFields] = useState<FieldDef[]>([{ name: "Title", type: "text" }]);
  
  // Create Item State
  const [isCreatingItem, setIsCreatingItem] = useState(false);
  const [newItemData, setNewItemData] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchCollections();
  }, [websiteId]);

  useEffect(() => {
    if (selectedCollection) {
      fetchItems(selectedCollection.id);
    }
  }, [selectedCollection]);

  const fetchCollections = async () => {
    try {
      const res = await fetch(`/api/studio/cms/collections?websiteId=${websiteId}`);
      if (res.ok) {
        const data = await res.json();
        setCollections(data.collections);
        if (data.collections.length > 0 && !selectedCollection) {
          setSelectedCollection(data.collections[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchItems = async (collectionId: string) => {
    try {
      const res = await fetch(`/api/studio/cms/collections/${collectionId}/items`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateCollection = async () => {
    if (!newColName) return;
    const slug = newColName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    try {
      const res = await fetch("/api/studio/cms/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteId, name: newColName, slug, fields: newColFields })
      });
      if (res.ok) {
        setIsCreatingCollection(false);
        setNewColName("");
        setNewColFields([{ name: "Title", type: "text" }]);
        fetchCollections();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateItem = async () => {
    if (!selectedCollection) return;
    
    try {
      const res = await fetch(`/api/studio/cms/collections/${selectedCollection.id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: newItemData, isPublished: true })
      });
      if (res.ok) {
        setIsCreatingItem(false);
        setNewItemData({});
        fetchItems(selectedCollection.id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getFieldIcon = (type: string) => {
    switch (type) {
      case 'text': return <Type size={14} className="text-blue-500" />;
      case 'number': return <Hash size={14} className="text-orange-500" />;
      case 'image': return <ImageIcon size={14} className="text-purple-500" />;
      case 'boolean': return <ToggleLeft size={14} className="text-green-500" />;
      case 'richtext': return <LayoutList size={14} className="text-pink-500" />;
      default: return <Type size={14} />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 font-sans">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 text-white rounded shadow-sm flex items-center justify-center">
              <Database size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">Content Manager (CMS)</h2>
              <p className="text-xs text-gray-500">Manage dynamic database collections</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <button 
                onClick={() => setIsCreatingCollection(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
              >
                <Plus size={16} /> New Collection
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-2">
              <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Collections</div>
              {isLoading ? (
                <div className="flex justify-center py-4"><Loader2 className="animate-spin text-gray-400" /></div>
              ) : collections.length === 0 ? (
                <div className="px-4 py-2 text-sm text-gray-500 italic">No collections yet.</div>
              ) : (
                collections.map(col => (
                  <button
                    key={col.id}
                    onClick={() => setSelectedCollection(col)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${selectedCollection?.id === col.id ? 'bg-indigo-50 text-indigo-700 font-semibold border-r-2 border-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <div className="flex items-center gap-2">
                      <Table2 size={16} className={selectedCollection?.id === col.id ? "text-indigo-600" : "text-gray-400"} />
                      {col.name}
                    </div>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-gray-200 text-gray-500">{col._count?.items || items.length}</span>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-white">
            {isCreatingCollection ? (
              <div className="p-8 max-w-2xl mx-auto w-full">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Create New Collection</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Collection Name</label>
                    <input 
                      type="text" 
                      value={newColName}
                      onChange={e => setNewColName(e.target.value)}
                      placeholder="e.g. Blog Posts, Team Members, Services"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Schema Fields</label>
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                      {newColFields.map((field, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 border-b border-gray-200 bg-white">
                          <input 
                            type="text" 
                            value={field.name}
                            onChange={(e) => {
                              const f = [...newColFields];
                              f[idx].name = e.target.value;
                              setNewColFields(f);
                            }}
                            className="flex-1 border border-gray-200 rounded px-3 py-1.5 text-sm outline-none focus:border-indigo-500"
                            placeholder="Field Name (e.g. Title)"
                          />
                          <select 
                            value={field.type}
                            onChange={(e) => {
                              const f = [...newColFields];
                              f[idx].type = e.target.value as FieldType;
                              setNewColFields(f);
                            }}
                            className="w-40 border border-gray-200 rounded px-3 py-1.5 text-sm bg-gray-50 outline-none focus:border-indigo-500"
                          >
                            <option value="text">Text (Short)</option>
                            <option value="richtext">Rich Text (Long)</option>
                            <option value="image">Image URL</option>
                            <option value="number">Number</option>
                            <option value="boolean">Boolean</option>
                          </select>
                          <button 
                            onClick={() => setNewColFields(newColFields.filter((_, i) => i !== idx))}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      <div className="p-3 bg-gray-50">
                        <button 
                          onClick={() => setNewColFields([...newColFields, { name: "", type: "text" }])}
                          className="text-sm text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1"
                        >
                          <Plus size={14} /> Add Field
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button 
                      onClick={handleCreateCollection}
                      disabled={!newColName || newColFields.length === 0}
                      className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                      Create Collection
                    </button>
                    <button 
                      onClick={() => setIsCreatingCollection(false)}
                      className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : selectedCollection ? (
              <div className="flex flex-col h-full">
                <div className="px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">{selectedCollection.name}</h3>
                  <button 
                    onClick={() => setIsCreatingItem(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded shadow-sm transition-colors"
                  >
                    <Plus size={16} /> Add Item
                  </button>
                </div>
                
                {isCreatingItem && (
                  <div className="p-6 bg-indigo-50 border-b border-indigo-100">
                    <h4 className="font-bold text-indigo-900 mb-4">New Item</h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {selectedCollection.fields.map((field, i) => (
                        <div key={i}>
                          <label className="block text-xs font-semibold text-indigo-900 mb-1 flex items-center gap-1">
                            {getFieldIcon(field.type)} {field.name}
                          </label>
                          {field.type === 'boolean' ? (
                            <select 
                              className="w-full border border-indigo-200 rounded px-3 py-2 text-sm outline-none focus:border-indigo-500"
                              onChange={(e) => setNewItemData({...newItemData, [field.name]: e.target.value === 'true'})}
                            >
                              <option value="true">True</option>
                              <option value="false">False</option>
                            </select>
                          ) : field.type === 'richtext' ? (
                            <textarea 
                              className="w-full border border-indigo-200 rounded px-3 py-2 text-sm outline-none focus:border-indigo-500 h-24"
                              onChange={(e) => setNewItemData({...newItemData, [field.name]: e.target.value})}
                              placeholder={`Enter ${field.name}...`}
                            />
                          ) : (
                            <input 
                              type={field.type === 'number' ? 'number' : 'text'}
                              className="w-full border border-indigo-200 rounded px-3 py-2 text-sm outline-none focus:border-indigo-500"
                              onChange={(e) => setNewItemData({...newItemData, [field.name]: field.type === 'number' ? Number(e.target.value) : e.target.value})}
                              placeholder={`Enter ${field.name}...`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleCreateItem} className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-bold rounded">Save Item</button>
                      <button onClick={() => setIsCreatingItem(false)} className="px-4 py-1.5 bg-white border border-indigo-200 text-indigo-900 text-sm font-bold rounded">Cancel</button>
                    </div>
                  </div>
                )}

                <div className="flex-1 overflow-auto bg-gray-50/50 p-6">
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          {selectedCollection.fields.map((field, i) => (
                            <th key={i} className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                              {getFieldIcon(field.type)} {field.name}
                            </th>
                          ))}
                          <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Status</th>
                          <th className="px-4 py-3 w-16"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.length === 0 ? (
                          <tr>
                            <td colSpan={selectedCollection.fields.length + 2} className="px-4 py-12 text-center text-gray-500">
                              No items found. Click "Add Item" to create one.
                            </td>
                          </tr>
                        ) : (
                          items.map(item => (
                            <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                              {selectedCollection.fields.map((field, i) => (
                                <td key={i} className="px-4 py-3 text-sm text-gray-800">
                                  {field.type === 'image' ? (
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 bg-gray-200 rounded overflow-hidden">
                                        {item.data[field.name] && <img src={item.data[field.name]} alt="" className="w-full h-full object-cover" />}
                                      </div>
                                      <span className="truncate max-w-[150px]">{item.data[field.name] || '-'}</span>
                                    </div>
                                  ) : field.type === 'boolean' ? (
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.data[field.name] ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                      {item.data[field.name] ? 'Yes' : 'No'}
                                    </span>
                                  ) : (
                                    <div className="truncate max-w-[200px]">{String(item.data[field.name] || '-')}</div>
                                  )}
                                </td>
                              ))}
                              <td className="px-4 py-3 text-right">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${item.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                  <div className={`w-1.5 h-1.5 rounded-full ${item.isPublished ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                  {item.isPublished ? 'Live' : 'Draft'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"><Edit2 size={14} /></button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                  <Database size={32} className="text-indigo-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Select a Collection</h3>
                <p className="text-gray-500 max-w-sm mb-6">Choose a collection from the sidebar to view and manage its content, or create a new one.</p>
                <button 
                  onClick={() => setIsCreatingCollection(true)}
                  className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
                >
                  Create Collection
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
