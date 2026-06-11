"use client";

import React, { useState, useEffect } from "react";
import { Editor, Frame, Element, useEditor } from "@craftjs/core";
import { Topbar } from "@/components/editor/Topbar";
import { Rail } from "@/components/editor/Rail";
import { LeftPanel } from "@/components/editor/LeftPanel";
import { SettingsPanel } from "@/components/editor/SettingsPanel";
import { KeyboardShortcutsOverlay } from "@/components/editor/KeyboardShortcutsOverlay";
import { Breakpoint, getBreakpointMaxWidth } from "@/components/editor/BreakpointSwitcher";
import { RenderNode } from "@/components/editor/RenderNode";
import { Container } from "@/components/selectors/structure/Container";
import { Text } from "@/components/selectors/content/Text";
import { Heading } from "@/components/selectors/content/Heading";
import { Button } from "@/components/selectors/content/Button";
import { Image } from "@/components/selectors/media/Image";
import { Divider } from "@/components/selectors/content/Divider";
import { Spacer } from "@/components/selectors/content/Spacer";
import { HeroSection } from "@/components/selectors/structure/HeroSection";
import { ServicesGrid } from "@/components/selectors/structure/ServicesGrid";
import { ServiceShowcase } from "@/components/selectors/connectors/ServiceShowcase";
import { StaffShowcase } from "@/components/selectors/connectors/StaffShowcase";
import { Footer } from "@/components/selectors/structure/Footer";
import { BookingWidgetConnector, CRMFormConnector } from "@/components/selectors/connectors/Connectors";
import { Link } from "@/components/selectors/content/Link";
import { Icon } from "@/components/selectors/media/Icon";
import { VideoEmbed } from "@/components/selectors/media/VideoEmbed";
import { Quote } from "@/components/selectors/content/Quote";
import { List } from "@/components/selectors/content/List";
import { Badge } from "@/components/selectors/content/Badge";
import { ProgressBar } from "@/components/selectors/content/ProgressBar";
import { Map } from "@/components/selectors/content/Map";
import { SocialEmbed } from "@/components/selectors/social/SocialEmbed";
import { Table } from "@/components/selectors/content/Table";
import { ResponsiveGrid } from "@/components/selectors/structure/ResponsiveGrid";
import { ResponsiveNav } from "@/components/selectors/navigation/ResponsiveNav";
import { Header } from "@/components/selectors/navigation/Header";
import { MegaMenu } from "@/components/selectors/navigation/MegaMenu";
import { BuilderSidebar } from "@/components/selectors/navigation/BuilderSidebar";
import { BreadcrumbTrail } from "@/components/selectors/navigation/BreadcrumbTrail";
import { ScrollProgress } from "@/components/selectors/navigation/ScrollProgress";
import { Accordion } from "@/components/selectors/content/Accordion";
import { Tabs } from "@/components/selectors/content/Tabs";
import { Carousel } from "@/components/selectors/content/Carousel";
import { Modal } from "@/components/selectors/content/Modal";
import { Tooltip } from "@/components/selectors/content/Tooltip";
import { Popover } from "@/components/selectors/content/Popover";
import { Alert } from "@/components/selectors/content/Alert";
import { Card } from "@/components/selectors/content/Card";
import { Timeline } from "@/components/selectors/content/Timeline";
import { Countdown } from "@/components/selectors/content/Countdown";
import { ImageGallery } from "@/components/selectors/media/ImageGallery";
import { AdvancedVideo } from "@/components/selectors/media/AdvancedVideo";
import { AudioPlayer } from "@/components/selectors/media/AudioPlayer";
import { HtmlEmbed } from "@/components/selectors/advanced/HtmlEmbed";
import { Repeater } from "@/components/selectors/advanced/Repeater";
import { ProductGrid } from "@/components/selectors/ecommerce/ProductGrid";
import { CartWidget } from "@/components/selectors/ecommerce/CartWidget";
import { AuthForm } from "@/components/selectors/auth/AuthForm";
import { UserMenu } from "@/components/selectors/auth/UserMenu";
import { BackgroundVideo } from "@/components/selectors/media/BackgroundVideo";
import { ImageComparison } from "@/components/selectors/media/ImageComparison";
import { ShareButtons } from "@/components/selectors/social/ShareButtons";
import { SocialFeed } from "@/components/selectors/social/SocialFeed";
import { SocialProof } from "@/components/selectors/social/SocialProof";
import { RatingStars } from "@/components/selectors/social/RatingStars";
import { SocialLoginBlocks } from "@/components/selectors/social/SocialLoginBlocks";
import { PricingTable } from "@/components/selectors/business/PricingTable";
import { FeatureComparison } from "@/components/selectors/business/FeatureComparison";
import { TeamCard } from "@/components/selectors/business/TeamCard";
import { TestimonialSlider } from "@/components/selectors/business/TestimonialSlider";
import { LogoCloud } from "@/components/selectors/business/LogoCloud";
import { StatsCounter } from "@/components/selectors/business/StatsCounter";
import { CallToAction } from "@/components/selectors/business/CallToAction";
import { NewsletterSignup } from "@/components/selectors/business/NewsletterSignup";
import { ContactInfo } from "@/components/selectors/business/ContactInfo";
import { BusinessHours } from "@/components/selectors/business/BusinessHours";
import { ContactForm } from "@/components/selectors/forms/ContactForm";
import { MultiStepForm, StepContainer } from "@/components/selectors/forms/MultiStepForm";
import { FileUpload } from "@/components/selectors/forms/FileUpload";
import { DatePicker } from "@/components/selectors/forms/DatePicker";
import { TimePicker } from "@/components/selectors/forms/TimePicker";
import { SelectDropdown } from "@/components/selectors/forms/SelectDropdown";
import { RadioGroup } from "@/components/selectors/forms/RadioGroup";
import { CheckboxGroup } from "@/components/selectors/forms/CheckboxGroup";
import { RangeSlider } from "@/components/selectors/forms/RangeSlider";
import { FormSubmitButton } from "@/components/selectors/forms/FormSubmitButton";

