# Developer Guide - Bookin Website Builder

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Basic knowledge of React, Next.js, and TypeScript

### Installation

```bash
# Navigate to builder app
cd apps/builder

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Access the builder at: `http://localhost:4000`

### Build for Production

```bash
pnpm build
pnpm start
```

## 📁 Project Structure

```
apps/builder/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── BuilderClient.tsx   # Main builder component
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Entry point
│   │   └── globals.css         # Global styles
│   └── components/
│       ├── editor/             # Editor UI components
│       │   ├── Topbar.tsx
│       │   ├── Rail.tsx
│       │   ├── LeftPanel.tsx
│       │   ├── SettingsPanel.tsx
│       │   ├── ThemePanel.tsx
│       │   ├── MediaPanel.tsx
│       │   ├── FormsPanel.tsx
│       │   ├── BookingsPanel.tsx
│       │   ├── SEOPanel.tsx
│       │   └── LayersPanel.tsx
│       └── selectors/          # Draggable components
│           ├── Container.tsx
│           ├── Text.tsx
│           ├── Button.tsx
│           ├── Image.tsx
│           ├── HeroSection.tsx
│           ├── ServicesGrid.tsx
│           ├── ServiceShowcase.tsx
│           ├── StaffShowcase.tsx
│           ├── Footer.tsx
│           └── Connectors.tsx
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
└── tailwind.config.js
```

## 🧩 Core Concepts

### CraftJS Integration

CraftJS is the drag-and-drop engine. Key concepts:

#### 1. Editor Component
Wraps the entire builder:

```tsx
<Editor resolver={{ Component1, Component2, ... }}>
  {/* Your builder UI */}
</Editor>
```

#### 2. Frame Component
Defines the canvas area:

```tsx
<Frame>
  <Element is={Container} canvas>
    {/* Initial content */}
  </Element>
</Frame>
```

#### 3. Element Component
Makes components draggable:

```tsx
<Element is={MyComponent} prop1="value" canvas />
```

#### 4. useNode Hook
Access node state and connectors:

```tsx
const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
  isSelected: state.events.selected,
}));
```

#### 5. useEditor Hook
Access editor state and actions:

```tsx
const { actions, query } = useEditor();
```

## 🎨 Creating a New Component

### Step 1: Create Component File

```tsx
// src/components/selectors/MyComponent.tsx
"use client";

import React from "react";
import { useNode } from "@craftjs/core";

interface MyComponentProps {
  text?: string;
  color?: string;
}

export const MyComponentSettings = () => {
  const { actions: { setProp }, text, color } = useNode((node) => ({
    text: node.data.props.text,
    color: node.data.props.color,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase">
          Text
        </label>
        <input 
          type="text" 
          value={text} 
          onChange={(e) => setProp((p: MyComponentProps) => { 
            p.text = e.target.value; 
          })} 
          className="w-full border border-[#E5E5E5] rounded px-2 py-1.5"
        />
      </div>
      
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase">
          Color
        </label>
        <input 
          type="color" 
          value={color} 
          onChange={(e) => setProp((p: MyComponentProps) => { 
            p.color = e.target.value; 
          })} 
        />
      </div>
    </div>
  );
};

export const MyComponent = ({ 
  text = "Hello World", 
  color = "#000000" 
}: MyComponentProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{ 
        color,
        outline: isSelected ? "2px solid #0066FF" : "none",
        padding: "10px"
      }}
    >
      {text}
    </div>
  );
};

MyComponent.craft = {
  displayName: "My Component",
  props: { text: "Hello World", color: "#000000" },
  rules: { canDrag: () => true },
  related: { settings: MyComponentSettings },
};
```

### Step 2: Register in BuilderClient

```tsx
// src/app/BuilderClient.tsx
import { MyComponent } from "@/components/selectors/MyComponent";

export default function BuilderClient() {
  return (
    <Editor resolver={{ 
      // ... other components
      MyComponent 
    }}>
      {/* ... */}
    </Editor>
  );
}
```

### Step 3: Add to LeftPanel

```tsx
// src/components/editor/LeftPanel.tsx
import { MyComponent } from "../selectors/MyComponent";

// In the sections panel:
<div 
  ref={(ref) => { 
    connectors.create(ref as HTMLElement, <Element is={MyComponent} canvas />); 
  }}
  className="cursor-grab hover:border-black"
>
  My Component
</div>
```

