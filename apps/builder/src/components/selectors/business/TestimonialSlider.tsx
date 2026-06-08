"use client";

import React, { useState, useEffect } from "react";
import { useNode } from "@craftjs/core";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  avatarUrl: string;
}

interface TestimonialSliderProps {
  testimonials?: Testimonial[];
  autoPlay?: boolean;
  interval?: number;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  borderRadius?: number;
}

export const TestimonialSliderSettings = () => {
  const { actions: { setProp }, testimonials, autoPlay, interval, backgroundColor, textColor, accentColor, borderRadius } = useNode((node) => ({
    testimonials: node.data.props.testimonials as Testimonial[],
    autoPlay: node.data.props.autoPlay,
    interval: node.data.props.interval,
    backgroundColor: node.data.props.backgroundColor,
    textColor: node.data.props.textColor,
    accentColor: node.data.props.accentColor,
    borderRadius: node.data.props.borderRadius,
  }));

  const updateTestimonial = (index: number, key: keyof Testimonial, value: string) => {
    setProp((props: TestimonialSliderProps) => {
      if (props.testimonials && props.testimonials[index]) {
        props.testimonials[index][key] = value;
      }
    });
  };

  const removeTestimonial = (index: number) => {
    setProp((props: TestimonialSliderProps) => {
      if (props.testimonials) {
        props.testimonials.splice(index, 1);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Behavior</label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center gap-2 text-[12px] text-gray-700 cursor-pointer h-8">
            <input 
              type="checkbox" 
              checked={autoPlay} 
              onChange={(e) => setProp((p: TestimonialSliderProps) => { p.autoPlay = e.target.checked; })}
              className="rounded border-gray-300 text-blue-600"
            />
            Auto-play
          </label>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Delay (s)</div>
            <input 
              type="number" 
              value={(interval || 5000) / 1000} 
              onChange={(e) => setProp((p: TestimonialSliderProps) => { p.interval = (parseInt(e.target.value) || 5) * 1000; })} 
              className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Style</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">BG</div>
            <input type="color" value={backgroundColor || "#FAFAFA"} onChange={(e) => setProp((p: TestimonialSliderProps) => { p.backgroundColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Text</div>
            <input type="color" value={textColor || "#111827"} onChange={(e) => setProp((p: TestimonialSliderProps) => { p.textColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Accent</div>
            <input type="color" value={accentColor || "#0066FF"} onChange={(e) => setProp((p: TestimonialSliderProps) => { p.accentColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Radius</div>
            <input type="number" value={borderRadius || 16} onChange={(e) => setProp((p: TestimonialSliderProps) => { p.borderRadius = parseInt(e.target.value) || 0; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Testimonials ({testimonials?.length || 0})</label>
        {testimonials && testimonials.map((testi, index) => (
          <div key={testi.id} className="border border-[#E5E5E5] p-3 rounded-md bg-white flex flex-col gap-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Slide {index + 1}</span>
              <button onClick={() => removeTestimonial(index)} className="text-[10px] text-red-500 font-semibold uppercase">Remove</button>
            </div>
            <input type="text" value={testi.name} onChange={(e) => updateTestimonial(index, "name", e.target.value)} className="w-full px-2 py-1 text-[11px] border border-[#E5E5E5] rounded focus:outline-none" placeholder="Name" />
            <input type="text" value={testi.role} onChange={(e) => updateTestimonial(index, "role", e.target.value)} className="w-full px-2 py-1 text-[11px] border border-[#E5E5E5] rounded focus:outline-none" placeholder="Role/Company" />
            <input type="text" value={testi.avatarUrl} onChange={(e) => updateTestimonial(index, "avatarUrl", e.target.value)} className="w-full px-2 py-1 text-[11px] border border-[#E5E5E5] rounded focus:outline-none" placeholder="Avatar Image URL" />
            <textarea value={testi.text} onChange={(e) => updateTestimonial(index, "text", e.target.value)} className="w-full px-2 py-1 text-[11px] border border-[#E5E5E5] rounded focus:outline-none min-h-[60px]" placeholder="Quote Text" />
          </div>
        ))}
        <button 
          onClick={() => {
            setProp((p: TestimonialSliderProps) => {
              if (!p.testimonials) p.testimonials = [];
              p.testimonials.push({ id: Date.now().toString(), name: "New Person", role: "Role", text: "New testimonial quote.", avatarUrl: "" });
            });
          }}
          className="w-full py-1.5 border border-dashed border-gray-300 rounded text-[11px] font-medium text-gray-500 hover:text-gray-800 hover:border-gray-400"
        >
          + Add Testimonial
        </button>
      </div>
    </div>
  );
};

export const TestimonialSlider = ({ 
  testimonials = [
    { id: "1", name: "Alice Johnson", role: "CEO, TechFlow", text: "This service completely transformed how we handle our scheduling. It's incredibly intuitive and our clients love it.", avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026024d" },
    { id: "2", name: "Mark Smith", role: "Director, HealthPlus", text: "The reliability and speed are unmatched. We saw a 40% reduction in no-shows within the first month of using this platform.", avatarUrl: "https://i.pravatar.cc/150?u=a04258a2462d826712d" },
    { id: "3", name: "Elena Rodriguez", role: "Independent Consultant", text: "Setting it up took minutes, and the customization options allowed me to perfectly match it to my brand's look and feel.", avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
  ],
  autoPlay = true,
  interval = 5000,
  backgroundColor = "#FAFAFA",
  textColor = "#111827",
  accentColor = "#0066FF",
  borderRadius = 16
}: TestimonialSliderProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || isSelected || !testimonials || testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, testimonials?.length, isSelected]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % (testimonials?.length || 1));
  const prev = () => setCurrentIndex((prev) => (prev - 1 + (testimonials?.length || 1)) % (testimonials?.length || 1));

  if (!testimonials || testimonials.length === 0) {
    return <div ref={(ref) => { connect(drag(ref as HTMLElement)); }} className="p-8 text-center bg-gray-50 border rounded-lg">No testimonials added.</div>;
  }

  const current = testimonials[currentIndex];

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className="w-full relative overflow-hidden group"
      style={{ 
        backgroundColor, 
        color: textColor,
        borderRadius: `${borderRadius}px`,
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "2px", 
        transition: "outline 0.15s"
      }}
    >
      <div className="p-8 md:p-12 lg:p-16 flex flex-col items-center text-center">
        <Quote size={48} className="mb-6 opacity-20" style={{ color: accentColor }} />
        
        <div className="relative w-full overflow-hidden h-[120px] md:h-[100px] flex items-center justify-center">
          {testimonials.map((testi, idx) => (
            <p 
              key={testi.id}
              className="absolute w-full text-lg md:text-xl lg:text-2xl font-medium leading-relaxed italic transition-all duration-500"
              style={{
                opacity: idx === currentIndex ? 1 : 0,
                transform: `translateX(${(idx - currentIndex) * 100}%) scale(${idx === currentIndex ? 1 : 0.95})`,
                pointerEvents: idx === currentIndex ? 'auto' : 'none'
              }}
            >
              "{testi.text}"
            </p>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center">
          <div className="flex justify-center mb-4 relative w-[50px] h-[50px]">
            {testimonials.map((testi, idx) => (
              <img 
                key={testi.id}
                src={testi.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(testi.name)}&background=random`} 
                alt={testi.name} 
                className="absolute w-12 h-12 rounded-full object-cover transition-all duration-500 shadow-md"
                style={{
                  opacity: idx === currentIndex ? 1 : 0,
                  transform: `scale(${idx === currentIndex ? 1 : 0})`,
                }}
              />
            ))}
          </div>
          
          <div className="relative w-full h-[40px]">
            {testimonials.map((testi, idx) => (
              <div 
                key={testi.id}
                className="absolute inset-0 flex flex-col items-center transition-all duration-500"
                style={{
                  opacity: idx === currentIndex ? 1 : 0,
                  transform: `translateY(${(idx - currentIndex) * 20}px)`,
                }}
              >
                <span className="font-bold">{testi.name}</span>
                <span className="text-sm opacity-60">{testi.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      {testimonials.length > 1 && (
        <>
          <button 
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {testimonials.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className="w-2 h-2 rounded-full transition-all"
              style={{ 
                backgroundColor: idx === currentIndex ? accentColor : 'currentColor',
                opacity: idx === currentIndex ? 1 : 0.2,
                width: idx === currentIndex ? '16px' : '8px'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

TestimonialSlider.craft = {
  displayName: "Testimonial Slider",
  props: { 
    testimonials: [
      { id: "1", name: "Alice Johnson", role: "CEO, TechFlow", text: "This service completely transformed how we handle our scheduling. It's incredibly intuitive and our clients love it.", avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026024d" },
      { id: "2", name: "Mark Smith", role: "Director, HealthPlus", text: "The reliability and speed are unmatched. We saw a 40% reduction in no-shows within the first month of using this platform.", avatarUrl: "https://i.pravatar.cc/150?u=a04258a2462d826712d" },
      { id: "3", name: "Elena Rodriguez", role: "Independent Consultant", text: "Setting it up took minutes, and the customization options allowed me to perfectly match it to my brand's look and feel.", avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
    ],
    autoPlay: true,
    interval: 5000,
    backgroundColor: "#FAFAFA",
    textColor: "#111827",
    accentColor: "#0066FF",
    borderRadius: 16
  },
  rules: { canDrag: () => true },
  related: { settings: TestimonialSliderSettings },
};
