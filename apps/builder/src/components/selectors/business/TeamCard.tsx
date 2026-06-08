"use client";

import React from "react";
import { useNode } from "@craftjs/core";
import { Mail, User } from "lucide-react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

interface SocialLink {
  platform: string;
  url: string;
}

interface TeamCardProps {
  name?: string;
  role?: string;
  bio?: string;
  imageUrl?: string;
  socials?: SocialLink[];
  layout?: "vertical" | "horizontal";
  align?: "left" | "center";
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  borderRadius?: number;
}

export const TeamCardSettings = () => {
  const { actions: { setProp }, name, role, bio, imageUrl, socials, layout, align, backgroundColor, textColor, accentColor, borderRadius } = useNode((node) => ({
    name: node.data.props.name,
    role: node.data.props.role,
    bio: node.data.props.bio,
    imageUrl: node.data.props.imageUrl,
    socials: node.data.props.socials as SocialLink[],
    layout: node.data.props.layout,
    align: node.data.props.align,
    backgroundColor: node.data.props.backgroundColor,
    textColor: node.data.props.textColor,
    accentColor: node.data.props.accentColor,
    borderRadius: node.data.props.borderRadius,
  }));

  const updateSocial = (index: number, url: string) => {
    setProp((props: TeamCardProps) => {
      if (props.socials && props.socials[index]) {
        props.socials[index].url = url;
      }
    });
  };

  const addSocial = (platform: string) => {
    setProp((props: TeamCardProps) => {
      if (!props.socials) props.socials = [];
      if (!props.socials.find(s => s.platform === platform)) {
        props.socials.push({ platform, url: "#" });
      }
    });
  };

  const removeSocial = (platform: string) => {
    setProp((props: TeamCardProps) => {
      if (props.socials) {
        props.socials = props.socials.filter(s => s.platform !== platform);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Member Details</label>
        <input type="text" value={name || ""} onChange={(e) => setProp((p: TeamCardProps) => { p.name = e.target.value; })} className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" placeholder="Name" />
        <input type="text" value={role || ""} onChange={(e) => setProp((p: TeamCardProps) => { p.role = e.target.value; })} className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" placeholder="Role / Title" />
        <input type="text" value={imageUrl || ""} onChange={(e) => setProp((p: TeamCardProps) => { p.imageUrl = e.target.value; })} className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" placeholder="Photo URL" />
        <textarea value={bio || ""} onChange={(e) => setProp((p: TeamCardProps) => { p.bio = e.target.value; })} className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700 min-h-[60px]" placeholder="Short Bio" />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Social Links</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {["twitter", "linkedin", "facebook", "instagram", "email"].map(platform => {
            const hasIt = socials?.find(s => s.platform === platform);
            return (
              <button 
                key={platform}
                onClick={() => hasIt ? removeSocial(platform) : addSocial(platform)}
                className={`px-2 py-1 text-[10px] uppercase font-bold rounded ${hasIt ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                {platform}
              </button>
            )
          })}
        </div>
        {socials && socials.map((social, index) => (
          <div key={social.platform} className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-2 text-[10px] font-bold text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[60px] uppercase">{social.platform}</div>
            <input type="text" value={social.url} onChange={(e) => updateSocial(index, e.target.value)} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" placeholder="URL" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Layout & Style</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Layout</div>
            <select value={layout || "vertical"} onChange={(e) => setProp((p: TeamCardProps) => { p.layout = e.target.value as any; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700">
              <option value="vertical">Vertical</option>
              <option value="horizontal">Horizontal</option>
            </select>
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Align</div>
            <select value={align || "center"} onChange={(e) => setProp((p: TeamCardProps) => { p.align = e.target.value as any; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700">
              <option value="left">Left</option>
              <option value="center">Center</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">BG</div>
            <input type="color" value={backgroundColor || "#ffffff"} onChange={(e) => setProp((p: TeamCardProps) => { p.backgroundColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Text</div>
            <input type="color" value={textColor || "#111827"} onChange={(e) => setProp((p: TeamCardProps) => { p.textColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Accent</div>
            <input type="color" value={accentColor || "#0066FF"} onChange={(e) => setProp((p: TeamCardProps) => { p.accentColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Radius</div>
            <input type="number" value={borderRadius || 16} onChange={(e) => setProp((p: TeamCardProps) => { p.borderRadius = parseInt(e.target.value) || 0; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const TeamCard = ({ 
  name = "Dr. Sarah Jenkins",
  role = "Lead Specialist",
  bio = "Dr. Jenkins has over 15 years of experience in specialized care, focusing on patient-centered outcomes.",
  imageUrl = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&q=80",
  socials = [
    { platform: "linkedin", url: "#" },
    { platform: "twitter", url: "#" }
  ],
  layout = "vertical",
  align = "center",
  backgroundColor = "#ffffff",
  textColor = "#111827",
  accentColor = "#0066FF",
  borderRadius = 16
}: TeamCardProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const getIcon = (platform: string) => {
    switch(platform) {
      case "facebook": return <FaFacebook size={18} />;
      case "twitter": return <FaTwitter size={18} />;
      case "linkedin": return <FaLinkedin size={18} />;
      case "instagram": return <FaInstagram size={18} />;
      case "email": return <Mail size={18} />;
      default: return null;
    }
  };

  const isHoriz = layout === "horizontal";
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className={`w-full group overflow-hidden border border-[#E5E5E5] shadow-sm hover:shadow-md transition-shadow flex ${isHoriz ? 'flex-col sm:flex-row' : 'flex-col'}`}
      style={{ 
        backgroundColor, 
        color: textColor,
        borderRadius: `${borderRadius}px`,
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "2px", 
        transition: "outline 0.15s, box-shadow 0.3s"
      }}
    >
      <div className={`overflow-hidden ${isHoriz ? 'w-full sm:w-2/5 aspect-[4/5]' : 'w-full aspect-square'} shrink-0 relative`}>
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center font-bold text-3xl opacity-30">
            {name.charAt(0)}
          </div>
        )}
        
        {/* Socials overlay on image for vertical layout if centered */}
        {!isHoriz && align === "center" && socials && socials.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center gap-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            {socials.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-900 hover:bg-gray-100 hover:scale-110 transition-transform">
                {getIcon(s.platform)}
              </a>
            ))}
          </div>
        )}
      </div>

      <div className={`p-6 flex flex-col justify-center flex-1 ${alignClass}`}>
        <h4 className="text-xl font-bold mb-1">{name}</h4>
        <span className="text-sm font-semibold uppercase tracking-wide mb-4" style={{ color: accentColor }}>{role}</span>
        
        <p className="text-sm opacity-80 leading-relaxed mb-6">{bio}</p>
        
        {/* Inline Socials for horizontal or left-aligned */}
        {(isHoriz || align === "left") && socials && socials.length > 0 && (
          <div className="flex gap-3 mt-auto">
            {socials.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 hover:-translate-y-1 transition-all" style={{ color: textColor }}>
                {getIcon(s.platform)}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

TeamCard.craft = {
  displayName: "Team Card",
  props: { 
    name: "Dr. Sarah Jenkins",
    role: "Lead Specialist",
    bio: "Dr. Jenkins has over 15 years of experience in specialized care, focusing on patient-centered outcomes.",
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&q=80",
    socials: [
      { platform: "linkedin", url: "#" },
      { platform: "twitter", url: "#" }
    ],
    layout: "vertical",
    align: "center",
    backgroundColor: "#ffffff",
    textColor: "#111827",
    accentColor: "#0066FF",
    borderRadius: 16
  },
  rules: { canDrag: () => true },
  related: { settings: TeamCardSettings },
};
