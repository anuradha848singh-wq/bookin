"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { useQuery } from "@tanstack/react-query";
import { Text } from "./Text";
import { Container } from "./Container";
import { Clock, IndianRupee, Plus, Trash2, Sparkles } from "lucide-react";

interface CustomServiceType {
  title: string;
  desc: string;
  price: number;
  duration: string;
  image: string;
}

interface ServiceShowcaseProps {
  backgroundColor?: string;
  useDynamicServices?: boolean;
  customServices?: CustomServiceType[];
}

export const ServiceShowcaseSettings = () => {
  const { 
    actions: { setProp }, 
    backgroundColor,
    useDynamicServices,
    customServices
  } = useNode((node) => ({
    backgroundColor: node.data.props.backgroundColor,
    useDynamicServices: node.data.props.useDynamicServices,
    customServices: node.data.props.customServices,
  }));

  const inputClass = "w-full text-xs bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-gray-800 font-medium";
  const labelClass = "text-[10px] font-bold text-gray-400 uppercase tracking-wider";

  const handleServiceChange = (index: number, field: keyof CustomServiceType, value: any) => {
    setProp((p: ServiceShowcaseProps) => {
      const newServices = [...(p.customServices || [])];
      newServices[index] = { ...newServices[index], [field]: value };
      p.customServices = newServices;
    });
  };

  const handleAddService = () => {
    setProp((p: ServiceShowcaseProps) => {
      const newServices = [...(p.customServices || [])];
      newServices.push({
        title: "New Treatment",
        desc: "Description of the clinical treatment or medical examination.",
        price: 500,
        duration: "30 min",
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=400"
      });
      p.customServices = newServices;
    });
  };

  const handleRemoveService = (index: number) => {
    setProp((p: ServiceShowcaseProps) => {
      const newServices = [...(p.customServices || [])];
      newServices.splice(index, 1);
      p.customServices = newServices;
    });
  };

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Background Styling */}
      <div className="flex flex-col gap-3 border-b border-gray-100 pb-4">
        <h4 className="text-xs font-bold text-gray-700">Section Style</h4>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Background Color</label>
          <div className="flex items-center border border-gray-200 bg-gray-50 rounded overflow-hidden h-8">
            <div className="px-2 text-[10px] text-gray-400 border-r border-gray-200 font-bold uppercase">Fill</div>
            <input 
              type="color" 
              value={backgroundColor || "#ffffff"} 
              onChange={(e) => setProp((p: ServiceShowcaseProps) => { p.backgroundColor = e.target.value; })} 
              className="w-full h-full cursor-pointer border-none bg-transparent" 
            />
          </div>
        </div>
      </div>

      {/* Data Source Setting */}
      <div className="flex flex-col gap-3 border-b border-gray-100 pb-4">
        <h4 className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
          <Sparkles size={13} className="text-amber-500" /> Data Source
        </h4>
        <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-2.5">
          <span className="text-[11px] font-bold text-gray-600">Use dynamic services from DB</span>
          <button
            onClick={() => setProp((p: ServiceShowcaseProps) => { p.useDynamicServices = !p.useDynamicServices; })}
            className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${useDynamicServices ? 'bg-emerald-500' : 'bg-gray-300'}`}
          >
            <div className={`w-4.5 h-4.5 bg-white rounded-full shadow transform duration-200 ease-in-out ${useDynamicServices ? 'translate-x-4.5' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Custom Services List */}
      {!useDynamicServices && (
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-gray-700">Custom Services</h4>
            <button 
              onClick={handleAddService}
              className="flex items-center gap-1 text-[10px] font-bold text-blue-500 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
            >
              <Plus size={10} strokeWidth={3} /> Add Service
            </button>
          </div>

          <div className="flex flex-col gap-3 max-h-[320px] overflow-y-auto pr-1">
            {(customServices as CustomServiceType[] || []).map((s: CustomServiceType, idx: number) => (
              <div key={idx} className="bg-gray-50 border border-gray-200 p-3 rounded-lg flex flex-col gap-2 relative group">
                <button 
                  onClick={() => handleRemoveService(idx)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete Service"
                >
                  <Trash2 size={12} />
                </button>

                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-teal-50 text-[#115E59] flex items-center justify-center font-bold text-xs shrink-0">
                    {idx + 1}
                  </div>
                  <input 
                    type="text" 
                    value={s.title} 
                    onChange={(e) => handleServiceChange(idx, "title", e.target.value)} 
                    className={`${inputClass} py-1 pr-6 font-bold`}
                    placeholder="Service Title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="flex flex-col gap-1">
                    <label className={labelClass}>Price (INR)</label>
                    <input 
                      type="number" 
                      value={s.price} 
                      onChange={(e) => handleServiceChange(idx, "price", Number(e.target.value) || 0)} 
                      className={inputClass}
                      placeholder="e.g. 500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className={labelClass}>Duration</label>
                    <input 
                      type="text" 
                      value={s.duration} 
                      onChange={(e) => handleServiceChange(idx, "duration", e.target.value)} 
                      className={inputClass}
                      placeholder="e.g. 30 min"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 mt-1">
                  <label className={labelClass}>Image URL</label>
                  <input 
                    type="text" 
                    value={s.image} 
                    onChange={(e) => handleServiceChange(idx, "image", e.target.value)} 
                    className={inputClass}
                    placeholder="Image path or absolute URL..."
                  />
                </div>

                <textarea 
                  value={s.desc} 
                  onChange={(e) => handleServiceChange(idx, "desc", e.target.value)} 
                  className={`${inputClass} min-h-[40px] text-[11px] mt-1`}
                  placeholder="Service description..."
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ServiceItem = ({ title, desc, price, duration, image }: { title: string, desc: string, price: number, duration: string, image: string }) => (
  <div className="flex flex-col md:flex-row gap-6 p-4 rounded-xl border border-transparent hover:border-[#E5E5E5] hover:bg-gray-50 transition-all group cursor-pointer select-none">
    <div className="w-full md:w-48 h-32 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 relative">
      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
    </div>
    <div className="flex-1 flex flex-col justify-center text-left">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="font-semibold text-gray-900 flex items-center shrink-0"><IndianRupee size={14} className="mr-0.5" />{price}</span>
      </div>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">{desc}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="flex items-center text-xs font-medium text-gray-400">
          <Clock size={14} className="mr-1" /> {duration}
        </span>
        <button className="text-sm font-medium text-[#0066FF] hover:text-[#0052CC] opacity-0 group-hover:opacity-100 transition-opacity">
          Book Now →
        </button>
      </div>
    </div>
  </div>
);

export const ServiceShowcase = ({ 
  backgroundColor = "#ffffff",
  useDynamicServices = true,
  customServices = [
    {
      title: "Routine Dental Checkup",
      desc: "Full comprehensive examination, digital X-rays, plaque scaling, and customized treatment planning.",
      price: 600,
      duration: "45 min",
      image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=400"
    },
    {
      title: "Cardiology Screening",
      desc: "Detailed resting ECG, blood pressure monitoring, oxygen saturation testing, and expert cardiac advice.",
      price: 1500,
      duration: "60 min",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400"
    }
  ]
}: ServiceShowcaseProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  const { data: dynamicServices, isLoading: loading } = useQuery({
    queryKey: ['services'],
    enabled: useDynamicServices,
    queryFn: async () => {
      const res = await fetch("/api/dashboard/services");
      const data = await res.json();
      if (!data.success) throw new Error("Failed to fetch services");
      return data.services.map((s: any) => ({
        title: s.name,
        desc: s.description || "Comprehensive clinical service with expert specialists.",
        price: Number(s.price),
        duration: `${s.duration} min`,
        image: s.image_url || "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=400",
      }));
    }
  });

  const services = useDynamicServices && dynamicServices && dynamicServices.length > 0 ? dynamicServices : customServices;

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{ backgroundColor, outline: isSelected ? "2px solid #0066FF" : "none", outlineOffset: "-2px" }}
      className="py-24 px-8 w-full relative"
    >
      <div className="max-w-4xl mx-auto flex flex-col">
        <Element id="service-showcase-header" is={Container} padding={0} background="transparent" canvas>
          <div className="mb-12 text-left">
            <Text text="Our Services" fontSize={36} fontWeight="700" color="#111827" />
            <div className="h-4" />
            <Text text="Select a treatment to book your appointment." fontSize={16} color="#6B7280" />
          </div>
        </Element>
        
        <div className="flex flex-col gap-4">
          {useDynamicServices && loading && !dynamicServices ? (
            <div className="text-gray-400 text-sm py-10 animate-pulse">Loading services...</div>
          ) : services.length === 0 ? (
            <div className="text-gray-400 text-sm py-10">No services found. Add some in the dashboard or configure custom services.</div>
          ) : (
            services.map((service: any, idx: number) => (
              <ServiceItem key={idx} {...service} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

ServiceShowcase.craft = {
  displayName: "Service Showcase",
  props: { 
    backgroundColor: "#ffffff",
    useDynamicServices: true,
    customServices: [
      {
        title: "Routine Dental Checkup",
        desc: "Full comprehensive examination, digital X-rays, plaque scaling, and customized treatment planning.",
        price: 600,
        duration: "45 min",
        image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=400"
      },
      {
        title: "Cardiology Screening",
        desc: "Detailed resting ECG, blood pressure monitoring, oxygen saturation testing, and expert cardiac advice.",
        price: 1500,
        duration: "60 min",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400"
      }
    ]
  },
  rules: { canDrag: () => true },
  related: { settings: ServiceShowcaseSettings },
};
