"use client";

import React, { useState, useEffect } from "react";
import { useNode, Element } from "@craftjs/core";
import { Container } from "../structure/Container";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SlideItem {
  id: string;
}

interface CarouselProps {
  slides?: SlideItem[];
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  height?: number;
}

export const CarouselSettings = () => {
  const { actions: { setProp }, slides, autoPlay, interval, showArrows, showDots, height } = useNode((node) => ({
    slides: node.data.props.slides as SlideItem[],
    autoPlay: node.data.props.autoPlay,
    interval: node.data.props.interval,
    showArrows: node.data.props.showArrows,
    showDots: node.data.props.showDots,
    height: node.data.props.height,
  }));

  const addSlide = () => {
    setProp((props: CarouselProps) => {
      if (!props.slides) props.slides = [];
      props.slides.push({ id: `slide-${Date.now()}` });
    });
  };

  const removeSlide = (index: number) => {
    setProp((props: CarouselProps) => {
      if (props.slides && props.slides.length > 1) {
        props.slides.splice(index, 1);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Layout</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Height (px)</div>
          <input 
            type="number" 
            value={height || 400} 
            onChange={(e) => setProp((p: CarouselProps) => { p.height = parseInt(e.target.value) || 400; })} 
            className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Options</label>
        
        <label className="flex items-center gap-2 text-[12px] text-gray-700 cursor-pointer">
          <input 
            type="checkbox" 
            checked={autoPlay} 
            onChange={(e) => setProp((p: CarouselProps) => { p.autoPlay = e.target.checked; })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Auto Play
        </label>

        {autoPlay && (
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Interval (ms)</div>
            <input 
              type="number" 
              value={interval || 3000} 
              onChange={(e) => setProp((p: CarouselProps) => { p.interval = parseInt(e.target.value) || 3000; })} 
              className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
            />
          </div>
        )}

        <label className="flex items-center gap-2 text-[12px] text-gray-700 cursor-pointer mt-2">
          <input 
            type="checkbox" 
            checked={showArrows} 
            onChange={(e) => setProp((p: CarouselProps) => { p.showArrows = e.target.checked; })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Show Arrows
        </label>

        <label className="flex items-center gap-2 text-[12px] text-gray-700 cursor-pointer">
          <input 
            type="checkbox" 
            checked={showDots} 
            onChange={(e) => setProp((p: CarouselProps) => { p.showDots = e.target.checked; })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Show Dots
        </label>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Slides ({slides?.length || 0})</label>
        {slides && slides.map((slide, index) => (
          <div key={slide.id} className="flex items-center justify-between border border-[#E5E5E5] p-2 rounded-md bg-[#FAFAFA]">
            <span className="text-[12px] font-medium text-gray-700">Slide {index + 1}</span>
            {slides.length > 1 && (
              <button onClick={() => removeSlide(index)} className="text-[10px] text-red-500 font-semibold px-2">Remove</button>
            )}
          </div>
        ))}
        <button 
          onClick={addSlide}
          className="w-full py-1.5 mt-1 border border-dashed border-gray-300 rounded text-[11px] font-medium text-gray-500 hover:text-gray-800 hover:border-gray-400"
        >
          + Add Slide
        </button>
      </div>
    </div>
  );
};

export const Carousel = ({ 
  slides = [
    { id: "slide-1" },
    { id: "slide-2" },
  ],
  autoPlay = false,
  interval = 3000,
  showArrows = true,
  showDots = true,
  height = 400
}: CarouselProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const [currentIndex, setCurrentIndex] = useState(0);

  // Stop autoPlay when editing, or we can leave it running. Best to pause if hovered.
  useEffect(() => {
    if (!autoPlay || isSelected || isHovered) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === (slides?.length || 1) - 1 ? 0 : prev + 1));
    }, interval);
    
    return () => clearInterval(timer);
  }, [autoPlay, interval, slides?.length, isSelected, isHovered]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === (slides?.length || 1) - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? (slides?.length || 1) - 1 : prev - 1));
  };

  // Ensure current index is valid
  useEffect(() => {
    if (slides && currentIndex >= slides.length) {
      setCurrentIndex(0);
    }
  }, [slides, currentIndex]);

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{ 
        height: `${height}px`,
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "-2px", 
        transition: "outline 0.15s"
      }}
      className="relative w-full overflow-hidden group bg-gray-100 rounded-xl"
    >
      {/* Slides Container */}
      <div 
        className="w-full h-full flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides && slides.map((slide, index) => (
          <div key={slide.id} className="min-w-full h-full shrink-0 relative">
            <Element id={`carousel-content-${slide.id}`} is={Container} canvas padding={0} background="transparent" />
            
            {/* Editor placeholder indicator */}
            {isSelected && (
              <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded">
                Editing Slide {index + 1}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && slides && slides.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center text-gray-800 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center text-gray-800 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {showDots && slides && slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all focus:outline-none ${currentIndex === index ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

Carousel.craft = {
  displayName: "Carousel",
  props: { 
    slides: [
      { id: "slide-1" },
      { id: "slide-2" },
      { id: "slide-3" }
    ],
    autoPlay: false,
    interval: 3000,
    showArrows: true,
    showDots: true,
    height: 400
  },
  rules: { canDrag: () => true },
  related: { settings: CarouselSettings },
};
