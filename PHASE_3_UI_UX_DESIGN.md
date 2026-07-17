# Phase 3: UI/UX Design

## Kavach AI – Zero-Trust Runtime Security Platform for Autonomous AI Agents

---

## 1. Design System

### 1.1 Design Philosophy

**Principles**:
- **Clarity First**: Information should be immediately understandable
- **Progressive Disclosure**: Show complexity only when needed
- **Visual Hierarchy**: Guide attention to what matters most
- **Motion with Purpose**: Animations should enhance understanding
- **Dark Mode Native**: Designed for dark mode first, light mode secondary

**Inspiration**: Linear, Cursor, Vercel, Arc Browser, OpenAI, Stripe, Cloudflare

### 1.2 Color Palette

**Primary Colors**:
```css
/* Brand Colors */
--brand-primary: #6366f1;      /* Indigo 500 */
--brand-primary-dark: #4f46e5;  /* Indigo 600 */
--brand-primary-light: #818cf8; /* Indigo 400 */

/* Accent Colors */
--accent-success: #10b981;      /* Emerald 500 */
--accent-warning: #f59e0b;     /* Amber 500 */
--accent-error: #ef4444;        /* Red 500 */
--accent-info: #3b82f6;         /* Blue 500 */

/* Risk Levels */
--risk-low: #10b981;            /* Emerald */
--risk-medium: #f59e0b;         /* Amber */
--risk-high: #f97316;           /* Orange */
--risk-critical: #ef4444;       /* Red */

/* Neutral Colors (Dark Mode) */
--bg-primary: #0a0a0f;          /* Nearly black */
--bg-secondary: #111118;        /* Dark gray */
--bg-tertiary: #1a1a24;         /* Lighter gray */
--bg-elevated: #22222e;         /* Elevated surface */

--text-primary: #f5f5f5;       /* White */
--text-secondary: #a1a1aa;      /* Gray 400 */
--text-tertiary: #71717a;       /* Gray 500 */

--border-primary: #27272a;     /* Gray 800 */
--border-secondary: #3f3f46;    /* Gray 700 */

/* Glassmorphism */
--glass-bg: rgba(17, 17, 24, 0.8);
--glass-border: rgba(255, 255, 255, 0.1);
```

**Gradients**:
```css
/* Primary Gradient */
--gradient-primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);

/* Success Gradient */
--gradient-success: linear-gradient(135deg, #10b981 0%, #059669 100%);

/* Warning Gradient */
--gradient-warning: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);

/* Error Gradient */
--gradient-error: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);

/* Background Gradient */
--gradient-bg: radial-gradient(ellipse at top, #1a1a2e 0%, #0a0a0f 100%);
```

### 1.3 Typography

**Font Family**:
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

**Type Scale**:
```css
/* Headings */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
--text-5xl: 3rem;        /* 48px */

/* Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### 1.4 Spacing System

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     96px */
```

### 1.5 Border Radius

```css
--radius-sm: 0.375rem;   /* 6px */
--radius-md: 0.5rem;      /* 8px */
--radius-lg: 0.75rem;     /* 12px */
--radius-xl: 1rem;        /* 16px */
--radius-2xl: 1.5rem;     /* 24px */
--radius-full: 9999px;
```

### 1.6 Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

/* Glowing shadows for emphasis */
--shadow-glow-primary: 0 0 20px rgba(99, 102, 241, 0.3);
--shadow-glow-success: 0 0 20px rgba(16, 185, 129, 0.3);
--shadow-glow-error: 0 0 20px rgba(239, 68, 68, 0.3);
```

### 1.7 Animation System

**Transitions**:
```css
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;
--transition-slower: 500ms ease;
```

**Key Animations**:
```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Scale In */
@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Pulse */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Shimmer */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Glow */
@keyframes glow {
  0%, 100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
  50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.8); }
}
```

---

## 2. Component Library

### 2.1 Core Components

**Button**
```tsx
// Variants: primary, secondary, ghost, danger
// Sizes: sm, md, lg
// States: default, hover, active, disabled, loading