## 🎛️ Component Patterns

### Pattern 1: Simple Component

```tsx
export const SimpleComponent = ({ text }: { text?: string }) => {
  const { connectors: { connect, drag } } = useNode();
  
  return (
    <div ref={(ref) => connect(drag(ref as HTMLElement))}>
      {text}
    </div>
  );
};

SimpleComponent.craft = {
  displayName: "Simple",
  props: { text: "Default" },
};
```

### Pattern 2: Container Component

```tsx
export const ContainerComponent = ({ children }: { children?: React.ReactNode }) => {
  const { connectors: { connect, drag } } = useNode();
  
  return (
    <div ref={(ref) => connect(drag(ref as HTMLElement))}>
      {children}
    </div>
  );
};

ContainerComponent.craft = {
  displayName: "Container",
  props: {},
  rules: { canDrag: () => true },
};
```

### Pattern 3: Nested Elements

```tsx
import { Element } from "@craftjs/core";

export const NestedComponent = () => {
  const { connectors: { connect, drag } } = useNode();
  
  return (
    <div ref={(ref) => connect(drag(ref as HTMLElement))}>
      <Element id="header" is={Container} canvas>
        <Text text="Header" />
      </Element>
      <Element id="body" is={Container} canvas>
        <Text text="Body" />
      </Element>
    </div>
  );
};
```

## 🔧 Common Tasks

### Adding a New Panel

1. Create panel component:

```tsx
// src/components/editor/MyPanel.tsx
"use client";

import React from "react";

export const MyPanel = () => {
  return (
    <div className="flex-1 overflow-y-auto py-4 px-3">
      {/* Panel content */}
    </div>
  );
};
```

2. Import in LeftPanel:

```tsx
import { MyPanel } from "./MyPanel";
```

3. Add conditional render:

```tsx
if (activeTab === "mypanel") {
  return (
    <div className="w-[240px] h-full bg-white border-r border-[#E5E5E5] flex flex-col">
      <div className="h-[48px] px-4 border-b border-[#E5E5E5] flex items-center">
        <span className="text-[12px] font-semibold">My Panel</span>
      </div>
      <MyPanel />
    </div>
  );
}
```

4. Add to Rail:

```tsx
const railItems = [
  // ... existing items
  { id: "mypanel", icon: <Icon size={18} />, label: "My Panel" },
];
```

### Accessing Editor State

```tsx
const { actions, query, enabled } = useEditor((state, query) => ({
  enabled: state.options.enabled,
}));

// Get all nodes
const nodes = query.getNodes();

// Get specific node
const node = query.node(nodeId).get();

// Serialize to JSON
const json = query.serialize();

// Deserialize from JSON
actions.deserialize(json);
```

### Programmatic Node Manipulation

```tsx
const { actions } = useEditor();

// Add node
actions.add(<MyComponent />, parentNodeId);

// Delete node
actions.delete(nodeId);

// Move node
actions.move(nodeId, newParentId, index);

// Update props
actions.setProp(nodeId, (props) => {
  props.text = "New text";
});

// Select node
actions.selectNode(nodeId);

// Clear selection
actions.clearEvents();
```

### Custom Hooks

```tsx
// useBuilderState.ts
import { useEditor } from "@craftjs/core";

export const useBuilderState = () => {
  const { query, actions } = useEditor();
  
  const exportJSON = () => {
    return query.serialize();
  };
  
  const importJSON = (json: string) => {
    actions.deserialize(json);
  };
  
  return { exportJSON, importJSON };
};
```

## 🎨 Styling Guidelines

### Tailwind Classes

Use consistent Tailwind classes:

```tsx
// Borders
border border-[#E5E5E5]

// Backgrounds
bg-white
bg-[#FAFAFA]
bg-gray-50

// Text
text-[11px] font-semibold text-gray-500 uppercase tracking-wide
text-[12px] font-medium text-gray-800

// Spacing
gap-2 gap-3 gap-4 gap-6
p-2 p-3 p-4 px-3 py-2

// Rounded
rounded rounded-md rounded-lg rounded-full

// Hover
hover:bg-gray-50 hover:border-black

// Transitions
transition-all transition-colors
```

### Custom Styles

For dynamic styles, use inline styles:

