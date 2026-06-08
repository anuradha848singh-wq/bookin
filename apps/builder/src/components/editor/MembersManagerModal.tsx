"use client";

import React, { useState, useEffect } from "react";
import { X, Users, Lock, Shield, UserX, Loader2, Search } from "lucide-react";

interface MembersManagerModalProps {
  onClose: () => void;
  websiteId: string;
}

interface SiteMember {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export const MembersManagerModal = ({ onClose, websiteId }: MembersManagerModalProps) => {
  const [activeTab, setActiveTab] = useState<"members" | "pages">("members");
  const [members, setMembers] = useState<SiteMember[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [websiteId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // In a real app, we'd have dedicated APIs for fetching members and pages for this modal
      // For now, we simulate fetching since we haven't built the GET /members API yet.
      // We will build a simple fetcher inline.
      const res = await fetch(`/api/studio/auth/site/members?websiteId=${websiteId}`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
        setPages(data.pages || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePageRestriction = async (pageId: string, isMemberOnly: boolean) => {
    try {
      setPages(pages.map(p => p.id === pageId ? { ...p, isMemberOnly } : p));
      await fetch(`/api/studio/pages/${pageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isMemberOnly })
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 font-sans">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 text-white rounded shadow-sm flex items-center justify-center">
              <Users size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">Members & Auth</h2>
              <p className="text-xs text-gray-500">Manage site members and page restrictions</p>
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
          <div className="w-56 bg-gray-50 border-r border-gray-200 flex flex-col py-4 gap-1">
            <button 
              onClick={() => setActiveTab("members")}
              className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors ${activeTab === "members" ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Users size={18} className={activeTab === "members" ? "text-indigo-600" : "text-gray-400"} /> Site Members
            </button>
            <button 
              onClick={() => setActiveTab("pages")}
              className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors ${activeTab === "pages" ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Lock size={18} className={activeTab === "pages" ? "text-indigo-600" : "text-gray-400"} /> Page Access
            </button>
          </div>

          <div className="flex-1 flex flex-col bg-white overflow-auto p-8">
            {activeTab === "members" && (
              <div className="max-w-4xl w-full mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Registered Members</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="text" placeholder="Search members..." className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">User</th>
                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Joined</th>
                        <th className="px-6 py-3 w-16"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr><td colSpan={4} className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-gray-400" /></td></tr>
                      ) : members.length === 0 ? (
                        <tr><td colSpan={4} className="p-12 text-center text-gray-500">No members have registered yet.</td></tr>
                      ) : (
                        members.map(m => (
                          <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                                {m.name ? m.name.charAt(0).toUpperCase() : m.email.charAt(0).toUpperCase()}
                              </div>
                              {m.name || "Anonymous"}
                            </td>
                            <td className="px-6 py-4 text-gray-600">{m.email}</td>
                            <td className="px-6 py-4 text-gray-600">{new Date(m.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-right">
                              <button className="text-gray-400 hover:text-red-600" title="Revoke Access"><UserX size={16} /></button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "pages" && (
              <div className="max-w-3xl w-full mx-auto">
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Shield className="text-indigo-600" /> Page Access Restrictions
                </h3>
                <p className="text-gray-500 text-sm mb-8">Select which pages require visitors to be logged in to view them. If a guest tries to access a restricted page, they will be redirected to the home page or a login form.</p>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  {isLoading ? (
                    <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-gray-400" /></div>
                  ) : pages.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No pages found.</div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {pages.map(page => (
                        <div key={page.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                          <div>
                            <div className="font-bold text-gray-900">{page.name}</div>
                            <div className="text-sm text-gray-500 font-mono">{page.slug}</div>
                          </div>
                          
                          <label className="flex items-center cursor-pointer">
                            <div className="relative">
                              <input 
                                type="checkbox" 
                                className="sr-only" 
                                checked={page.isMemberOnly} 
                                onChange={(e) => togglePageRestriction(page.id, e.target.checked)}
                              />
                              <div className={`block w-10 h-6 rounded-full transition-colors ${page.isMemberOnly ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
                              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${page.isMemberOnly ? 'transform translate-x-4' : ''}`}></div>
                            </div>
                            <span className="ml-3 text-sm font-medium text-gray-700 w-24">
                              {page.isMemberOnly ? "Members Only" : "Public"}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
