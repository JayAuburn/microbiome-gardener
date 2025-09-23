# AI Task Template

> **Instructions:** This template helps you create comprehensive task documents for AI-driven development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Simplify ProcessingStatusIndicator Component for Multi-Skill Developer Team

### Goal Statement
**Goal:** Simplify the ProcessingStatusIndicator.tsx component to eliminate confusing progress bar behavior (moving backwards), remove unnecessary complexity, and provide a more predictable user experience that works well for developers of varying skill levels.

---

## 2. Strategic Analysis & Solution Options

### When to Use Strategic Analysis
This is a straightforward improvement with a clear implementation path focused on simplification and better UX. No strategic analysis needed.

---

## 3. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js with React, TypeScript
- **UI & Styling:** shadcn/ui components with Tailwind CSS for styling
- **Key Architectural Patterns:** React components with real-time progress tracking
- **Relevant Existing Components:** 
  - `ProcessingStatusIndicator.tsx` - main progress component
  - `WorkflowProgress` - mini green progress bar (to be removed)
  - Related services: `video_processing_service.py`, `processing_service.py`

### Current State
The ProcessingStatusIndicator component currently has several issues:
1. **Progress moves backwards** due to competing progress calculation systems
2. **Green progress bar is confusing** and adds unnecessary complexity
3. **Stage name mismatches** between expected workflow and actual service stages
4. **Time estimates are 4x too high** 
5. **Progress bar jumps around** due to workflow position vs. percentage-based calculations

## 4. Context & Problem Definition

### Problem Statement
The current ProcessingStatusIndicator.tsx component confuses users and developers because:
- Progress bars move backwards during processing, creating poor UX
- Two competing progress systems (workflow position vs base progress) conflict
- Green workflow progress bar adds complexity without clear value
- Stage mismatches cause progress calculation errors
- Time estimates are unrealistic (4x too high)
- Progress behavior is unpredictable for users

### Success Criteria
- [ ] Progress only moves forward (monotonic progress)
- [ ] Single, predictable progress calculation system
- [ ] Eliminated green progress bar complexity
- [ ] Accurate stage mapping that matches actual processing services
- [ ] Realistic time estimates (reduced by 4x)
- [ ] Chunk progress interpolation with proper rounding
- [ ] Error handling that resets progress to 0
- [ ] Unknown stage handling with retry logic

---

## 5. Technical Requirements

### Functional Requirements
- Progress bar must only move forward, never backwards
- Chunk processing should interpolate progress between start/end points
- Progress values should be rounded to avoid fractions
- Eliminate WorkflowProgress (green progress bar) component usage
- Map both "generating_dual_embeddings" and "generating_embeddings" to single stage
- Remove "extracting_keyframes" stage (not actually used)
- Reduce all time estimates by 4x
- Reset progress to 0 on errors
- Handle unknown stages with retry mechanism

### Non-Functional Requirements
- **Performance:** Maintain current rendering performance
- **Usability:** Simpler, more predictable progress indication
- **Maintainability:** Reduced complexity for multi-skill developer team
- **Responsive Design:** Must work on mobile (320px+), tablet (768px+), and desktop (1024px+)
- **Theme Support:** Must support both light and dark mode using existing theme system

### Technical Constraints
- Must maintain compatibility with existing video/audio/document processing services
- Cannot modify backend Python services in this task
- Must work with current chunk processing patterns (e.g., "processing_chunk_1_of_5")

---

## 6. Data & Database Changes

### Database Schema Changes
No database changes required.

### Data Model Updates
No data model changes required.

---

## 7. API & Backend Changes

### Server Actions
No server actions changes required.

### Database Queries
No query changes required.

### API Routes
No API route changes required.

---

## 8. Frontend Changes

### Component Updates
- [ ] **`components/documents/ProcessingStatusIndicator.tsx`** - Complete simplification and monotonic progress implementation
  - Remove WorkflowProgress component usage (green progress bar)
  - Implement single, monotonic progress calculation system
  - Add chunk interpolation with rounding
  - Update stage mapping to match actual services
  - Reduce time estimates by 4x
  - Add error reset and unknown stage retry logic

