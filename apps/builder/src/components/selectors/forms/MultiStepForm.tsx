"use client";

import React, { useState } from "react";
import { useNode, Element } from "@craftjs/core";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";

interface Step {
  id: string;
  title: string;
  subtitle?: string;
}

interface MultiStepFormProps {
  steps?: Step[];
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: number;
}

export const MultiStepFormSettings = () => {
  const { actions: { setProp }, steps, primaryColor, backgroundColor, textColor, borderRadius } = useNode((node) => ({
    steps: node.data.props.steps as Step[],
    primaryColor: node.data.props.primaryColor,
    backgroundColor: node.data.props.backgroundColor,
    textColor: node.data.props.textColor,
    borderRadius: node.data.props.borderRadius,
  }));

  const updateStep = (index: number, key: keyof Step, value: string) => {
    setProp((props: MultiStepFormProps) => {
      if (props.steps && props.steps[index]) {
        props.steps[index][key] = value;
      }
    });
  };

  const removeStep = (index: number) => {
    setProp((props: MultiStepFormProps) => {
      if (props.steps) {
        props.steps.splice(index, 1);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Steps ({steps?.length || 0})</label>
        {steps && steps.map((step, index) => (
          <div key={step.id} className="border border-[#E5E5E5] p-3 rounded-md bg-white flex flex-col gap-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Step {index + 1}</span>
              {steps.length > 1 && (
                <button onClick={() => removeStep(index)} className="text-[10px] text-red-500 font-semibold uppercase">Remove</button>
              )}
            </div>
            <input type="text" value={step.title} onChange={(e) => updateStep(index, "title", e.target.value)} className="w-full px-2 py-1 text-[11px] border border-[#E5E5E5] rounded focus:outline-none" placeholder="Step Title (e.g. Personal Info)" />
            <input type="text" value={step.subtitle} onChange={(e) => updateStep(index, "subtitle", e.target.value)} className="w-full px-2 py-1 text-[11px] border border-[#E5E5E5] rounded focus:outline-none" placeholder="Subtitle (Optional)" />
          </div>
        ))}
        <button 
          onClick={() => {
            setProp((p: MultiStepFormProps) => {
              if (!p.steps) p.steps = [];
              p.steps.push({ id: Date.now().toString(), title: "New Step", subtitle: "" });
            });
          }}
          className="w-full py-1.5 border border-dashed border-gray-300 rounded text-[11px] font-medium text-gray-500 hover:text-gray-800 hover:border-gray-400"
        >
          + Add Step
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Colors & Style</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Primary</div>
            <input type="color" value={primaryColor || "#0066FF"} onChange={(e) => setProp((p: MultiStepFormProps) => { p.primaryColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">BG</div>
            <input type="color" value={backgroundColor || "#ffffff"} onChange={(e) => setProp((p: MultiStepFormProps) => { p.backgroundColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Text</div>
            <input type="color" value={textColor || "#111827"} onChange={(e) => setProp((p: MultiStepFormProps) => { p.textColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Rad</div>
            <input type="number" value={borderRadius || 16} onChange={(e) => setProp((p: MultiStepFormProps) => { p.borderRadius = parseInt(e.target.value) || 0; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Container for each step's content
export const StepContainer = ({ children }: { children?: React.ReactNode }) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={(ref) => { connect(drag(ref as HTMLElement)); }} className="w-full min-h-[200px] py-4 flex flex-col gap-4 relative">
      {children}
    </div>
  );
};

StepContainer.craft = {
  displayName: "Step Content",
  rules: { canDrag: () => false },
};

export const MultiStepForm = ({ 
  steps = [
    { id: "1", title: "Account Details", subtitle: "Basic information" },
    { id: "2", title: "Personal Info", subtitle: "About yourself" },
    { id: "3", title: "Review", subtitle: "Confirm details" },
  ],
  primaryColor = "#0066FF",
  backgroundColor = "#ffffff",
  textColor = "#111827",
  borderRadius = 16
}: MultiStepFormProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < steps.length - 1) setCurrentStep(curr => curr + 1);
  };

  const prev = () => {
    if (currentStep > 0) setCurrentStep(curr => curr - 1);
  };

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className="w-full max-w-4xl mx-auto shadow-sm border border-[#E5E5E5] flex flex-col md:flex-row overflow-hidden"
      style={{ 
        backgroundColor, 
        color: textColor,
        borderRadius: `${borderRadius}px`,
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "2px", 
        transition: "outline 0.15s"
      }}
    >
      {/* Sidebar Progress */}
      <div className="w-full md:w-64 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 p-6 flex flex-row md:flex-col justify-between md:justify-start gap-4 md:gap-8 overflow-x-auto shrink-0">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isActive = idx === currentStep;
          
          return (
            <div key={step.id} className="flex items-center md:items-start gap-3 shrink-0">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors shrink-0"
                style={{ 
                  backgroundColor: isCompleted || isActive ? primaryColor : 'white',
                  color: isCompleted || isActive ? 'white' : '#9CA3AF',
                  border: isCompleted || isActive ? 'none' : '2px solid #E5E7EB'
                }}
              >
                {isCompleted ? <Check size={16} /> : (idx + 1)}
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider opacity-50">Step {idx + 1}</span>
                <span className="font-semibold text-sm mt-0.5">{step.title}</span>
                {step.subtitle && <span className="text-xs opacity-60 mt-1">{step.subtitle}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-6 md:p-8">
        
        {/* Step Header (Mobile only) */}
        <div className="md:hidden mb-6 pb-4 border-b border-gray-100">
          <span className="text-xs font-bold uppercase tracking-wider opacity-50" style={{ color: primaryColor }}>Step {currentStep + 1} of {steps.length}</span>
          <h2 className="text-xl font-bold mt-1">{steps[currentStep]?.title}</h2>
        </div>

        {/* Content Region for the current step */}
        {/* In the builder, we render all containers but hide inactive ones to allow editing all steps */}
        <div className="flex-1 relative min-h-[300px]">
          {steps.map((step, idx) => (
            <div 
              key={step.id} 
              className={`w-full h-full ${idx === currentStep ? 'block' : isSelected ? 'hidden opacity-50 border-2 border-dashed border-gray-200 pointer-events-none' : 'hidden'}`}
            >
              <Element id={`step-${step.id}`} is={StepContainer} canvas />
            </div>
          ))}
          {isSelected && (
            <div className="absolute top-0 right-0 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded shadow-sm opacity-80 pointer-events-none z-10">
              Editing Step {currentStep + 1}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center gap-4">
          <button 
            onClick={prev}
            disabled={currentStep === 0}
            className="px-6 py-2.5 rounded-lg font-medium text-sm transition-colors border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-2"
          >
            <ChevronLeft size={16} /> Back
          </button>
          
          <button 
            onClick={next}
            className="px-6 py-2.5 rounded-lg font-bold text-sm transition-opacity hover:opacity-90 flex items-center gap-2"
            style={{ 
              backgroundColor: primaryColor, 
              color: 'white',
              display: currentStep === steps.length - 1 ? 'none' : 'flex'
            }}
          >
            Next Step <ChevronRight size={16} />
          </button>
          
          {currentStep === steps.length - 1 && (
            <button 
              className="px-8 py-2.5 rounded-lg font-bold text-sm transition-opacity hover:opacity-90 flex items-center gap-2"
              style={{ backgroundColor: '#10B981', color: 'white' }}
              onClick={(e) => { e.preventDefault(); if(!isSelected) alert("Form Submitted!"); }}
            >
              Complete <Check size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

MultiStepForm.craft = {
  displayName: "Multi-Step Form",
  props: { 
    steps: [
      { id: "1", title: "Account Details", subtitle: "Basic information" },
      { id: "2", title: "Personal Info", subtitle: "About yourself" },
      { id: "3", title: "Review", subtitle: "Confirm details" },
    ],
    primaryColor: "#0066FF",
    backgroundColor: "#ffffff",
    textColor: "#111827",
    borderRadius: 16
  },
  rules: { canDrag: () => true },
  related: { settings: MultiStepFormSettings },
};