<Button variant="primary" size="md">
  Save Changes
</Button>

<Button variant="danger" size="sm" loading>
  Delete
</Button>
```

**Card**
```tsx
// Glass morphism effect
// Hover elevation
// Border glow on hover

<Card variant="glass" glow>
  <Card.Header>
    <Card.Title>Agent Activity</Card.Title>
  </Card.Header>
  <Card.Content>
    {/* Content */}
  </Card.Content>
</Card>
```

**Badge**
```tsx
// Variants: success, warning, error, info, neutral
// Risk levels: low, medium, high, critical

<Badge variant="risk-high">High Risk</Badge>
<Badge variant="success">Allowed</Badge>
```

**Input**
```tsx
// Variants: default, ghost, underline
// States: default, focus, error, disabled
// With icon, with prefix/suffix

<Input placeholder="Enter email" icon={Mail} />
<Input type="password" showToggle />
```

**Select**
```tsx
// Multi-select support
// Search functionality
// Custom render options

<Select options={options} multi searchable />
```

**Table**
```tsx
// Sortable columns
// Filterable rows
// Pagination
// Row actions

<Table
  data={data}
  columns={columns}
  sortable
  filterable
/>
```

**Modal**
```tsx
// Backdrop blur
// Animation variants
// Size options

<Modal size="xl" open={isOpen} onClose={handleClose}>
  <Modal.Header>Title</Modal.Header>
  <Modal.Content>{content}</Modal.Content>
  <Modal.Footer>
    <Button onClick={handleClose}>Close</Button>
  </Modal.Footer>
</Modal>
```

**Tooltip**
```tsx
// Position options
// Delay options
// Custom content

<Tooltip content="View details">
  <Button icon={Info} />
</Tooltip>
```

**Dropdown**
```tsx
// Menu items
// Keyboard navigation
// Custom triggers

<Dropdown>
  <Dropdown.Trigger>
    <Button icon={MoreVertical} variant="ghost" />
  </Dropdown.Trigger>
  <Dropdown.Menu>
    <Dropdown.Item>Edit</Dropdown.Item>
    <Dropdown.Item danger>Delete</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
```

### 2.2 Data Visualization Components

**Chart**
```tsx
// Line, bar, area, pie, donut
// Real-time updates
// Custom tooltips
// Responsive

<LineChart
  data={data}
  xKey="time"
  yKey="value"
  realtime
  smooth
/>
```

**Progress Ring**
```tsx
// Circular progress indicator
// Animated
// Custom colors

<ProgressRing value={75} size="md" color="primary" />
```

**Metric Card**
```tsx
// Large metric display
// Trend indicator
// Sparkline

<MetricCard
  title="Total Events"
  value={1234}
  trend={12.5}
  trendDirection="up"
/>
```

**Heatmap**
```tsx
// Activity heatmap
// Color scale
// Interactive cells

<Heatmap data={heatmapData} colorScale="viridis" />
```

### 2.3 Specialized Components

**Trust Score Gauge**
```tsx
// Semi-circle gauge
// Color-coded zones
// Animated value
// Historical trend

<TrustGauge value={0.85} showTrend />
```

**Risk Level Indicator**
```tsx
// Color-coded risk bar
// Animated segments
// Tooltip with details

<RiskIndicator level="high" score={0.75} />
```

**Event Timeline**
```tsx
// Vertical timeline
// Event cards
// Expandable details
// Filterable

<EventTimeline events={events} filter="high-risk" />
```

**Live Graph**
```tsx
// React Flow integration
// Real-time node updates
// Interactive edges
// Mini-map

<LiveGraph nodes={nodes} edges={edges} realtime />
```

**Code Block**
```tsx
// Syntax highlighting
// Copy button
// Line numbers
// Language detection

<CodeBlock code={code} language="python" />
```

**Command Palette**
```tsx
// Keyboard shortcut (Cmd+K)
// Search functionality
// Command groups
// Recent commands