### Stage Mapping Updates
**New Simplified Linear Stages for Video:**
```typescript
const SIMPLIFIED_VIDEO_STAGES = [
  { name: "pending", progress: 0 },
  { name: "downloading", progress: 10 },
  { name: "analyzing_video", progress: 20 },
  { name: "processing_video", progress: 30 },
  { name: "creating_video_chunks", progress: 40 },
  // Chunk processing interpolates between 40-70%
  { name: "transcribing_video", progress: 70 },
  { name: "generating_video_context", progress: 80 },
  { name: "generating_embeddings", progress: 90 }, // Consolidated embedding stage
  { name: "storing", progress: 95 },
  { name: "completed", progress: 100 }
];
```

### Chunk Processing Logic
```typescript
// For "processing_chunk_2_of_5":
// - Extract: current=2, total=5
// - Chunk progress: 2/5 = 40%
// - Interpolate: 40% + (30% * 0.4) = 40% + 12% = 52%
// - Round: Math.round(52) = 52%
```

---

## 9. Implementation Plan

### Phase 1: Analyze Current Implementation
**Goal:** Understand current progress calculation systems and identify all components involved

- [ ] **Task 1.1:** Review ProcessingStatusIndicator.tsx thoroughly
  - Files: `components/documents/ProcessingStatusIndicator.tsx`
  - Details: Document current progress calculation methods and identify conflicting systems
- [ ] **Task 1.2:** Identify WorkflowProgress component usage
  - Files: Look for WorkflowProgress imports and usage
  - Details: Map where green progress bar is rendered and how to remove it

### Phase 2: Implement Simplified Stage Mapping
**Goal:** Create consolidated stage mapping with monotonic progress values

- [ ] **Task 2.1:** Define Simplified Linear Stages
  - Files: `components/documents/ProcessingStatusIndicator.tsx`
  - Details: Create SIMPLIFIED_VIDEO_STAGES constant with clear progress values
- [ ] **Task 2.2:** Implement Stage Mapping Logic
  - Files: `components/documents/ProcessingStatusIndicator.tsx`
  - Details: Map actual service stages to simplified stages, including embedding consolidation
- [ ] **Task 2.3:** Remove Extracting Keyframes Stage
  - Files: `components/documents/ProcessingStatusIndicator.tsx`
  - Details: Ensure "extracting_keyframes" is not included in any stage definitions

### Phase 3: Implement Monotonic Progress System
**Goal:** Replace competing progress systems with single, forward-only progress calculation

- [ ] **Task 3.1:** Remove WorkflowProgress Component
  - Files: `components/documents/ProcessingStatusIndicator.tsx`
  - Details: Remove green progress bar rendering and related props
- [ ] **Task 3.2:** Implement Base Progress System Only
  - Files: `components/documents/ProcessingStatusIndicator.tsx`
  - Details: Use only the base progress approach, eliminate workflow position calculations
- [ ] **Task 3.3:** Add Chunk Interpolation Logic
  - Files: `components/documents/ProcessingStatusIndicator.tsx`
  - Details: Implement chunk progress interpolation with Math.round() for clean percentages

### Phase 4: Update Time Estimates and Error Handling
**Goal:** Provide realistic time estimates and robust error handling

- [ ] **Task 4.1:** Reduce Time Estimates by 4x
  - Files: `components/documents/ProcessingStatusIndicator.tsx`
  - Details: Update all time calculation logic to divide estimates by 4
- [ ] **Task 4.2:** Implement Error Reset Logic
  - Files: `components/documents/ProcessingStatusIndicator.tsx`
  - Details: Reset progress to 0 when errors occur
- [ ] **Task 4.3:** Add Unknown Stage Retry Handling
  - Files: `components/documents/ProcessingStatusIndicator.tsx`
  - Details: Implement retry mechanism for unrecognized stages

### Phase 5: Testing and Validation
**Goal:** Ensure simplified component works correctly across all scenarios

- [ ] **Task 5.1:** Test Monotonic Progress Behavior
  - Details: Verify progress only moves forward during normal processing
- [ ] **Task 5.2:** Test Chunk Interpolation
  - Details: Verify chunk progress correctly interpolates between stage boundaries
- [ ] **Task 5.3:** Test Error Scenarios
  - Details: Verify progress resets to 0 on errors and unknown stages are handled

---

## 10. File Structure & Organization

### Files to Modify
- [ ] **`components/documents/ProcessingStatusIndicator.tsx`** - Complete component simplification
  - Remove WorkflowProgress component usage
  - Implement simplified stage mapping
  - Add monotonic progress calculation
  - Update time estimates
  - Add error handling

### Dependencies to Remove
- WorkflowProgress component import (if separate file)
- Any workflow position calculation dependencies

