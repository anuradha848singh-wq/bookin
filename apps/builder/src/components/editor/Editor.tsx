"use client";

import React, { useState, useEffect, useRef } from "react";
import { Editor as CraftEditor, Frame, Element, useEditor } from "@craftjs/core";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Topbar } from "./Topbar";
import { Rail } from "./Rail";
import { LeftPanel } from "./LeftPanel";
import { SettingsPanel } from "./SettingsPanel";
import { RenderNode } from "./RenderNode";
import { BottomToolbar } from "./BottomToolbar";
import { Container } from "./blocks/Container";
import { Text } from "./blocks/Text";
import { Button } from "./blocks/Button";
import { HeroSection } from "./blocks/HeroSection";
import { ServicesGrid } from "./blocks/ServicesGrid";
import { ServiceShowcase } from "./blocks/ServiceShowcase";
import { StaffShowcase } from "./blocks/StaffShowcase";
import { BookingWidgetConnector, CRMFormConnector } from "./blocks/Connectors";
import { BookingWidgetBlock } from "./blocks/BookingWidgetBlock";
import { FormEmbed } from "./blocks/FormEmbed";
import { Image } from "./blocks/Image";
import { Video } from "./blocks/Video";
import { Divider } from "./blocks/Divider";
import { Spacer } from "./blocks/Spacer";
import { Icon } from "./blocks/Icon";

interface EditorProps {
  initialData?: string | null;
  onSave: (data: string) => Promise<void>;
  onLoad: () => Promise<string | null>;
  activeSlug: string;
  onPageSwitch: (newSlug: string) => void;
}

type SaveStatus = "saved" | "saving" | "unsaved" | "error";

const AutosaveBridge = ({
  enabled,
  initialData,
  onSave,
  onStatusChange,
}: {
  enabled: boolean;
  initialData?: string | null;
  onSave: (data: string) => Promise<void>;
  onStatusChange: (status: SaveStatus) => void;
}) => {
  const { serialized } = useEditor((_, query) => ({
    serialized: query.serialize(),
  }));
  const initialized = useRef(false);
  const lastSaved = useRef(initialData || "");

  useEffect(() => {
    lastSaved.current = initialData || "";
    initialized.current = false;
  }, [initialData]);

  const isSaving = useRef(false);
  const pendingSave = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || !serialized) return;

    if (!initialized.current) {
      initialized.current = true;
      lastSaved.current = initialData || serialized;
      return;
    }

    if (serialized === lastSaved.current) return;
    onStatusChange("unsaved");

    const timer = window.setTimeout(() => {
      pendingSave.current = serialized;

      if (isSaving.current) return;

      const processQueue = async () => {
        while (pendingSave.current) {
          const dataToSave = pendingSave.current;
          pendingSave.current = null;
          isSaving.current = true;
          try {
            onStatusChange("saving");
            await onSave(dataToSave);
            lastSaved.current = dataToSave;
            onStatusChange("saved");
          } catch (err) {
            console.error("Autosave failed", err);
            onStatusChange("error");
          } finally {
            isSaving.current = false;
          }
        }
      };

      processQueue();
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [enabled, initialData, onSave, onStatusChange, serialized]);

  return null;
};

