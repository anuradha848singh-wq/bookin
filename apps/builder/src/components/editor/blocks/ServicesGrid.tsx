"use client";

import React from "react";
import { useNode } from "@craftjs/core";
import { 
  ArrowRight, 
  Heart, 
  Smile, 
  Activity, 
  Video, 
  Stethoscope, 
  Award, 
  Shield, 
  Users, 
  Plus, 
  Trash2,
  ChevronDown
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  heart: Heart,
  smile: Smile,
  activity: Activity,
  video: Video,
  stethoscope: Stethoscope,
  award: Award,
  shield: Shield,
  users: Users,
};

interface ServiceItemType {
  title: string;
  desc: string;
  iconName: string;
}

interface ServicesGridProps {
  backgroundColor?: string;
  columns?: number;
  sectionSubtitle?: string;
  sectionTitle?: string;
  sectionDescription?: string;
  services?: ServiceItemType[];
}

export const ServicesGridSettings = () => {
  const { 
    actions: { setProp }, 
    backgroundColor, 
    columns,
    sectionSubtitle,
    sectionTitle,
    sectionDescription,
    services
  } = useNode((node) => ({
    backgroundColor: node.data.props.backgroundColor,
    columns: node.data.props.columns,
    sectionSubtitle: node.data.props.sectionSubtitle,
    sectionTitle: node.data.props.sectionTitle,
    sectionDescription: node.data.props.sectionDescription,
    services: node.data.props.services,
  }));

  const inputClass = "w-full text-xs bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-gray-800 font-medium";
  const labelClass = "text-[10px] font-bold text-gray-400 uppercase tracking-wider";

  const handleServiceChange = (index: number, field: keyof ServiceItemType, value: string) => {
    setProp((p: ServicesGridProps) => {
      const newServices = [...(p.services || [])];
      newServices[index] = { ...newServices[index], [field]: value };
      p.services = newServices;
    });
  };

  const handleAddService = () => {
    setProp((p: ServicesGridProps) => {
      const newServices = [...(p.services || [])];
      newServices.push({
        title: "New Service",
        desc: "Description of the new medical specialty or clinical care division.",
        iconName: "stethoscope"
      });
      p.services = newServices;
    });
  };

  const handleRemoveService = (index: number) => {
    setProp((p: ServicesGridProps) => {
      const newServices = [...(p.services || [])];
      newServices.splice(index, 1);
      p.services = newServices;
    });
  };

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Section Styling */}
      <div className="flex flex-col gap-3 border-b border-gray-100 pb-4">
        <h4 className="text-xs font-bold text-gray-700">Section Styling</h4>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Background Color</label>
          <div className="flex items-center border border-gray-200 bg-gray-50 rounded overflow-hidden h-8">
            <div className="px-2 text-[10px] text-gray-400 border-r border-gray-200 font-bold uppercase">Fill</div>
            <input 
              type="color" 
              value={backgroundColor || "#FAFAFA"} 
              onChange={(e) => setProp((p: ServicesGridProps) => { p.backgroundColor = e.target.value; })} 
              className="w-full h-full cursor-pointer border-none bg-transparent" 
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Columns</label>
          <div className="flex border border-gray-200 bg-gray-50 rounded overflow-hidden">
            {[2, 3, 4].map((col) => (
              <button
                key={col}
                onClick={() => setProp((p: ServicesGridProps) => { p.columns = col; })}
                className={`flex-1 py-1.5 text-[11px] font-bold transition-colors ${columns === col ? "bg-white text-blue-500 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
              >
                {col} Cols
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Header Info */}
      <div className="flex flex-col gap-3 border-b border-gray-100 pb-4">
        <h4 className="text-xs font-bold text-gray-700">Header Content</h4>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Section Subtitle</label>
          <input 
            type="text" 
            value={sectionSubtitle || ""} 
            onChange={(e) => setProp((p: ServicesGridProps) => { p.sectionSubtitle = e.target.value; })} 
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Section Title</label>
          <input 
            type="text" 
            value={sectionTitle || ""} 
            onChange={(e) => setProp((p: ServicesGridProps) => { p.sectionTitle = e.target.value; })} 
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Section Description</label>
          <textarea 
            value={sectionDescription || ""} 
            onChange={(e) => setProp((p: ServicesGridProps) => { p.sectionDescription = e.target.value; })} 
            className={`${inputClass} min-h-[50px] resize-y`}
          />
        </div>
      </div>

      {/* Services List Manager */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-bold text-gray-700">Services List</h4>
          <button 
            onClick={handleAddService}
            className="flex items-center gap-1 text-[10px] font-bold text-blue-500 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
          >
            <Plus size={10} strokeWidth={3} /> Add Card
          </button>
        </div>

        <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
          {(services as ServiceItemType[] || []).map((s: ServiceItemType, idx: number) => (
            <div key={idx} className="bg-gray-50 border border-gray-200 p-3 rounded-lg flex flex-col gap-2.5 relative group">
              <button 
                onClick={() => handleRemoveService(idx)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                title="Delete Service"
              >
                <Trash2 size={12} />
              </button>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-teal-50 text-[#115E59] flex items-center justify-center font-bold text-xs">
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

              <div className="flex items-center gap-2">
                <div className="w-16 text-[9px] font-extrabold text-gray-400 uppercase">Icon:</div>
                <div className="relative flex-1">
                  <select 
                    value={s.iconName} 
                    onChange={(e) => handleServiceChange(idx, "iconName", e.target.value)}
                    className="w-full text-xs bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none appearance-none font-bold text-[#115E59] cursor-pointer"
                  >
                    <option value="stethoscope">Stethoscope</option>
                    <option value="heart">Heart</option>
                    <option value="smile">Smile</option>
                    <option value="activity">Cardiology</option>
                    <option value="video">Video Consult</option>
                    <option value="award">Specialist</option>
                    <option value="shield">Trusted</option>
                    <option value="users">Family</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <textarea 
                value={s.desc} 
                onChange={(e) => handleServiceChange(idx, "desc", e.target.value)} 
                className={`${inputClass} min-h-[40px] text-[11px]`}
                placeholder="Short description of service..."
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ServiceCard = ({ title, desc, iconName }: { title: string, desc: string, iconName: string }) => {
  const IconComponent = ICON_MAP[iconName] || Stethoscope;

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200/60 flex flex-col items-start text-left shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 hover:border-[#115E59]/20 group">
      <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#115E59] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300 shrink-0">
        <IconComponent size={18} strokeWidth={2.5} />
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <h3 className="text-sm font-extrabold text-gray-900 tracking-tight">{title}</h3>
        <p className="text-[12px] text-gray-500 font-semibold leading-relaxed line-clamp-3">{desc}</p>
      </div>
      <span className="text-[11px] font-bold text-[#115E59] flex items-center gap-1 mt-6 cursor-pointer group-hover:underline">
        Learn more <ArrowRight size={11} strokeWidth={2.8} />
      </span>
    </div>
  );
};

export const ServicesGrid = ({ 
  backgroundColor = "#FAFAFA", 
  columns = 3,
  sectionSubtitle = "Our Specialties",
  sectionTitle = "High-Quality Medical Services",
  sectionDescription = "Explore our specialized clinical divisions dedicated to providing expert diagnostics and patient care.",
  services = [
    {
      title: "General Medicine",
      desc: "Comprehensive health evaluations, diagnostics, and expert treatment plans for patients of all ages.",
      iconName: "heart"
    },
    {
      title: "Dental Care",
      desc: "Advanced restorative and cosmetic dentistry services including cleanings, whitening, and preventive care.",
      iconName: "smile"
    },
    {
      title: "Cardiology",
      desc: "Expert cardiovascular consultations, ECG testing, and customized health plans for heart disease prevention.",
      iconName: "activity"
    },
    {
      title: "Video Consult",
      desc: "Secure, remote online video consultations with our lead clinical specialists from the comfort of home.",
      iconName: "video"
    }
  ]
}: ServicesGridProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{ backgroundColor, outline: isSelected ? "2px solid #0066FF" : "none", outlineOffset: "-2px" }}
      className="py-20 px-6 w-full relative border-b border-[#E5E5E5] flex flex-col items-center font-sans select-none"
    >
      <div className="max-w-5xl w-full mx-auto flex flex-col items-center">
        <div className="flex flex-col items-center text-center mb-12">
          {sectionSubtitle && (
            <span className="text-[#115E59] font-extrabold tracking-[0.15em] uppercase text-[9.5px] bg-teal-50 px-3 py-1 rounded-full mb-3.5 block border border-[#115E59]/10">
              {sectionSubtitle}
            </span>
          )}
          {sectionTitle && (
            <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
              {sectionTitle}
            </h2>
          )}
          {sectionDescription && (
            <p className="text-[13.5px] text-gray-500 font-medium max-w-md mt-2">
              {sectionDescription}
            </p>
          )}
        </div>
        
        <div 
          className="w-full grid gap-5" 
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {services.slice(0, columns).map((s, idx) => (
            <ServiceCard key={idx} title={s.title} desc={s.desc} iconName={s.iconName} />
          ))}
        </div>
      </div>
    </div>
  );
};

ServicesGrid.craft = {
  displayName: "Services Grid",
  props: { 
    backgroundColor: "#FAFAFA", 
    columns: 3,
    sectionSubtitle: "Our Specialties",
    sectionTitle: "High-Quality Medical Services",
    sectionDescription: "Explore our specialized clinical divisions dedicated to providing expert diagnostics and patient care.",
    services: [
      {
        title: "General Medicine",
        desc: "Comprehensive health evaluations, diagnostics, and expert treatment plans for patients of all ages.",
        iconName: "heart"
      },
      {
        title: "Dental Care",
        desc: "Advanced restorative and cosmetic dentistry services including cleanings, whitening, and preventive care.",
        iconName: "smile"
      },
      {
        title: "Cardiology",
        desc: "Expert cardiovascular consultations, ECG testing, and customized health plans for heart disease prevention.",
        iconName: "activity"
      },
      {
        title: "Video Consult",
        desc: "Secure, remote online video consultations with our lead clinical specialists from the comfort of home.",
        iconName: "video"
      }
    ]
  },
  rules: { canDrag: () => true },
  related: { settings: ServicesGridSettings },
};
