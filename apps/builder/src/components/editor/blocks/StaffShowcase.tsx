"use client";

import React from "react";
import { useNode } from "@craftjs/core";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Plus, Trash2, ChevronDown, Sparkles } from "lucide-react";

interface StaffMemberType {
  name: string;
  role: string;
  nextAvailable: string;
  image: string;
}

interface StaffShowcaseProps {
  backgroundColor?: string;
  columns?: number;
  sectionSubtitle?: string;
  sectionTitle?: string;
  sectionDescription?: string;
  useDynamicStaff?: boolean;
  staffMembers?: StaffMemberType[];
}

export const StaffShowcaseSettings = () => {
  const { 
    actions: { setProp }, 
    backgroundColor, 
    columns,
    sectionSubtitle,
    sectionTitle,
    sectionDescription,
    useDynamicStaff,
    staffMembers
  } = useNode((node) => ({
    backgroundColor: node.data.props.backgroundColor,
    columns: node.data.props.columns,
    sectionSubtitle: node.data.props.sectionSubtitle,
    sectionTitle: node.data.props.sectionTitle,
    sectionDescription: node.data.props.sectionDescription,
    useDynamicStaff: node.data.props.useDynamicStaff,
    staffMembers: node.data.props.staffMembers,
  }));

  const inputClass = "w-full text-xs bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-gray-800 font-medium";
  const labelClass = "text-[10px] font-bold text-gray-400 uppercase tracking-wider";

  const handleStaffChange = (index: number, field: keyof StaffMemberType, value: string) => {
    setProp((p: StaffShowcaseProps) => {
      const newStaff = [...(p.staffMembers || [])];
      newStaff[index] = { ...newStaff[index], [field]: value };
      p.staffMembers = newStaff;
    });
  };

  const handleAddStaff = () => {
    setProp((p: StaffShowcaseProps) => {
      const newStaff = [...(p.staffMembers || [])];
      newStaff.push({
        name: "Dr. New Provider",
        role: "Specialist",
        nextAvailable: "Contact for availability",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300"
      });
      p.staffMembers = newStaff;
    });
  };

  const handleRemoveStaff = (index: number) => {
    setProp((p: StaffShowcaseProps) => {
      const newStaff = [...(p.staffMembers || [])];
      newStaff.splice(index, 1);
      p.staffMembers = newStaff;
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
              onChange={(e) => setProp((p: StaffShowcaseProps) => { p.backgroundColor = e.target.value; })} 
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
                onClick={() => setProp((p: StaffShowcaseProps) => { p.columns = col; })}
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
            onChange={(e) => setProp((p: StaffShowcaseProps) => { p.sectionSubtitle = e.target.value; })} 
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Section Title</label>
          <input 
            type="text" 
            value={sectionTitle || ""} 
            onChange={(e) => setProp((p: StaffShowcaseProps) => { p.sectionTitle = e.target.value; })} 
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Section Description</label>
          <textarea 
            value={sectionDescription || ""} 
            onChange={(e) => setProp((p: StaffShowcaseProps) => { p.sectionDescription = e.target.value; })} 
            className={`${inputClass} min-h-[50px] resize-y`}
          />
        </div>
      </div>

      {/* Dynamic Data Setting */}
      <div className="flex flex-col gap-3 border-b border-gray-100 pb-4">
        <h4 className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
          <Sparkles size={13} className="text-amber-500" /> Data Source
        </h4>
        <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-2.5">
          <span className="text-[11px] font-bold text-gray-600">Use dynamic staff from DB</span>
          <button
            onClick={() => setProp((p: StaffShowcaseProps) => { p.useDynamicStaff = !p.useDynamicStaff; })}
            className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${useDynamicStaff ? 'bg-emerald-500' : 'bg-gray-300'}`}
          >
            <div className={`w-4.5 h-4.5 bg-white rounded-full shadow transform duration-200 ease-in-out ${useDynamicStaff ? 'translate-x-4.5' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Staff List Manager */}
      {!useDynamicStaff && (
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-gray-700">Custom Providers</h4>
            <button 
              onClick={handleAddStaff}
              className="flex items-center gap-1 text-[10px] font-bold text-blue-500 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
            >
              <Plus size={10} strokeWidth={3} /> Add Staff
            </button>
          </div>

          <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
            {(staffMembers as StaffMemberType[] || []).map((s: StaffMemberType, idx: number) => (
              <div key={idx} className="bg-gray-50 border border-gray-200 p-3 rounded-lg flex flex-col gap-2 relative group">
                <button 
                  onClick={() => handleRemoveStaff(idx)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete Provider"
                >
                  <Trash2 size={12} />
                </button>

                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-emerald-50 text-[#115E59] flex items-center justify-center font-bold text-xs shrink-0">
                    {idx + 1}
                  </div>
                  <input 
                    type="text" 
                    value={s.name} 
                    onChange={(e) => handleStaffChange(idx, "name", e.target.value)} 
                    className={`${inputClass} py-1 pr-6 font-bold`}
                    placeholder="Doctor Name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="flex flex-col gap-1">
                    <label className={labelClass}>Role/Specialty</label>
                    <input 
                      type="text" 
                      value={s.role} 
                      onChange={(e) => handleStaffChange(idx, "role", e.target.value)} 
                      className={inputClass}
                      placeholder="e.g. Lead Surgeon"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className={labelClass}>Availability</label>
                    <input 
                      type="text" 
                      value={s.nextAvailable} 
                      onChange={(e) => handleStaffChange(idx, "nextAvailable", e.target.value)} 
                      className={inputClass}
                      placeholder="e.g. Today, 03:00 PM"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 mt-1">
                  <label className={labelClass}>Avatar URL</label>
                  <input 
                    type="text" 
                    value={s.image} 
                    onChange={(e) => handleStaffChange(idx, "image", e.target.value)} 
                    className={inputClass}
                    placeholder="Image path or absolute URL..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const StaffCard = ({ name, role, image, nextAvailable }: { name: string, role: string, image: string, nextAvailable: string }) => {
  const [imgSrc, setImgSrc] = React.useState(image);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setImgSrc(image);
    setHasError(false);
  }, [image]);

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-2xl border border-gray-200/80 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-gray-300 transition-all duration-300 group select-none">
      <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-gray-50 flex items-center justify-center bg-gray-50 shrink-0">
        {!hasError ? (
          <img 
            src={imgSrc} 
            alt={name} 
            onError={() => {
              setHasError(true);
            }}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          />
        ) : (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        )}
      </div>
      <h3 className="text-sm font-extrabold text-gray-900 tracking-tight text-center">{name}</h3>
      <p className="text-[11.5px] font-bold text-gray-400 mb-5 text-center">{role}</p>
      
      <div className="w-full bg-gray-50/70 p-2.5 rounded-lg mb-4 flex items-center justify-center gap-2 text-[11px] font-bold text-gray-600">
        <Calendar size={13} className="text-emerald-500" strokeWidth={2.5} />
        <span className="truncate text-center">Next available: {nextAvailable}</span>
      </div>

      <button className="w-full py-2 bg-[#115E59] hover:bg-[#134E4A] text-white text-xs font-extrabold rounded-lg transition-colors">
        Book {name.split(' ')[0]}
      </button>
    </div>
  );
};

export const StaffShowcase = ({ 
  backgroundColor = "#FAFAFA", 
  columns = 3,
  sectionSubtitle = "Medical Experts",
  sectionTitle = "Meet Our Experts",
  sectionDescription = "Book directly with your preferred medical specialist.",
  useDynamicStaff = true,
  staffMembers = [
    {
      name: "Dr. Sarah Jenkins",
      role: "Lead Cardiologist",
      nextAvailable: "Tomorrow, 09:00 AM",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300"
    },
    {
      name: "Dr. Marcus Vance",
      role: "Dental Surgeon",
      nextAvailable: "Wednesday, 11:30 AM",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300"
    },
    {
      name: "Dr. Amanda Ross",
      role: "Pediatric Specialist",
      nextAvailable: "Today, 03:00 PM",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300"
    }
  ]
}: StaffShowcaseProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  const { data: staffData, isLoading: loading } = useQuery({
    queryKey: ['staff'],
    enabled: useDynamicStaff,
    queryFn: async () => {
      const res = await fetch("/api/dashboard/staff");
      const data = await res.json();
      if (!data.success) throw new Error("Failed to fetch staff");
      return data.staff.map((s: any) => ({
        name: `${s.first_name} ${s.last_name}`,
        role: s.role || "Provider",
        nextAvailable: "Contact for availability",
        image: s.avatar_url || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
      }));
    }
  });

  const staff = useDynamicStaff && staffData && staffData.length > 0 ? staffData : staffMembers;

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{ backgroundColor, outline: isSelected ? "2px solid #0066FF" : "none", outlineOffset: "-2px" }}
      className="py-20 px-6 w-full relative border-y border-[#E5E5E5] flex flex-col items-center font-sans select-none"
    >
      <div className="max-w-5xl w-full mx-auto flex flex-col items-center">
        <div className="text-center mb-12 flex flex-col items-center">
          {sectionSubtitle && (
            <span className="text-[#115E59] font-extrabold tracking-[0.15em] uppercase text-[9.5px] bg-teal-50 px-3 py-1 rounded-full mb-3.5 inline-block border border-[#115E59]/10 text-center">
              {sectionSubtitle}
            </span>
          )}
          {sectionTitle && (
            <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight text-center">
              {sectionTitle}
            </h2>
          )}
          {sectionDescription && (
            <p className="text-[13.5px] text-gray-500 font-medium max-w-md mt-2 text-center">
              {sectionDescription}
            </p>
          )}
        </div>
        
        {useDynamicStaff && loading && !staffData ? (
          <div className="text-gray-400 text-sm py-10 animate-pulse font-medium">Loading staff...</div>
        ) : (
          <div 
            className="w-full grid gap-5"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {staff.slice(0, columns).map((s: any, idx: number) => (
              <StaffCard key={idx} {...s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

StaffShowcase.craft = {
  displayName: "Staff Showcase",
  props: { 
    backgroundColor: "#FAFAFA", 
    columns: 3,
    sectionSubtitle: "Medical Experts",
    sectionTitle: "Meet Our Experts",
    sectionDescription: "Book directly with your preferred medical specialist.",
    useDynamicStaff: true,
    staffMembers: [
      {
        name: "Dr. Sarah Jenkins",
        role: "Lead Cardiologist",
        nextAvailable: "Tomorrow, 09:00 AM",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300"
      },
      {
        name: "Dr. Marcus Vance",
        role: "Dental Surgeon",
        nextAvailable: "Wednesday, 11:30 AM",
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300"
      },
      {
        name: "Dr. Amanda Ross",
        role: "Pediatric Specialist",
        nextAvailable: "Today, 03:00 PM",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300"
      }
    ]
  },
  rules: { canDrag: () => true },
  related: { settings: StaffShowcaseSettings },
};