```tsx
<div style={{ 
  backgroundColor: props.background,
  padding: `${props.padding}px`,
  outline: isSelected ? "2px solid #0066FF" : "none"
}}>
```

## 🧪 Testing

### Component Testing

```tsx
import { render } from "@testing-library/react";
import { Editor, Frame } from "@craftjs/core";
import { MyComponent } from "./MyComponent";

test("renders component", () => {
  const { getByText } = render(
    <Editor resolver={{ MyComponent }}>
      <Frame>
        <MyComponent text="Test" />
      </Frame>
    </Editor>
  );
  
  expect(getByText("Test")).toBeInTheDocument();
});
```

### Integration Testing

```tsx
test("drag and drop works", () => {
  // Test drag and drop functionality
  // Use @testing-library/user-event for interactions
});
```

## 🔌 Backend Integration

### Saving Designs

```tsx
const saveDesign = async () => {
  const json = query.serialize();
  
  await fetch("/api/designs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pageId: currentPageId,
      design: json,
    }),
  });
};
```

### Loading Designs

```tsx
const loadDesign = async (pageId: string) => {
  const response = await fetch(`/api/designs/${pageId}`);
  const { design } = await response.json();
  
  actions.deserialize(design);
};
```

### Publishing

```tsx
const publishSite = async () => {
  const json = query.serialize();
  
  // Convert to static HTML/CSS
  const html = generateHTML(json);
  const css = generateCSS(json);
  
  await fetch("/api/publish", {
    method: "POST",
    body: JSON.stringify({ html, css }),
  });
};
```

## 🐛 Debugging

### Enable CraftJS Debug Mode

```tsx
<Editor 
  resolver={resolver}
  enabled={true}
  indicator={{
    success: "#22c55e",
    error: "#ef4444",
  }}
>
```

### Console Logging

```tsx
// Log all nodes
console.log(query.getNodes());

// Log selected node
const selectedNodeId = query.getEvent("selected").first();
console.log(query.node(selectedNodeId).get());

// Log serialized state
console.log(query.serialize());
```

### React DevTools

Install React DevTools browser extension to inspect component tree and props.

## 📦 Dependencies

### Core
- `@craftjs/core` - Drag and drop engine
- `@craftjs/layers` - Layer management
- `@craftjs/utils` - Utility functions
- `next` - React framework
- `react` - UI library
- `react-dom` - React DOM renderer

### UI
- `tailwindcss` - Utility-first CSS
- `lucide-react` - Icon library
- `lzutf8` - Compression for serialization

### Dev
- `typescript` - Type safety
- `eslint` - Code linting
- `@types/*` - TypeScript definitions

## 🚀 Performance Optimization

### Code Splitting

```tsx
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <div>Loading...</div>,
});
```

### Memoization

```tsx
import { memo } from "react";

export const MyComponent = memo(({ text }: { text: string }) => {
  return <div>{text}</div>;
});
```

### Lazy Loading

```tsx
import { lazy, Suspense } from "react";

const LazyComponent = lazy(() => import("./LazyComponent"));

<Suspense fallback={<div>Loading...</div>}>
  <LazyComponent />
</Suspense>
```

## 📚 Resources

- [CraftJS Documentation](https://craft.js.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

### Code Style
- Use TypeScript for all new files
- Follow existing naming conventions
- Add JSDoc comments for complex functions
- Use Prettier for formatting
- Run ESLint before committing

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add new component"

# Push and create PR
git push origin feature/my-feature
```

### Commit Messages
Follow conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code restructuring
- `test:` - Tests
- `chore:` - Maintenance

## 🆘 Troubleshooting

### Common Issues

**Issue**: Components not draggable
```tsx
// Ensure you're using connectors correctly
const { connectors: { connect, drag } } = useNode();
ref={(ref) => connect(drag(ref as HTMLElement))}
```

**Issue**: Settings not updating
```tsx
// Make sure to use setProp correctly
onChange={(e) => setProp((props: MyProps) => {
  props.value = e.target.value;
})}
```

**Issue**: TypeScript errors
```bash
# Regenerate types
pnpm run typecheck
```

**Issue**: Build fails
```bash
# Clear cache and rebuild
rm -rf .next
pnpm build
```

## 📞 Support

For questions or issues:
1. Check this guide
2. Review CraftJS documentation
3. Check existing GitHub issues
4. Contact the development team

---

**Happy Building! 🚀**