// Keyboard shortcuts handler component
const KeyboardShortcuts = () => {
  const { actions, query, selected } = useEditor((state, query) => {
    const [currentNodeId] = state.events.selected;
    return {
      selected: currentNodeId ? {
        id: currentNodeId,
        isDeletable: query.node(currentNodeId).isDeletable(),
      } : null,
    };
  });

  // Clipboard state
  const [clipboard, setClipboard] = useState<any>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // Ctrl/Cmd + Z = Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (query.history.canUndo()) {
          actions.history.undo();
        }
      }

      // Ctrl/Cmd + Shift + Z = Redo (or Ctrl+Y)
      if (((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) || 
          ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
        e.preventDefault();
        if (query.history.canRedo()) {
          actions.history.redo();
        }
      }

      // Ctrl/Cmd + D = Duplicate
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        if (selected) {
          try {
            const node = query.node(selected.id).toSerializedNode();
            const parentId = query.node(selected.id).get().data.parent || 'ROOT';
            actions.add(query.parseSerializedNode(node).toNode(), parentId);
          } catch (error) {
            console.error('Failed to duplicate:', error);
          }
        }
      }

      // Ctrl/Cmd + C = Copy
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        if (selected) {
          try {
            const node = query.node(selected.id).toSerializedNode();
            setClipboard(node);
            console.log('Component copied to clipboard');
          } catch (error) {
            console.error('Failed to copy:', error);
          }
        }
      }

      // Ctrl/Cmd + X = Cut
      if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
        e.preventDefault();
        if (selected && selected.isDeletable) {
          try {
            const node = query.node(selected.id).toSerializedNode();
            setClipboard(node);
            actions.delete(selected.id);
            console.log('Component cut to clipboard');
          } catch (error) {
            console.error('Failed to cut:', error);
          }
        }
      }

      // Ctrl/Cmd + V = Paste
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        if (clipboard) {
          try {
            const parentId = selected ? selected.id : 'ROOT';
            // Check if the selected node can have children
            const canHaveChildren = selected ? query.node(selected.id).isCanvas() : true;
            const targetParent = canHaveChildren ? parentId : (selected ? query.node(selected.id).get().data.parent : 'ROOT');
            actions.add(query.parseSerializedNode(clipboard).toNode(), targetParent || 'ROOT');
            console.log('Component pasted from clipboard');
          } catch (error) {
            console.error('Failed to paste:', error);
          }
        }
      }

      // Ctrl/Cmd + A = Select All (select root for now)
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        // Select the root container
        const nodes = query.getSerializedNodes();
        const rootNodes = Object.keys(nodes).filter(id => {
          const node = query.node(id).get();
          return node.data.parent === 'ROOT';
        });
        if (rootNodes.length > 0) {
          actions.selectNode(rootNodes[0]);
        }
      }

      // Ctrl/Cmd + S = Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const json = query.serialize();
        localStorage.setItem('bookin-builder-design', json);
        localStorage.setItem('bookin-builder-last-save', new Date().toISOString());
        console.log('Design saved to localStorage');
        
        // Find the pageId from state (it's slightly tricky to get from here unless passed down)
        // Since KeyboardShortcuts doesn't have pageId, we'll let the manual Save button or AutoSave handle the DB part,
        // or we can just rely on localStorage until the Topbar manual save is clicked.
        // Actually, we can just trigger a custom event that Topbar listens to.
        window.dispatchEvent(new CustomEvent('builder-manual-save'));
      }

      // Delete/Backspace = Delete selected
      if ((e.key === 'Delete' || e.key === 'Backspace') && selected && selected.isDeletable) {
        e.preventDefault();
        actions.delete(selected.id);
      }

      // Escape = Deselect
      if (e.key === 'Escape') {
        actions.clearEvents();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actions, query, selected, clipboard]);

  return null;
};

