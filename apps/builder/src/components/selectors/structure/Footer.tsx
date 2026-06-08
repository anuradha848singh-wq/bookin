"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { Text } from "../content/Text";
import { Container } from "../structure/Container";
import { BriefcaseBusiness, Camera, Mail, MapPin, MessageCircle, Phone, ThumbsUp } from "lucide-react";

interface FooterProps {
  backgroundColor?: string;
  textColor?: string;
}

export const FooterSettings = () => {
  const { actions: { setProp }, backgroundColor, textColor } = useNode((node) => ({
    backgroundColor: node.data.props.backgroundColor,
    textColor: node.data.props.textColor,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Background</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded overflow-hidden">
          <div className="px-2 text-[10px] text-gray-400 border-r border-[#E5E5E5]">Fill</div>
          <input 
            type="color" 
            value={backgroundColor || "#111827"} 
            onChange={(e) => setProp((p: FooterProps) => { p.backgroundColor = e.target.value; })} 
            className="w-full h-6 cursor-pointer border-none bg-transparent" 
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Text Color</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded overflow-hidden">
          <div className="px-2 text-[10px] text-gray-400 border-r border-[#E5E5E5]">Fill</div>
          <input 
            type="color" 
            value={textColor || "#ffffff"} 
            onChange={(e) => setProp((p: FooterProps) => { p.textColor = e.target.value; })} 
            className="w-full h-6 cursor-pointer border-none bg-transparent" 
          />
        </div>
      </div>
    </div>
  );
};

export const Footer = ({ backgroundColor = "#111827", textColor = "#ffffff" }: FooterProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{ 
        backgroundColor, 
        color: textColor,
        outline: isSelected ? "2px solid #0066FF" : "none", 
        outlineOffset: "-2px" 
      }}
      className="w-full py-16 px-8 border-t border-gray-700"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="col-span-1">
            <Element id="footer-brand" is={Container} padding={0} background="transparent" canvas>
              <div className="w-10 h-10 bg-white rounded-full mb-4 flex items-center justify-center text-black font-bold text-lg">
                b
              </div>
              <Text text="Bookin" fontSize={18} fontWeight="700" color={textColor} />
              <div className="h-2" />
              <Text text="Professional booking platform for modern businesses." fontSize={13} color={textColor} />
            </Element>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <Element id="footer-links-1" is={Container} padding={0} background="transparent" canvas>
              <Text text="Product" fontSize={14} fontWeight="600" color={textColor} />
              <div className="h-4" />
              <div className="flex flex-col gap-2">
                <Text text="Features" fontSize={13} color={textColor} />
                <Text text="Pricing" fontSize={13} color={textColor} />
                <Text text="Integrations" fontSize={13} color={textColor} />
                <Text text="API" fontSize={13} color={textColor} />
              </div>
            </Element>
          </div>

          {/* Company */}
          <div className="col-span-1">
            <Element id="footer-links-2" is={Container} padding={0} background="transparent" canvas>
              <Text text="Company" fontSize={14} fontWeight="600" color={textColor} />
              <div className="h-4" />
              <div className="flex flex-col gap-2">
                <Text text="About Us" fontSize={13} color={textColor} />
                <Text text="Careers" fontSize={13} color={textColor} />
                <Text text="Blog" fontSize={13} color={textColor} />
                <Text text="Contact" fontSize={13} color={textColor} />
              </div>
            </Element>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <Element id="footer-contact" is={Container} padding={0} background="transparent" canvas>
              <Text text="Contact" fontSize={14} fontWeight="600" color={textColor} />
              <div className="h-4" />
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Mail size={14} style={{ color: textColor }} />
                  <Text text="hello@bookin.com" fontSize={13} color={textColor} />
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} style={{ color: textColor }} />
                  <Text text="+1 (555) 123-4567" fontSize={13} color={textColor} />
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} style={{ color: textColor }} />
                  <Text text="San Francisco, CA" fontSize={13} color={textColor} />
                </div>
              </div>
            </Element>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <Element id="footer-copyright" is={Container} padding={0} background="transparent" canvas>
            <Text text="© 2026 Bookin. All rights reserved." fontSize={12} color={textColor} />
          </Element>
          
          <div className="flex items-center gap-4">
            <ThumbsUp size={18} style={{ color: textColor, cursor: "pointer", opacity: 0.7 }} className="hover:opacity-100 transition-opacity" />
            <MessageCircle size={18} style={{ color: textColor, cursor: "pointer", opacity: 0.7 }} className="hover:opacity-100 transition-opacity" />
            <Camera size={18} style={{ color: textColor, cursor: "pointer", opacity: 0.7 }} className="hover:opacity-100 transition-opacity" />
            <BriefcaseBusiness size={18} style={{ color: textColor, cursor: "pointer", opacity: 0.7 }} className="hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </div>
  );
};

Footer.craft = {
  displayName: "Footer",
  props: { backgroundColor: "#111827", textColor: "#ffffff" },
  rules: { canDrag: () => true },
  related: { settings: FooterSettings },
};