<CommandPalette open={isOpen} commands={commands} />
```

---

## 3. Page Layouts

### 3.1 Landing Page

**Sections**:
1. **Hero**
   - Large headline with gradient text
   - Subheadline with value proposition
   - CTA buttons (Get Started, Watch Demo)
   - Animated background (particles or gradient)
   - Product preview mockup

2. **Features**
   - Grid layout (3 columns)
   - Feature cards with icons
   - Hover effects with glow
   - Micro-interactions on scroll

3. **How It Works**
   - Step-by-step flow
   - Animated process diagram
   - Interactive demo preview

4. **Security Dashboard Preview**
   - Full-width screenshot
   - Interactive hotspots
   - Feature callouts

5. **Testimonials**
   - Carousel layout
   - Customer quotes
   - Company logos

6. **Pricing**
   - 3-tier pricing cards
   - Feature comparison
   - Toggle for monthly/yearly

7. **CTA Section**
   - Final conversion section
   - Gradient background
   - Email capture form

8. **Footer**
   - Navigation links
   - Social links
   - Legal links

### 3.2 Mission Control (Dashboard)

**Layout Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│  Header: Logo, Search, Command Palette, User Menu          │
├──────────┬──────────────────────────────────────────────────┤
│          │  Main Content Area                               │
│          │  ┌────────────────────────────────────────────┐ │
│ Sidebar  │  │  Quick Stats Row (4 metric cards)          │ │
│          │  ├────────────────────────────────────────────┤ │
│ Agents   │  │  Live Monitoring Graph                      │ │
│ Policies  │  │  (React Flow visualization)                │ │
│ Events   │  ├────────────────────────────────────────────┤ │
│ Attacks  │  │  Recent Events Table                        │ │
│ Settings │  │  (Sortable, filterable)                     │ │
│          │  ├────────────────────────────────────────────┤ │
│          │  │  Risk Distribution Chart                     │ │
│          │  │  (Donut chart with breakdown)              │ │
│          │  └────────────────────────────────────────────┘ │
└──────────┴──────────────────────────────────────────────────┘
```

**Components**:
- Collapsible sidebar
- Real-time updates via WebSocket
- Draggable widgets
- Customizable layout
- Dark mode native

### 3.3 Agent Workspace

**Layout Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│  Header: Agent Name, Trust Score, Status, Actions           │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐  ┌─────────────────────────────┐ │
│  │ Agent Profile        │  │ Trust Score Trend           │ │
│  │ - Type, Config       │  │ - Line chart (30 days)      │ │
│  │ - API Key status     │  │ - Milestone markers         │ │
│  │ - Last activity      │  │                             │ │
│  └─────────────────────┘  └─────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Behavior Profile                                     │ │
│  │ - Tool usage heatmap                                  │ │
│  │ - Temporal patterns                                   │ │
│  │ - Success/failure rates                               │ │
│  └───────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Recent Events Timeline                                │ │
│  │ - Vertical timeline with event cards                 │ │
│  │ - Expandable details                                  │ │
│  │ - Filter by type, risk level                         │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 3.4 Policy Studio

**Layout Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│  Header: Policies, New Policy Button, Search, Filter       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────────────────────┐ │
│  │ Policy List     │  │ Policy Editor                    │ │
│  │ - Search        │  │ - Name, Description              │ │
│  │ - Filter        │  │ - Rule Builder (drag & drop)     │ │
│  │ - Sort          │  │ - Condition Builder              │ │
│  │ - Active toggle │  │ - Action Selector                 │ │
│  │                 │  │ - Test Panel                      │ │
│  │                 │  │ - Version History                │ │
│  └─────────────────┘  └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Rule Builder**:
- Drag-and-drop interface
- Visual condition builder
- Action selector with parameters
- Real-time validation
- Test panel with sample data

### 3.5 Attack Simulator