// Auto-save component
const AutoSave = ({ websiteId, pageSlug, onSavingChange }: { websiteId: string, pageSlug: string, onSavingChange?: (saving: boolean) => void }) => {
  const { query } = useEditor();

  useEffect(() => {
    if (!websiteId) return;
    
    const interval = setInterval(async () => {
      const json = query.serialize();
      
      // Save to localStorage as fallback
      localStorage.setItem('bookin-builder-design', json);
      localStorage.setItem('bookin-builder-last-save', new Date().toISOString());

      if (onSavingChange) onSavingChange(true);
      try {
        await fetch(`/api/studio/save`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: json, websiteSlug: websiteId, pageSlug })
        });
      } catch (e) {
        console.error("AutoSave to DB failed:", e);
      } finally {
        if (onSavingChange) onSavingChange(false);
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(interval);
  }, [query, websiteId, pageSlug, onSavingChange]);

  return null;
};

// Load saved design component
const LoadSavedDesign = ({ websiteId, pageSlug }: { websiteId: string, pageSlug: string }) => {
  const { actions } = useEditor();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!websiteId || loaded) return;
    
    const loadDesign = async () => {
      try {
        const res = await fetch(`/api/studio/load?slug=${websiteId}&page=${pageSlug}`);
        const data = await res.json();
        
        if (data.success && data.content) {
           actions.deserialize(data.content);
           console.log("Loaded design from DB");
           setLoaded(true);
           return;
        }
      } catch (e) {
        console.error("Failed to load from DB, falling back to localStorage", e);
      }

      const saved = localStorage.getItem('bookin-builder-design');
      if (saved) {
        try {
          actions.deserialize(saved);
          console.log('Loaded saved design from localStorage');
        } catch (error) {
          console.error('Failed to load saved design:', error);
        }
      }
      setLoaded(true);
    };

    loadDesign();
  }, [actions, websiteId, pageSlug, loaded]);

  return null;
};

