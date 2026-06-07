"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ZapIcon, ArrowLeftIcon, SaveIcon, PlusIcon, BellIcon, MailIcon, TagIcon, TrashIcon } from "lucide-react";

export default function NewAutomationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState("");
  const [actions, setActions] = useState<any[]>([]);

  const addAction = (type: string) => {
    setActions([...actions, { id: Date.now(), type, config: {} }]);
  };

  const removeAction = (id: number) => {
    setActions(actions.filter(a => a.id !== id));
  };

  const handleSubmit = async () => {
    if (!name || !trigger || actions.length === 0) {
      alert("Please provide a name, select a trigger, and add at least one action.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        trigger_event: trigger,
        conditions: [], // Skipping complex UI logic for conditions in this demo
        actions: actions.map(a => {
          if (a.type === 'email.send') return { type: 'email.send', template_id: 'standard_notification', to: 'customer' };
          if (a.type === 'tag.add') return { type: 'tag.add', tag_name: 'automated' };
          return a;
        })
      };

      const res = await fetch("/api/v1/automations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        router.push("/dashboard/automations");
      } else {
        alert("Failed to save automation");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col space-y-6 p-8 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex items-center justify-between max-w-3xl mx-auto w-full">
        <div className="flex items-center space-x-4">
          <Link href="/automations" className="p-2 bg-white rounded-full border text-gray-500 hover:text-black shadow-sm">
            <ArrowLeftIcon className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Build Workflow</h1>
            <p className="text-sm text-gray-500 mt-1">Design automated rules for your clinic.</p>
          </div>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="inline-flex items-center text-sm font-medium bg-black text-white hover:bg-gray-800 px-5 py-2.5 rounded-lg shadow-sm"
        >
          <SaveIcon className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Turn On Automation"}
        </button>
      </div>

      <div className="max-w-3xl mx-auto w-full space-y-8 pb-12">
        
        {/* Name Input */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <label className="block text-sm font-bold text-gray-900 mb-2">Automation Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border text-lg font-medium" 
            placeholder="e.g. Welcome Series for New Patients" 
          />
        </div>

        {/* 1. Trigger Block */}
        <div className="relative">
          <div className="absolute left-6 top-full h-8 w-0.5 bg-gray-300 -z-10"></div>
          <div className="bg-white p-6 rounded-xl border-2 border-blue-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
            
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center mr-3 font-bold">1</div>
              <h2 className="text-lg font-bold text-gray-900">When this happens... (Trigger)</h2>
            </div>
            
            <select 
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border font-medium bg-gray-50"
            >
              <option value="">Select a triggering event</option>
              <option value="booking.created">Booking is Created</option>
              <option value="booking.cancelled">Booking is Cancelled</option>
              <option value="form.submitted">Intake Form is Submitted</option>
              <option value="order.placed">E-Commerce Order is Placed</option>
            </select>
          </div>
        </div>

        {/* 2. Actions List */}
        <div className="space-y-4 pt-4">
          {actions.map((action, idx) => (
            <div key={action.id} className="relative">
              <div className="absolute left-6 top-full h-8 w-0.5 bg-gray-300 -z-10"></div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded bg-gray-100 text-gray-600 flex items-center justify-center mr-3 font-bold">{idx + 2}</div>
                    <h2 className="text-lg font-bold text-gray-900">Do this... (Action)</h2>
                  </div>
                  <button onClick={() => removeAction(action.id)} className="text-gray-400 hover:text-red-500">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="ml-11 flex items-center space-x-3 p-3 bg-gray-50 border rounded-lg">
                  {action.type === 'email.send' && <MailIcon className="w-5 h-5 text-blue-500" />}
                  {action.type === 'tag.add' && <TagIcon className="w-5 h-5 text-purple-500" />}
                  <span className="font-medium text-gray-700">
                    {action.type === 'email.send' ? 'Send an Email Notification' : 'Add CRM Tag to Customer'}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Add Action Button */}
          <div className="pl-6 pt-4">
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center space-y-4">
              <p className="text-sm font-medium text-gray-500">Add a step to your workflow</p>
              <div className="flex space-x-3">
                <button 
                  onClick={() => addAction('email.send')}
                  className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-semibold transition-colors"
                >
                  <MailIcon className="w-4 h-4 mr-2" /> Send Email
                </button>
                <button 
                  onClick={() => addAction('tag.add')}
                  className="flex items-center px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-sm font-semibold transition-colors"
                >
                  <TagIcon className="w-4 h-4 mr-2" /> Add Tag
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