---

## 11. Error Handling & Edge Cases

### Error Scenarios
- [ ] **Error 1:** Unknown stage received from processing service
  - **Handling:** Log warning, retry with last known stage, don't update progress
- [ ] **Error 2:** Processing fails or encounters error status
  - **Handling:** Reset progress to 0, show error state
- [ ] **Error 3:** Chunk parsing fails (invalid format)
  - **Handling:** Fall back to base stage progress, log warning

### Edge Cases
- [ ] **Edge Case 1:** Chunk numbers out of sequence or missing
  - **Solution:** Use highest available chunk number for progress calculation
- [ ] **Edge Case 2:** Stage updates arrive out of order
  - **Solution:** Only update progress if new value is higher than current
- [ ] **Edge Case 3:** Multiple embedding stage names in single processing run
  - **Solution:** Map all to "generating_embeddings" stage consistently

---

## 12. Security Considerations

### Input Validation
- [ ] Validate chunk number parsing to prevent injection attacks
- [ ] Sanitize stage names before processing
- [ ] Validate progress percentages are within 0-100 range

---

## 13. AI Agent Instructions

### Implementation Approach - CRITICAL WORKFLOW
🚨 **MANDATORY: Always follow this exact sequence:**

1. **IMPLEMENT IMMEDIATELY (Approved task)**
   - [ ] Start with Phase 1 and complete fully before moving to Phase 2
   - [ ] Test each change incrementally to ensure no breaking changes
   - [ ] Follow existing code patterns and conventions in the component
   - [ ] Maintain all existing props and external interfaces
   - [ ] Test components in both light and dark themes
   - [ ] Verify responsive behavior on mobile, tablet, and desktop

### Code Quality Standards
- [ ] Follow TypeScript best practices
- [ ] Add proper error handling and logging
- [ ] Include comprehensive comments explaining the simplified logic
- [ ] Ensure responsive design works across all breakpoints
- [ ] Test components in both light and dark mode
- [ ] Verify mobile usability on devices 320px width and up

### Specific Implementation Notes
- [ ] **Chunk Progress Formula:** `stageStart + (stageRange * chunkProgress)` with `Math.round()`
- [ ] **Stage Consolidation:** Map both embedding variants to single "generating_embeddings"
- [ ] **Monotonic Enforcement:** Only update progress if `newProgress > currentProgress`
- [ ] **Time Reduction:** Divide all existing time estimates by 4

---

## 14. Second-Order Consequences & Impact Analysis

### AI Analysis Instructions
🔍 **MANDATORY: The AI agent must analyze this section thoroughly before implementation**

### Impact Assessment Framework

#### 1. **Breaking Changes Analysis**
- [ ] **Existing API Contracts:** Component props interface remains the same
- [ ] **Component Dependencies:** Other components consuming ProcessingStatusIndicator should not be affected
- [ ] **External Integrations:** Backend processing services continue to work without changes

#### 2. **Ripple Effects Assessment**
- [ ] **Data Flow Impact:** Progress updates will be more predictable and consistent
- [ ] **UI/UX Cascading Effects:** Users will see more linear, understandable progress
- [ ] **State Management:** Simplified internal state reduces complexity

#### 3. **Performance Implications**
- [ ] **Rendering Performance:** Removing WorkflowProgress component may slightly improve performance
- [ ] **Memory Usage:** Simplified progress calculation reduces memory overhead
- [ ] **Bundle Size:** No significant bundle size changes expected

#### 4. **User Experience Impacts**
- [ ] **Workflow Improvement:** Users will no longer see confusing backwards progress movement
- [ ] **Time Expectations:** Reduced time estimates will set more realistic expectations
- [ ] **Error Recovery:** Better error handling will provide clearer feedback

### Critical Issues Identification

#### 🚨 **RED FLAGS - Alert User Immediately**
- None identified for this simplification task

#### ⚠️ **YELLOW FLAGS - Discuss with User**
- [ ] **Component Interface:** Ensuring external components using ProcessingStatusIndicator continue to work
- [ ] **Visual Changes:** Users may notice the removal of the green progress bar

### Mitigation Strategies

#### Component Compatibility
- [ ] **Interface Preservation:** Maintain all existing props and external interfaces
- [ ] **Gradual Deployment:** Can be deployed immediately since it's an improvement

---

*Template Version: 1.2*  
*Last Updated: 7/7/2025*  
*Created By: Brandon Hancock* 
