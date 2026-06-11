"use client";

import React, { useState, useEffect, useRef } from "react";
import { Editor as CraftEditor, Frame, Element, useEditor } from "@craftjs/core";
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
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
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

          <div className="flex-1 flex flex-col overflow-hidden relative builder-canvas-wrapper">
            <div className="flex-1 overflow-auto flex justify-center pt-8 pb-32 px-6">
              <div 
                className="flex flex-col bg-[#111827] shadow-2xl transition-all duration-300 origin-top mx-auto builder-canvas-frame"
                style={{
                  width: deviceMode === "mobile" ? "375px" : "100%",
                  maxWidth: deviceMode === "mobile" ? "375px" : "1200px",
                  minHeight: "800px",
                }}
              >
                <div className="flex-1 w-full relative overflow-hidden bg-white">
                  <Frame data={data || undefined}>
                    <Element is={Container} padding={60} background="#ffffff" canvas>
                      <Text text="Welcome to Bookin Builder" fontSize={48} fontWeight="700" textAlign="center" color="#111827" />
                      <div style={{ height: "16px" }} />
                      <Text text="Drag elements from the left panel to build your site." fontSize={18} textAlign="center" color="#6B7280" />
                    </Element>
                  </Frame>
                </div>
              </div>
            </div>
            
            {!previewMode && <BottomToolbar saveStatus={saveStatus} />}
          </div>

          {!previewMode && <SettingsPanel />}
        </div>
      </CraftEditor>
    </div>
  );
};