**Layout Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│  Header: Attack Simulator, New Simulation, History          │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Attack Configuration                                   │ │
│  │ - Attack type selector (dropdown)                     │ │
│  │ - Target agent selector                                │ │
│  │ - Payload editor (code block)                         │ │
│  │ - Expected result selector                            │ │
│  │ - Run button                                           │ │
│  └───────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Results Panel                                          │ │
│  │ - Detection time (with gauge)                         │ │
│  │ - Pass/Fail status (large badge)                      │ │
│  │ - Risk score captured                                 │ │
│  │ - Decision made                                       │ │
│  │ - Analysis breakdown                                  │ │
│  └───────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Simulation History                                    │ │
│  │ - Table with past simulations                         │ │
│  │ - Filter by type, result, date                       │ │
│  │ - Export results                                      │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 3.6 Memory Inspector

**Layout Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│  Header: Memory Inspector, Agent Selector, Refresh         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────────────────────┐ │
│  │ Memory Types   │  │ Memory Content Viewer           │ │
│  │ - Conversation  │  │ - Syntax highlighted content    │ │
│  │ - Tool Outputs  │  │ - Expandable sections           │ │
│  │ - Context       │  │ - Search within content         │ │
│  │ - State         │  │ - Annotations                   │ │
│  │                 │  │                                 │ │
│  │                 │  └─────────────────────────────────┘ │
│  │                 │  ┌─────────────────────────────────┐ │
│  │                 │  │ Analysis Panel                   │ │
│  │                 │  │ - Poisoning detection            │ │
│  │                 │  │ - Sensitive data matches         │ │
│  │                 │  │ - Size analysis                 │ │
│  │                 │  │ - Timeline view                 │ │
│  │                 │  └─────────────────────────────────┘ │
│  └─────────────────┘                                       │
└─────────────────────────────────────────────────────────────┘
```

### 3.7 Replay Center

**Layout Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│  Header: Replay Center, Event Selector, Timeline Controls  │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Timeline Controls                                      │ │
│  │ - Play/Pause button                                     │ │
│  │ - Timeline scrubber                                     │ │
│  │ - Speed control (0.5x, 1x, 2x)                          │ │
│  │ - Step forward/backward                                 │ │
│  └───────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Event Viewer                                           │ │
│  │ - Current event card                                   │ │
│  │ - Analysis results (intent, risk, trust)              │ │
│  │ - Decision made                                        │ │
│  │ - Tool call details                                    │ │
│  └───────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Event Timeline (Mini)                                  │ │
│  │ - Horizontal timeline with event markers              │ │
│  │ - Color-coded by risk level                            │ │
│  │ - Click to jump to event                               │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Micro-interactions

### 4.1 Button Interactions

**Hover**:
- Subtle scale up (1.02)
- Glow effect
- Color shift

**Active**:
- Scale down (0.98)
- Increased glow
- Ripple effect

**Loading**:
- Spinner animation
- Disabled state
- Progress indicator

### 4.2 Card Interactions

**Hover**:
- Elevation increase
- Border glow
- Subtle scale
- Shadow enhancement

**Focus**:
- Border color change
- Glow effect
- Outline

### 4.3 Input Interactions

**Focus**:
- Border color change
- Glow effect
- Label animation
- Helper text fade in

**Error**:
- Shake animation
- Red border
- Error message slide down

### 4.4 Table Interactions

**Row Hover**:
- Background color shift
- Subtle scale
- Action buttons appear

**Sort**:
- Icon animation
- Column highlight
- Smooth reorder

### 4.5 Chart Interactions

**Hover**:
- Tooltip appearance
- Data point highlight
- Crosshair
- Series highlight

**Animation**:
- Smooth line drawing
- Bar growth animation
- Pie slice expansion

### 4.6 Modal Interactions

**Open**:
- Backdrop fade in
- Scale in animation
- Blur effect
- Focus trap

**Close**:
- Scale out animation
- Backdrop fade out
- Return focus

### 4.7 Notification Interactions

**Slide In**:
- From right side
- Smooth animation
- Stagger for multiple

**Hover**:
- Pause auto-dismiss
- Show actions
- Expand details

**Dismiss**:
- Slide out
- Fade effect
- Shrink

### 4.8 Command Palette Interactions

**Open**:
- Backdrop blur
- Scale in
- Focus input

**Navigation**:
- Keyboard highlighting
- Smooth scroll
- Preview panel update

**Select**:
- Close animation
- Action feedback
- Toast notification

---

## 5. Responsive Design

### 5.1 Breakpoints

```css
--breakpoint-xs: 375px;   /* Mobile small */
--breakpoint-sm: 640px;   /* Mobile */
--breakpoint-md: 768px;   /* Tablet */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Desktop large */
--breakpoint-2xl: 1536px; /* Desktop extra large */
```

### 5.2 Mobile Adaptations

**Navigation**:
- Hamburger menu
- Bottom navigation bar
- Slide-out sidebar

**Dashboard**:
- Stacked cards
- Horizontal scroll for tables
- Simplified charts
- Tab-based navigation

**Tables**:
- Card view on mobile
- Horizontal scroll
- Key columns only
- Expand for details

**Forms**:
- Full-width inputs
- Stacked layout
- Large touch targets
- Native pickers

### 5.3 Tablet Adaptations

**Layout**:
- 2-column grid
- Collapsible sidebar
- Optimized touch targets
- Swipe gestures

**Charts**:
- Responsive sizing
- Simplified tooltips
- Touch interactions

### 5.4 Desktop Adaptations

**Layout**:
- Multi-column grids
- Fixed sidebar
- Hover interactions
- Keyboard shortcuts

**Features**:
- Command palette
- Drag and drop
- Multi-select
- Context menus

---

## 6. Accessibility

### 6.1 Color Contrast

- WCAG AA compliance (4.5:1 for normal text)
- WCAG AAA compliance (7:1 for large text)
- Color not the only indicator
- Focus states visible

### 6.2 Keyboard Navigation

- Tab order logical
- Focus indicators visible
- Skip to main content
- Keyboard shortcuts documented
- Escape key handling

### 6.3 Screen Reader Support

- Semantic HTML
- ARIA labels
- Live regions for updates
- Alt text for images
- Descriptive link text

### 6.4 Motion Preferences

- Respect `prefers-reduced-motion`
- Disable animations when requested
- Provide static alternatives
- No auto-playing videos

### 6.5 Touch Targets

- Minimum 44x44px
- Spacing between targets
- No hover-only interactions
- Gesture alternatives

---

## 7. Performance

### 7.1 Loading Performance

- Code splitting by route
- Lazy loading components
- Image optimization
- Font subsetting
- Critical CSS inline

### 7.2 Runtime Performance

- Virtual scrolling for lists
- Debounced inputs
- Memoized components
- Optimized re-renders
- Web Workers for heavy tasks

### 7.3 Animation Performance

- GPU-accelerated transforms
- Will-change hints
- RequestAnimationFrame
- Reduced layout thrashing
- Optimized transitions

### 7.4 Bundle Size

- Tree shaking
- Dynamic imports
- External libraries minimized
- Gzip compression
- CDN delivery

---

## Phase 3 Summary

**Completed:**
- ✅ Complete design system with colors, typography, spacing
- ✅ Component library specifications
- ✅ Page layouts for all major screens
- ✅ Micro-interaction definitions
- ✅ Responsive design strategy
- ✅ Accessibility guidelines
- ✅ Performance considerations

**Key Design Decisions:**
- Dark mode native design
- Glassmorphism for modern feel
- Gradient accents for visual hierarchy
- Motion with purpose for engagement
- Progressive disclosure for complexity
- Mobile-first responsive design

**Design Principles Applied:**
- Clarity First
- Visual Hierarchy
- Motion with Purpose
- Dark Mode Native
- Accessibility First

**Ready for Phase 4: Backend Foundation**

---

**Proceeding to Phase 4**
