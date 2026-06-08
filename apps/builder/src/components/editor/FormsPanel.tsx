"use client";

import React from "react";
import { FormInput, Mail, Phone, MessageSquare, CheckSquare, Calendar, User } from "lucide-react";

export const FormsPanel = () => {
  
  const formElements = [
    { id: "text", icon: <FormInput size={16} />, label: "Text Input", color: "text-blue-500" },
    { id: "email", icon: <Mail size={16} />, label: "Email", color: "text-purple-500" },
    { id: "phone", icon: <Phone size={16} />, label: "Phone", color: "text-green-500" },
    { id: "textarea", icon: <MessageSquare size={16} />, label: "Text Area", color: "text-orange-500" },
    { id: "checkbox", icon: <CheckSquare size={16} />, label: "Checkbox", color: "text-pink-500" },
    { id: "date", icon: <Calendar size={16} />, label: "Date Picker", color: "text-teal-500" },
  ];

  const formTemplates = [
    { id: 1, name: "Contact Form", fields: 4, icon: <Mail size={14} /> },
    { id: 2, name: "Lead Capture", fields: 5, icon: <User size={14} /> },
    { id: 3, name: "Booking Request", fields: 6, icon: <Calendar size={14} /> },
    { id: 4, name: "Newsletter", fields: 2, icon: <MessageSquare size={14} /> },
  ];

  return (
    <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-6">
      
      {/* Form Elements */}
      <div>
        <h4 className="text-[11px] font-medium text-gray-400 mb-3 px-1">FORM ELEMENTS</h4>
        <div className="flex flex-col gap-2">
          {formElements.map((element) => (
            <div 
              key={element.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E5E5] bg-white hover:border-black cursor-grab transition-all group"
            >
              <div className={`${element.color}`}>
                {element.icon}
              </div>
              <span className="text-[12px] font-medium text-gray-800">{element.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Templates */}
      <div>
        <h4 className="text-[11px] font-medium text-gray-400 mb-3 px-1">FORM TEMPLATES</h4>
        <div className="flex flex-col gap-2">
          {formTemplates.map((template) => (
            <div 
              key={template.id}
              className="flex items-center justify-between p-3 rounded-lg border border-[#E5E5E5] bg-white hover:border-[#0066FF] hover:shadow-sm cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-blue-50 text-[#0066FF] flex items-center justify-center">
                  {template.icon}
                </div>
                <div>
                  <p className="text-[12px] font-medium text-gray-900">{template.name}</p>
                  <p className="text-[10px] text-gray-400">{template.fields} fields</p>
                </div>
              </div>
              <button className="text-[10px] font-medium text-[#0066FF] opacity-0 group-hover:opacity-100 transition-opacity">
                Use
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Form Settings */}
      <div>
        <h4 className="text-[11px] font-medium text-gray-400 mb-3 px-1">FORM SETTINGS</h4>
        <div className="flex flex-col gap-3 p-3 bg-[#FAFAFA] rounded-lg border border-[#E5E5E5]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-700">Submit to CRM</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066FF]"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-700">Email Notification</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066FF]"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-700">CAPTCHA</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066FF]"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
