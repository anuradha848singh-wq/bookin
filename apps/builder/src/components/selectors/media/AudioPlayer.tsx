"use client";

import React, { useRef, useState, useEffect } from "react";
import { useNode } from "@craftjs/core";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";

interface AudioPlayerProps {
  url?: string;
  title?: string;
  author?: string;
  coverImage?: string;
  autoPlay?: boolean;
  loop?: boolean;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  borderRadius?: number;
}

export const AudioPlayerSettings = () => {
  const { actions: { setProp }, url, title, author, coverImage, autoPlay, loop, backgroundColor, textColor, accentColor, borderRadius } = useNode((node) => ({
    url: node.data.props.url,
    title: node.data.props.title,
    author: node.data.props.author,
    coverImage: node.data.props.coverImage,
    autoPlay: node.data.props.autoPlay,
    loop: node.data.props.loop,
    backgroundColor: node.data.props.backgroundColor,
    textColor: node.data.props.textColor,
    accentColor: node.data.props.accentColor,
    borderRadius: node.data.props.borderRadius,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Audio Source</label>
        <input 
          type="text" 
          value={url || ""} 
          onChange={(e) => setProp((p: AudioPlayerProps) => { p.url = e.target.value; })} 
          className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" 
          placeholder="MP3 or Audio URL"
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Track Info</label>
        <input 
          type="text" 
          value={title || ""} 
          onChange={(e) => setProp((p: AudioPlayerProps) => { p.title = e.target.value; })} 
          className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" 
          placeholder="Track Title"
        />
        <input 
          type="text" 
          value={author || ""} 
          onChange={(e) => setProp((p: AudioPlayerProps) => { p.author = e.target.value; })} 
          className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" 
          placeholder="Author / Artist"
        />
        <input 
          type="text" 
          value={coverImage || ""} 
          onChange={(e) => setProp((p: AudioPlayerProps) => { p.coverImage = e.target.value; })} 
          className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" 
          placeholder="Cover Image URL (Optional)"
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Colors & Style</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">BG</div>
            <input type="color" value={backgroundColor || "#111827"} onChange={(e) => setProp((p: AudioPlayerProps) => { p.backgroundColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Text</div>
            <input type="color" value={textColor || "#ffffff"} onChange={(e) => setProp((p: AudioPlayerProps) => { p.textColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Accent</div>
            <input type="color" value={accentColor || "#3b82f6"} onChange={(e) => setProp((p: AudioPlayerProps) => { p.accentColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Rad</div>
            <input 
              type="number" 
              value={borderRadius || 12} 
              onChange={(e) => setProp((p: AudioPlayerProps) => { p.borderRadius = parseInt(e.target.value) || 0; })} 
              className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Playback Options</label>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 text-[12px] text-gray-700 cursor-pointer">
            <input 
              type="checkbox" 
              checked={autoPlay} 
              onChange={(e) => setProp((p: AudioPlayerProps) => { p.autoPlay = e.target.checked; })}
              className="rounded border-gray-300 text-blue-600"
            />
            AutoPlay
          </label>
          <label className="flex items-center gap-2 text-[12px] text-gray-700 cursor-pointer">
            <input 
              type="checkbox" 
              checked={loop} 
              onChange={(e) => setProp((p: AudioPlayerProps) => { p.loop = e.target.checked; })}
              className="rounded border-gray-300 text-blue-600"
            />
            Loop
          </label>
        </div>
      </div>
    </div>
  );
};

export const AudioPlayer = ({ 
  url = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  title = "Welcome Podcast",
  author = "Dr. Smith",
  coverImage = "",
  autoPlay = false,
  loop = false,
  backgroundColor = "#111827",
  textColor = "#ffffff",
  accentColor = "#3b82f6",
  borderRadius = 12
}: AudioPlayerProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Don't autoplay in editor
    if (autoPlay && !isSelected && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Autoplay prevented:", e));
      setIsPlaying(true);
    }
  }, [autoPlay, isSelected]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className="w-full flex items-center p-4 shadow-lg overflow-hidden relative"
      style={{ 
        backgroundColor, 
        color: textColor,
        borderRadius: `${borderRadius}px`,
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "2px", 
        transition: "outline 0.15s"
      }}
    >
      {/* Background blur if cover image exists */}
      {coverImage && (
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: `url(${coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(10px)' }}
        />
      )}

      <div className="relative z-10 flex w-full gap-4 items-center">
        {/* Cover Art */}
        <div 
          className="w-16 h-16 shrink-0 rounded-lg overflow-hidden flex items-center justify-center bg-white/10 shadow-inner"
        >
          {coverImage ? (
            <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <Music size={24} style={{ color: textColor }} className="opacity-50" />
          )}
        </div>

        {/* Player Controls & Info */}
        <div className="flex-1 flex flex-col justify-center min-w-0">
          <div className="flex justify-between items-end mb-1">
            <div className="truncate pr-4">
              <h4 className="font-bold text-sm truncate">{title}</h4>
              <p className="text-xs opacity-70 truncate">{author}</p>
            </div>
            <span className="text-[10px] font-medium opacity-60 tabular-nums shrink-0">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="group relative w-full h-2 bg-black/20 rounded-full mt-1 cursor-pointer overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full transition-all ease-linear"
              style={{ width: `${(currentTime / (duration || 1)) * 100}%`, backgroundColor: accentColor }}
            />
            <input 
              type="range" 
              min={0} 
              max={duration || 100} 
              value={currentTime} 
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-4 mt-3">
            <button 
              onClick={togglePlay}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110 shadow-md"
              style={{ backgroundColor: accentColor }}
            >
              {isPlaying ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" className="ml-0.5" />}
            </button>
            
            <button onClick={toggleMute} className="opacity-60 hover:opacity-100 transition-opacity ml-auto">
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
        </div>
      </div>

      <audio 
        ref={audioRef}
        src={url}
        loop={loop}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};

AudioPlayer.craft = {
  displayName: "Audio Player",
  props: { 
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    title: "Welcome Podcast",
    author: "Dr. Smith",
    coverImage: "",
    autoPlay: false,
    loop: false,
    backgroundColor: "#111827",
    textColor: "#ffffff",
    accentColor: "#3b82f6",
    borderRadius: 12
  },
  rules: { canDrag: () => true },
  related: { settings: AudioPlayerSettings },
};