export default function BuilderClient({ websiteId }: { websiteId: string }) {
  const [activeTab, setActiveTab] = useState("sections");
  const [zoom, setZoom] = useState(100);
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");
  const [isSaving, setIsSaving] = useState(false);
  const [activeSlug, setActiveSlug] = useState("home");
  const [previewMode, setPreviewMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved" | "error">("saved");

  const deviceMode = breakpoint === "mobile" ? "mobile" : (breakpoint as any === "tablet" ? "tablet" : "desktop");
  const setDeviceMode = (mode: "desktop" | "tablet" | "mobile") => {
    setBreakpoint(mode as Breakpoint);
  };

  const handleSave = async (content: string) => {
    setSaveStatus("saving");
    const res = await fetch("/api/studio/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, websiteSlug: websiteId, pageSlug: activeSlug }),
    });

    if (!res.ok) {
      setSaveStatus("error");
      throw new Error("Failed to save builder content");
    }

    setSaveStatus("saved");
  };

  const handleLoad = async () => {
    const res = await fetch(`/api/studio/load?slug=${websiteId}&page=${activeSlug}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.success && data.content ? data.content : null;
  };

  return (
    <div className="h-full w-full flex overflow-hidden bg-white text-gray-900 font-sans">
      <Editor resolver={{ 
        Container, 
        Text, 
        Heading,
        Button, 
        Image,
        Divider,
        Spacer,
        HeroSection, 
        ServicesGrid, 
        ServiceShowcase, 
        StaffShowcase, 
        Footer,
        BookingWidgetConnector, 
        CRMFormConnector,
        Link,
        Icon,
        VideoEmbed,
        Quote,
        List,
        Badge,
        ProgressBar,
        Map,
        SocialEmbed,
        Table,
        ResponsiveGrid,
        ResponsiveNav,
        Header,
        MegaMenu,
        BuilderSidebar,
        BreadcrumbTrail,
        ScrollProgress,
        Accordion,
        Tabs,
        Carousel,
        Modal,
        Tooltip,
        Popover,
        Alert,
        Card,
        Timeline,
        Countdown,
        ImageGallery,
        AdvancedVideo,
        AudioPlayer,
        BackgroundVideo,
        ImageComparison,
        ShareButtons,
        SocialFeed,
        SocialProof,
        RatingStars,
        SocialLoginBlocks,
        PricingTable,
        FeatureComparison,
        TeamCard,
        TestimonialSlider,
        LogoCloud,
        StatsCounter,
        CallToAction,
        NewsletterSignup,
        ContactInfo,
        BusinessHours,
        ContactForm,
        MultiStepForm,
        StepContainer,
        FileUpload,
        DatePicker,
        TimePicker,
        SelectDropdown,
        RadioGroup,
        CheckboxGroup,
        RangeSlider,
        FormSubmitButton,
        HtmlEmbed,
        Repeater,
        ProductGrid,
        CartWidget,
        AuthForm,
        UserMenu
      }}
      onRender={RenderNode}
      >
        <KeyboardShortcuts />
        <AutoSave websiteId={websiteId} pageSlug={activeSlug} onSavingChange={(saving) => { setIsSaving(saving); setSaveStatus(saving ? "saving" : "saved"); }} />
        <LoadSavedDesign websiteId={websiteId} pageSlug={activeSlug} />
        <KeyboardShortcutsOverlay />
        
        {/* 1. Far Left Rail */}
        <Rail activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* 2. Left Workspace Panel (Context Aware) */}
        <LeftPanel activeTab={activeTab} activeSlug={activeSlug} onPageSwitch={setActiveSlug} />

        {/* Center Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#FAFAFA] relative">
          
          {/* Floating Topbar */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
            <Topbar
              onSave={handleSave}
              onLoad={handleLoad}
              activeSlug={activeSlug}
              deviceMode={deviceMode}
              setDeviceMode={setDeviceMode}
              previewMode={previewMode}
              setPreviewMode={setPreviewMode}
              saveStatus={saveStatus}
              setSaveStatus={setSaveStatus}
              onOpenPages={() => setActiveTab("pages")}
            />
          </div>
          
          {/* Canvas Wrapper */}
          <div className="flex-1 overflow-auto flex justify-center items-start py-10 px-8">
            <div 
              className="transition-all origin-top mt-16"
              style={{ 
                width: getBreakpointMaxWidth(breakpoint),
                maxWidth: getBreakpointMaxWidth(breakpoint),
                transform: `scale(${zoom / 100})`
              }}
            >
              <div className="bg-white shadow-lg border border-[#E5E5E5] rounded-lg overflow-hidden w-full min-h-[800px] relative">
                {/* Breakpoint Indicator */}
                <div className="absolute top-2 right-2 z-10 bg-black/70 text-white text-xs px-2 py-1 rounded-full font-medium">
                  {breakpoint.charAt(0).toUpperCase() + breakpoint.slice(1)} - {getBreakpointMaxWidth(breakpoint)}
                </div>
                <Frame>
                  <Element is={Container} padding={60} background="#ffffff" canvas>
                    <Heading text="Bookin Site Builder" level="h1" textAlign="center" color="#111827" />
                    <Spacer height={20} />
                    <Text text="Double-click any text to edit inline. Try Ctrl+D to duplicate, Ctrl+S to save!" fontSize={18} textAlign="center" color="#6B7280" />
                    <Spacer height={30} />
                    <Divider />
                  </Element>
                </Frame>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Right Inspector (Content / Design / Advanced tabs) */}
        <div className="w-[320px] bg-white border-l border-[#E5E5E5] flex flex-col flex-shrink-0 z-20">
          <SettingsPanel />
        </div>
      </Editor>
    </div>
  );
}