export const Editor = ({ initialData, onSave, onLoad, activeSlug, onPageSwitch }: EditorProps) => {
  const [activeTab, setActiveTab] = useState("add");
  const [data, setData] = useState(initialData);
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [previewMode, setPreviewMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");

  useEffect(() => {
    setData(initialData);
    setSaveStatus("saved");
  }, [initialData]);

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <CraftEditor 
        resolver={{ 
          Container, Text, Button, HeroSection, ServicesGrid, 
          ServiceShowcase, StaffShowcase, BookingWidgetConnector, CRMFormConnector, BookingWidgetBlock, FormEmbed,
          Image, Video, Divider, Spacer, Icon
        }}
        enabled={!previewMode}
        onRender={RenderNode}
      >
        <AutosaveBridge
          enabled={!previewMode}
          initialData={data}
          onSave={onSave}
          onStatusChange={setSaveStatus}
        />

        <Topbar 
          onSave={onSave} 
          onLoad={onLoad} 
          activeSlug={activeSlug} 
          deviceMode={deviceMode} 
          setDeviceMode={setDeviceMode} 
          previewMode={previewMode}
          setPreviewMode={setPreviewMode}
          saveStatus={saveStatus}
          setSaveStatus={setSaveStatus}
          onOpenPages={() => setActiveTab("pages")}
        />

        <div className="flex-1 flex overflow-hidden">
          {!previewMode && <Rail activeTab={activeTab} setActiveTab={setActiveTab} />}
          {!previewMode && <LeftPanel activeTab={activeTab} activeSlug={activeSlug} onPageSwitch={onPageSwitch} />}

          <div className="flex-1 flex flex-col overflow-hidden relative builder-canvas-wrapper" style={{ cursor: "default" }}>
            {/* Top Ruler (Visual) */}
            <div className="absolute top-0 left-0 right-0 h-6 border-b border-[#2C2D33] bg-[#1A1A1E] z-10 flex items-end px-6 overflow-hidden select-none pointer-events-none opacity-50">
              {Array.from({ length: 100 }).map((_, i) => (
                <div key={i} className="h-1 border-l border-gray-600" style={{ width: '100px' }}>
                  <span className="text-[9px] text-gray-500 ml-1 block -mt-4">{i * 100}</span>
                </div>
              ))}
            </div>
            {/* Left Ruler (Visual) */}
            <div className="absolute top-0 left-0 bottom-0 w-6 border-r border-[#2C2D33] bg-[#1A1A1E] z-10 flex flex-col items-end py-6 overflow-hidden select-none pointer-events-none opacity-50">
               {Array.from({ length: 100 }).map((_, i) => (
                <div key={i} className="w-1 border-t border-gray-600" style={{ height: '100px' }}>
                  <span className="text-[9px] text-gray-500 block ml-2 -mt-1">{i * 100}</span>
                </div>
              ))}
            </div>

            <div className="flex-1 w-full h-full relative" id="infinite-canvas-container">
              <TransformWrapper
                initialScale={1}
                minScale={0.1}
                maxScale={4}
                centerOnInit={true}
                limitToBounds={false}
                panning={{ 
                  velocityDisabled: true,
                  activationKeys: [" "] // Hold spacebar to pan, like Figma!
                }}
                wheel={{ step: 0.1 }}
              >
                <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div 
                    className="flex flex-col bg-white shadow-[0_0_0_1px_rgba(255,255,255,0.05),_0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300 mx-auto builder-canvas-frame relative group"
                    style={{
                      width: deviceMode === "mobile" ? "375px" : (deviceMode === "tablet" ? "768px" : "1200px"),
                      minHeight: deviceMode === "mobile" ? "812px" : (deviceMode === "tablet" ? "1024px" : "800px"),
                    }}
                  >
                    {/* Device Label above frame */}
                    <div className="absolute -top-6 left-0 text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      {deviceMode} - {deviceMode === "mobile" ? "375" : (deviceMode === "tablet" ? "768" : "1200")}px
                    </div>
                    
                    <div className="flex-1 w-full h-full relative overflow-visible bg-white" style={{ minHeight: "100%" }}>
                      <Frame data={data || undefined}>
                        <Element is={Container} padding={60} background="#ffffff" canvas>
                          <Text text="Welcome to Bookin Builder" fontSize={48} fontWeight="700" textAlign="center" color="#111827" />
                          <div style={{ height: "16px" }} />
                          <Text text="Drag elements from the left panel to build your site." fontSize={18} textAlign="center" color="#6B7280" />
                        </Element>
                      </Frame>
                    </div>
                  </div>
                </TransformComponent>
                
                {/* Place the toolbar here so it has access to the zoom context, but absolutely position it at the bottom */}
                {!previewMode && (
                  <div className="absolute bottom-0 left-0 right-0 z-50">
                    <BottomToolbar saveStatus={saveStatus} />
                  </div>
                )}
              </TransformWrapper>
            </div>
          </div>

          {!previewMode && <SettingsPanel />}
        </div>
      </CraftEditor>
    </div>
  );
};
