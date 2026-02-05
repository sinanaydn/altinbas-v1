# Altınbaş AI Jewelry Advertising Engine

## Technical Specification Document

**Version:** 1.0.0  
**Status:** MVP Specification  
**Classification:** Internal Engineering Blueprint  
**Last Updated:** February 2026  
**Platform:** Antigravity  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Definition](#2-product-definition)
3. [System Architecture](#3-system-architecture)
4. [AI Pipeline Specification](#4-ai-pipeline-specification)
5. [User Input & Asset Processing](#5-user-input--asset-processing)
6. [Brand Constraint Enforcement System](#6-brand-constraint-enforcement-system)
7. [Output Generation Specification](#7-output-generation-specification)
8. [Moderation & Review System](#8-moderation--review-system)
9. [Data Storage Design (Airtable)](#9-data-storage-design-airtable)
10. [API & Service Layer](#10-api--service-layer)
11. [Mobile-First UI Architecture](#11-mobile-first-ui-architecture)
12. [Antigravity Integration](#12-antigravity-integration)
13. [Extensibility & Future Roadmap](#13-extensibility--future-roadmap)
14. [Appendices](#14-appendices)

---

## 1. Executive Summary

### 1.1 Purpose

This document defines the complete technical specification for the Altınbaş AI Jewelry Advertising Engine—a brand-locked, identity-preserving advertising visual generation system built on the Antigravity platform.

### 1.2 System Identity

The system is NOT a generic AI image generator. It is a **preservation renderer**—an identity-constrained advertising engine that generates premium editorial lifestyle visuals while maintaining absolute fidelity to the uploaded jewelry product.

### 1.3 Core Principle

Every output must satisfy this constraint: **The uploaded product must never change geometry, material, gemstone count, chain structure, or any physical characteristic.** The AI enhances context and presentation; it does not reinterpret or redesign the product.

### 1.4 Locked Technology Stack (MVP)

| Function | Provider | Status |
|----------|----------|--------|
| Vision Analysis + Prompt Generation | **Gemini** | Fixed |
| Image Generation | **Nano Banana Pro** | Fixed |
| Video Generation | **Sora 2** | Fixed |
| Primary Datastore | **Airtable** | Fixed |
| Future Relational DB (Optional) | Supabase | Upgrade Path Only |

These assignments are non-negotiable for MVP. No dynamic model switching is permitted.

---

## 2. Product Definition

### 2.1 Target Users

**MVP Scope:** Internal Altınbaş marketing and creative staff only.

User personas:

- **Marketing Coordinator:** Uploads product images, generates campaign visuals, exports approved assets
- **Creative Director:** Reviews generated concepts, approves final outputs, manages brand compliance
- **Digital Content Manager:** Archives approved assets, manages SKU associations, exports for distribution channels

### 2.2 Core Value Proposition

Transform raw jewelry product photography into premium editorial advertising visuals in minutes, not days—while guaranteeing brand compliance and product identity preservation.

### 2.3 What This System Is

- A brand-constrained advertising visual renderer
- An automated creative direction engine
- A product identity preservation system
- A compliance-first generation pipeline

### 2.4 What This System Is NOT

- A generic AI image generator
- A creative redesign tool
- A product modification system
- A free-form prompt interface

### 2.5 Success Metrics

| Metric | Target |
|--------|--------|
| Product identity preservation rate | 100% (hard requirement) |
| Brand compliance pass rate | ≥95% on first generation |
| Average time from upload to approved visual | <5 minutes |
| User regeneration rate (dissatisfaction proxy) | <20% |
| Export completion rate | ≥90% |

---

## 3. System Architecture

### 3.1 High-Level Architecture Diagram (Text Description)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                    Mobile-First Progressive Web App                      │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │   │
│  │  │  Upload  │ │ Metadata │ │  Review  │ │  Export  │ │  Archive │     │   │
│  │  │  Screen  │ │  Input   │ │  Gallery │ │  Panel   │ │  Browser │     │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘     │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           ANTIGRAVITY API GATEWAY                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │    Auth     │ │    Rate     │ │   Request   │ │   Response  │              │
│  │  Middleware │ │   Limiter   │ │  Validator  │ │  Formatter  │              │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘              │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           ORCHESTRATION LAYER                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        Pipeline Orchestrator                             │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │   │
│  │  │    Asset     │ │   Analysis   │ │  Generation  │ │    Export    │   │   │
│  │  │  Processor   │ │  Coordinator │ │  Controller  │ │   Manager    │   │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        Brand Constraint Engine                           │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                    │   │
│  │  │ Pre-Generate │ │  In-Process  │ │ Post-Generate│                    │   │
│  │  │  Validator   │ │   Monitor    │ │   Auditor    │                    │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘                    │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           AI PROVIDER LAYER                                      │
│  ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐       │
│  │   GEMINI ADAPTER    │ │ NANO BANANA ADAPTER │ │    SORA 2 ADAPTER  │       │
│  │  ┌───────────────┐  │ │  ┌───────────────┐  │ │  ┌───────────────┐ │       │
│  │  │ Vision API    │  │ │  │ Reference     │  │ │  │ Video Gen     │ │       │
│  │  │ Analysis      │  │ │  │ Image Gen     │  │ │  │ Pipeline      │ │       │
│  │  ├───────────────┤  │ │  ├───────────────┤  │ │  ├───────────────┤ │       │
│  │  │ Structured    │  │ │  │ Identity      │  │ │  │ Motion        │ │       │
│  │  │ Extraction    │  │ │  │ Preservation  │  │ │  │ Templates     │ │       │
│  │  ├───────────────┤  │ │  ├───────────────┤  │ │  ├───────────────┤ │       │
│  │  │ Concept       │  │ │  │ Multi-Aspect  │  │ │  │ Identity Lock │ │       │
│  │  │ Selection     │  │ │  │ Rendering     │  │ │  │ Enforcement   │ │       │
│  │  ├───────────────┤  │ │  └───────────────┘  │ │  └───────────────┘ │       │
│  │  │ Prompt        │  │ │                     │ │                     │       │
│  │  │ Generation    │  │ │                     │ │                     │       │
│  │  └───────────────┘  │ │                     │ │                     │       │
│  └─────────────────────┘ └─────────────────────┘ └─────────────────────┘       │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           ASSET PROCESSING LAYER                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│  │   Background │ │    Image     │ │    Brand     │ │    Format    │           │
│  │   Remover    │ │   Validator  │ │   Overlay    │ │   Exporter   │           │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘           │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                          AIRTABLE (Primary)                              │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │   │
│  │  │ Products │ │ Sessions │ │ Outputs  │ │  Assets  │ │  Audits  │     │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘     │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                      FILE STORAGE (CDN-Backed)                           │   │
│  │  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐        │   │
│  │  │  Source Images   │ │ Generated Assets │ │  Export Archives │        │   │
│  │  └──────────────────┘ └──────────────────┘ └──────────────────┘        │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Component Responsibilities

#### 3.2.1 Client Layer

The Progressive Web App provides the user interface for all system interactions. It is mobile-first, responsive, and optimized for touch interactions on tablets used by Altınbaş staff.

#### 3.2.2 Antigravity API Gateway

Standard Antigravity gateway handling authentication, rate limiting, request validation, and response formatting. All client requests route through this gateway.

#### 3.2.3 Orchestration Layer

The Pipeline Orchestrator coordinates the entire generation workflow, managing state transitions and error recovery. The Brand Constraint Engine enforces brand compliance at three stages: pre-generation validation, in-process monitoring, and post-generation auditing.

#### 3.2.4 AI Provider Layer

Three fixed adapters interface with the locked AI providers. Each adapter implements a standardized interface while handling provider-specific requirements.

#### 3.2.5 Asset Processing Layer

Handles all image manipulation tasks including background removal, validation, brand overlay application, and format conversion for export.

#### 3.2.6 Data Layer

Airtable serves as the primary datastore for all structured data. File storage (CDN-backed) handles binary assets including source images, generated outputs, and export archives.

### 3.3 Data Flow Summary

```
Upload → Validate → Background Remove → Gemini Analysis → Gemini Prompt Generation
    → Nano Banana Pro Generation → Post-Processing → Review → Approve/Regenerate
    → Export → Archive (Airtable) → Optional: Sora 2 Video Generation
```

---

## 4. AI Pipeline Specification

### 4.1 Pipeline Overview

The AI pipeline is a sequential, deterministic workflow with fixed model assignments. No dynamic model switching or fallback providers are permitted in MVP.

### 4.2 Stage 1: Gemini Vision Analysis

#### 4.2.1 Purpose

Analyze the uploaded jewelry product image to extract structured data about the product's physical characteristics, suitable for downstream prompt generation.

#### 4.2.2 Input

```typescript
interface GeminiAnalysisInput {
  cutoutImage: Base64EncodedImage;      // Background-removed product image
  additionalAngles?: Base64EncodedImage[];  // Optional supplementary views
  userMetadata: {
    category: 'ring' | 'necklace' | 'earrings' | 'bracelet';
    goldPurity: '14k' | '18k' | '22k';
    gemstone: 'diamond' | 'zircon' | 'none';
    color: 'yellow' | 'rose' | 'white';
    sku?: string;
  };
}
```

#### 4.2.3 Output

```typescript
interface GeminiAnalysisOutput {
  productAnalysis: {
    detectedCategory: string;
    categoryConfidence: number;
    
    geometryDescription: {
      shape: string;
      dimensionEstimate: 'petite' | 'medium' | 'statement';
      symmetry: 'symmetric' | 'asymmetric';
      complexity: 'minimal' | 'moderate' | 'intricate';
    };
    
    materialAnalysis: {
      primaryMetal: string;
      metalFinish: 'polished' | 'matte' | 'brushed' | 'textured';
      estimatedPurity: string;
      surfaceCharacteristics: string[];
    };
    
    gemstoneAnalysis: {
      detected: boolean;
      count: number;
      primaryGemstone: string | null;
      cutStyle: string | null;
      settingType: string | null;
      arrangement: string | null;
    };
    
    chainAnalysis?: {  // Only for necklaces/bracelets
      chainType: string;
      linkStyle: string;
      claspType: string;
    };
    
    distinctiveFeatures: string[];
    lightingRecommendations: string[];
  };
  
  identityFingerprint: {
    geometryHash: string;      // For post-generation validation
    gemstoneSignature: string;
    materialSignature: string;
  };
  
  analysisConfidence: number;
  analysisTimestamp: ISO8601Timestamp;
}
```

#### 4.2.4 Gemini System Prompt (Analysis Phase)

```
You are a precision jewelry analyzer for luxury advertising production.

Your task is to analyze jewelry product images with extreme accuracy.
Extract ONLY what is visually present. Never infer, assume, or add characteristics.

CRITICAL CONSTRAINTS:
- Count gemstones exactly. If you count 3 diamonds, output 3.
- Describe metal finish as observed, not assumed.
- Identify chain types precisely for necklaces/bracelets.
- Note any distinctive features that must be preserved in advertising.

OUTPUT FORMAT: Structured JSON matching the GeminiAnalysisOutput schema.

ACCURACY IS PARAMOUNT. This data drives identity-preservation constraints.
False positives or negatives compromise brand integrity.
```

### 4.3 Stage 2: Gemini Concept Selection

#### 4.3.1 Purpose

Select 3–4 high-end editorial concepts appropriate for the analyzed product, considering product category, characteristics, and brand guidelines.

#### 4.3.2 Concept Library

The system maintains a curated library of approved advertising concepts:

```typescript
interface ConceptDefinition {
  conceptId: string;
  name: string;
  description: string;
  
  applicableCategories: ProductCategory[];
  
  visualParameters: {
    environmentType: 'studio' | 'lifestyle' | 'abstract';
    backgroundStyle: string;
    lightingApproach: string;
    modelPresence: 'none' | 'hands_only' | 'partial' | 'full';
    modelFraming?: string;
    colorPalette: string[];
    moodDescriptors: string[];
  };
  
  brandAlignmentScore: number;  // 0-100
  premiumIndicator: 'standard' | 'elevated' | 'ultra_premium';
}
```

**Pre-Approved Concept Examples:**

| Concept ID | Name | Environment | Model Presence |
|------------|------|-------------|----------------|
| `MNML_STUDIO_01` | Minimal White Studio | studio | none |
| `EDIT_PORTRAIT_01` | Editorial Portrait | lifestyle | full |
| `HAND_ELEGANCE_01` | Elegant Hand Detail | studio | hands_only |
| `SOFT_GLOW_01` | Soft Radiance | studio | none |
| `FASHION_CROP_01` | Fashion Editorial Crop | lifestyle | partial |
| `LUXE_AMBIENT_01` | Ambient Luxury | lifestyle | full |
| `MACRO_DETAIL_01` | Macro Product Detail | studio | none |
| `MODERN_MIN_01` | Modern Minimalist | abstract | none |

#### 4.3.3 Selection Logic

```typescript
interface ConceptSelectionInput {
  productAnalysis: GeminiAnalysisOutput['productAnalysis'];
  userMetadata: UserMetadata;
  conceptLibrary: ConceptDefinition[];
}

interface ConceptSelectionOutput {
  selectedConcepts: {
    conceptId: string;
    selectionRationale: string;
    adaptations: {  // Product-specific adjustments
      modelFramingOverride?: string;
      lightingAdjustment?: string;
      environmentModification?: string;
    };
  }[];
  
  rejectedConcepts: {
    conceptId: string;
    rejectionReason: string;
  }[];
}
```

#### 4.3.4 Category-Specific Model Rules

| Category | Allowed Model Presence | Framing Rules |
|----------|------------------------|---------------|
| Earrings | Full face, hands | Face visible, ears clearly shown |
| Necklace | Full face, neck focus | Neckline visible, face allowed |
| Ring | Hands only, no face | Elegant hand poses, no full body |
| Bracelet | Hands/wrist only | Wrist focus, cropped arm allowed |

### 4.4 Stage 3: Gemini Prompt Generation

#### 4.4.1 Purpose

Generate precise, identity-preserving prompts for Nano Banana Pro image generation based on selected concepts and product analysis.

#### 4.4.2 Prompt Structure

```typescript
interface GenerationPrompt {
  promptId: string;
  conceptId: string;
  
  basePrompt: string;           // Core visual description
  productDescription: string;    // Exact product characteristics
  identityConstraints: string;   // Hard constraints for preservation
  styleDirectives: string;       // Brand aesthetic requirements
  negativePrompt: string;        // Explicit exclusions
  
  technicalParameters: {
    aspectRatio: '1:1' | '4:5' | '9:16';
    qualityPreset: 'maximum';
    guidanceScale: number;
    referenceImageWeight: number;  // For product cutout adherence
  };
}
```

#### 4.4.3 Prompt Template System

**Base Template:**

```
[SCENE_SETUP]
Premium editorial jewelry advertising photograph.
[ENVIRONMENT_DESCRIPTION from concept]
[LIGHTING_DESCRIPTION from concept]

[PRODUCT_INTEGRATION]
Featuring [EXACT_PRODUCT_DESCRIPTION from analysis].
The jewelry piece maintains exact [GEOMETRY], [MATERIAL_FINISH], and [GEMSTONE_COUNT] as provided in reference.

[MODEL_DIRECTIVE if applicable]
[MODEL_DESCRIPTION based on category rules]
Turkish fashion editorial model, elegant pose, premium styling.

[BRAND_AESTHETIC]
Altınbaş luxury brand aesthetic.
Clean, minimal, premium quality.
Fashion magazine editorial grade.
White and blue-gray palette anchored to #517e9f.

[IDENTITY_LOCK]
CRITICAL: Preserve exact product geometry, gemstone count, chain structure, and material appearance from reference image.
```

**Negative Prompt Template:**

```
cheap, neon, low quality, blurry, distorted jewelry, changed gemstone count,
altered chain structure, modified metal color, added embellishments,
removed details, sexualized, explicit, competitor branding, stock photo aesthetic,
amateur lighting, incorrect material appearance, fantasy elements, unrealistic
```

#### 4.4.4 Gemini System Prompt (Prompt Generation Phase)

```
You are a luxury jewelry advertising prompt engineer.

Your task is to generate image generation prompts that:
1. Create premium editorial advertising visuals
2. PRESERVE exact product identity from the analysis
3. Enforce Altınbaş brand aesthetic constraints
4. Follow category-specific model visibility rules

INPUT: Product analysis, selected concept, brand guidelines
OUTPUT: Structured GenerationPrompt JSON

CRITICAL IDENTITY CONSTRAINTS:
- Gemstone count: [EXACT_COUNT] - must not change
- Chain type: [EXACT_TYPE] - must not change
- Metal finish: [EXACT_FINISH] - must be preserved
- Geometry: [EXACT_GEOMETRY] - zero tolerance for modification

Generate prompts that an image model can follow while maintaining product integrity.
```

### 4.5 Stage 4: Nano Banana Pro Image Generation

#### 4.5.1 Purpose

Generate identity-preserving advertising visuals using the product cutout as a reference image and Gemini-generated prompts.

#### 4.5.2 Adapter Interface

```typescript
interface NanoBananaProAdapter {
  generateImage(request: NanoBananaGenerationRequest): Promise<NanoBananaGenerationResponse>;
  checkGenerationStatus(jobId: string): Promise<GenerationStatus>;
  cancelGeneration(jobId: string): Promise<void>;
}

interface NanoBananaGenerationRequest {
  prompt: string;
  negativePrompt: string;
  
  referenceImage: {
    data: Base64EncodedImage;
    weight: number;  // 0.7-0.95 for identity preservation
    mode: 'reference' | 'controlnet';
  };
  
  parameters: {
    aspectRatio: '1:1' | '4:5' | '9:16';
    quality: 'standard' | 'high' | 'maximum';
    guidanceScale: number;
    steps: number;
    seed?: number;
  };
  
  outputFormat: {
    format: 'png' | 'jpeg';
    quality: number;
    resolution: {
      width: number;
      height: number;
    };
  };
}

interface NanoBananaGenerationResponse {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  images?: GeneratedImage[];
  error?: string;
  metadata: {
    generationTimeMs: number;
    modelVersion: string;
    seed: number;
  };
}

interface GeneratedImage {
  imageId: string;
  data: Base64EncodedImage;
  dimensions: { width: number; height: number };
  aspectRatio: string;
}
```

#### 4.5.3 Generation Parameters (Locked for MVP)

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Reference Image Weight | 0.85 | High weight for identity preservation |
| Guidance Scale | 7.5 | Balance between prompt adherence and coherence |
| Quality Preset | maximum | Required for advertising-grade output |
| Steps | 50 | Standard for high-quality generation |
| Output Resolution | 2048px (longest edge) | Sufficient for print and digital |

#### 4.5.4 Variation Generation

For each request, the system generates 3–4 variations:

- **Variation 1:** Exact prompt, seed A
- **Variation 2:** Exact prompt, seed B
- **Variation 3:** Slight lighting adjustment, seed C
- **Variation 4 (optional):** Alternative camera angle descriptor, seed D

### 4.6 Stage 5: Sora 2 Video Generation (Optional)

#### 4.6.1 Purpose

Generate short cinematic product videos from approved main images.

#### 4.6.2 Adapter Interface

```typescript
interface Sora2Adapter {
  generateVideo(request: Sora2GenerationRequest): Promise<Sora2GenerationResponse>;
  checkVideoStatus(jobId: string): Promise<VideoGenerationStatus>;
  cancelGeneration(jobId: string): Promise<void>;
}

interface Sora2GenerationRequest {
  sourceImage: Base64EncodedImage;  // Approved main visual
  
  motionTemplate: VideoMotionTemplate;
  
  parameters: {
    duration: number;  // seconds (3-10 for MVP)
    fps: 24 | 30;
    resolution: '1080p' | '4k';
    aspectRatio: '1:1' | '4:5' | '9:16';
  };
  
  identityConstraints: {
    productRegion: BoundingBox;  // Region containing the jewelry
    preservationWeight: number;   // 0.9+ for strict preservation
  };
}

type VideoMotionTemplate = 
  | 'slow_luxury_spin'      // Gentle rotation revealing product facets
  | 'light_sweep_reveal'    // Light moves across product, macro feel
  | 'subtle_shimmer'        // Minimal movement, gemstone light play
  | 'elegant_approach'      // Slow camera push toward product
  | 'soft_breathing';       // Ultra-subtle movement, living quality

interface Sora2GenerationResponse {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  video?: {
    videoId: string;
    data: Base64EncodedVideo;
    duration: number;
    format: 'mp4';
    resolution: string;
  };
  error?: string;
}
```

#### 4.6.3 Video Templates (MVP)

| Template | Description | Duration | Best For |
|----------|-------------|----------|----------|
| `slow_luxury_spin` | 15° gentle rotation | 3-5s | Rings, earrings |
| `light_sweep_reveal` | Light sweeps left to right | 3-4s | All categories |
| `subtle_shimmer` | Minimal movement, light play | 3s | Diamond pieces |
| `elegant_approach` | Slow 10% zoom | 4-5s | Necklaces, statement pieces |
| `soft_breathing` | 2% scale oscillation | 3s | Minimal pieces |

---

## 5. User Input & Asset Processing

### 5.1 User Input Requirements

#### 5.1.1 Required Metadata Fields

| Field | Type | Options | Required |
|-------|------|---------|----------|
| Category | enum | ring, necklace, earrings, bracelet | Yes |
| Gold Purity | enum | 14k, 18k, 22k | Yes |
| Gemstone | enum | diamond, zircon, none | Yes |
| Color | enum | yellow, rose, white | Yes |
| SKU | string | Alphanumeric | No (recommended) |
| Campaign Tag | string | Free text | No |

#### 5.1.2 Image Upload Requirements

**Primary Image (Required):**
- Minimum resolution: 1024×1024 pixels
- Maximum file size: 20MB
- Accepted formats: JPEG, PNG, WebP
- Requirements: Product clearly visible, sharp focus, adequate lighting

**Additional Angles (Optional):**
- Up to 3 supplementary images
- Same format/resolution requirements
- Purpose: Improve analysis accuracy for complex pieces

### 5.2 Asset Processing Pipeline

#### 5.2.1 Upload Processing Flow

```
[User Upload]
     │
     ▼
[Format Validation] ──────▶ [Reject if invalid format]
     │
     ▼
[Resolution Check] ───────▶ [Reject if below minimum]
     │
     ▼
[File Size Check] ────────▶ [Compress if oversized]
     │
     ▼
[EXIF Stripping] ─────────▶ [Remove metadata for privacy]
     │
     ▼
[Temporary Storage]
     │
     ▼
[Background Removal]
     │
     ▼
[Cutout Validation]
     │
     ▼
[Cutout Storage]
     │
     ▼
[Ready for Analysis]
```

#### 5.2.2 Background Removal Service

```typescript
interface BackgroundRemovalService {
  removeBackground(
    image: Base64EncodedImage,
    options: RemovalOptions
  ): Promise<CutoutResult>;
}

interface RemovalOptions {
  outputFormat: 'png';  // Always PNG for transparency
  edgeRefinement: 'standard' | 'high' | 'maximum';
  preserveReflections: boolean;
  preserveShadows: boolean;
}

interface CutoutResult {
  cutoutImage: Base64EncodedImage;
  maskImage: Base64EncodedImage;  // For reference
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  quality: {
    edgeSharpness: number;
    completeness: number;
    artifactScore: number;
  };
}
```

#### 5.2.3 Cutout Quality Validation

Automated validation ensures cutout quality before proceeding:

| Check | Threshold | Action on Failure |
|-------|-----------|-------------------|
| Edge sharpness | ≥0.85 | Re-process with higher refinement |
| Completeness | ≥0.95 | Flag for manual review |
| Artifact score | ≤0.1 | Re-process or reject |
| Product detected | true | Reject with error message |

### 5.3 Image Validation Rules

```typescript
interface ImageValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

type ValidationError = {
  code: string;
  message: string;
  field?: string;
};

// Validation checks performed:
const validationChecks = [
  'FORMAT_SUPPORTED',           // JPEG, PNG, WebP only
  'RESOLUTION_MINIMUM',         // ≥1024×1024
  'RESOLUTION_MAXIMUM',         // ≤8192×8192
  'FILE_SIZE_MAXIMUM',          // ≤20MB
  'ASPECT_RATIO_REASONABLE',    // Between 1:3 and 3:1
  'IMAGE_NOT_CORRUPTED',        // Parseable image data
  'PRODUCT_DETECTABLE',         // Post-cutout: product exists
  'PRODUCT_IN_FOCUS',           // Sharpness check
  'ADEQUATE_LIGHTING',          // Not too dark/bright
];
```

---

## 6. Brand Constraint Enforcement System

### 6.1 Overview

The Brand Constraint Engine operates at three stages: pre-generation, in-process, and post-generation. Its purpose is to ensure every output adheres to Altınbaş brand identity and product preservation requirements.

### 6.2 Pre-Generation Validation

#### 6.2.1 Input Validation

Before any AI processing begins:

```typescript
interface PreGenerationValidator {
  validate(
    metadata: UserMetadata,
    cutoutImage: CutoutResult,
    productAnalysis: GeminiAnalysisOutput
  ): ValidationResult;
}

interface ValidationResult {
  approved: boolean;
  blockers: BlockingIssue[];    // Must fix to proceed
  warnings: WarningIssue[];     // Can proceed but flagged
}
```

#### 6.2.2 Validation Rules

| Rule | Description | Severity |
|------|-------------|----------|
| Metadata-Analysis Match | User-declared category matches detected | Blocker |
| Image Quality Threshold | Cutout quality scores pass minimums | Blocker |
| Product Completeness | Full product visible in cutout | Blocker |
| Analysis Confidence | Gemini confidence ≥0.8 | Warning |
| Gemstone Count Reasonable | Count within typical range for category | Warning |

### 6.3 In-Process Monitoring

#### 6.3.1 Prompt Compliance Check

Before sending prompts to Nano Banana Pro:

```typescript
interface PromptComplianceChecker {
  checkPrompt(prompt: GenerationPrompt): ComplianceResult;
}

interface ComplianceResult {
  compliant: boolean;
  violations: PromptViolation[];
  sanitizedPrompt?: GenerationPrompt;  // If auto-fixable
}

type PromptViolation = {
  type: 'FORBIDDEN_TERM' | 'MISSING_CONSTRAINT' | 'BRAND_MISMATCH';
  detail: string;
  severity: 'blocker' | 'warning';
  autoFixable: boolean;
};
```

#### 6.3.2 Forbidden Terms List

The prompt compliance checker maintains a blocklist:

```typescript
const forbiddenTerms = {
  aesthetic: [
    'neon', 'cheap', 'budget', 'flashy', 'gaudy', 'tacky',
    'disco', 'rave', 'grunge', 'gothic', 'punk'
  ],
  inappropriate: [
    'sexy', 'seductive', 'provocative', 'revealing', 'sultry',
    'sensual', 'erotic', 'nude', 'naked'
  ],
  competitor: [
    'cartier', 'tiffany', 'bulgari', 'van cleef', 'chopard',
    'graff', 'harry winston', 'piaget'
  ],
  quality: [
    'low quality', 'amateur', 'stock photo', 'generic',
    'clipart', 'simple', 'basic'
  ]
};
```

#### 6.3.3 Required Constraints

Every prompt must include:

```typescript
const requiredConstraints = [
  'preserve exact product geometry',
  'maintain gemstone count',
  'preserve metal finish appearance',
  'maintain chain structure',  // If applicable
  'Altınbaş brand aesthetic',
  'premium quality',
  'editorial standard'
];
```

### 6.4 Post-Generation Auditing

#### 6.4.1 Identity Verification

After Nano Banana Pro returns generated images:

```typescript
interface PostGenerationAuditor {
  auditOutput(
    generatedImage: GeneratedImage,
    originalCutout: CutoutResult,
    identityFingerprint: IdentityFingerprint
  ): AuditResult;
}

interface AuditResult {
  passed: boolean;
  identityScore: number;        // 0-100, must be ≥85
  brandComplianceScore: number; // 0-100, must be ≥90
  issues: AuditIssue[];
  recommendation: 'approve' | 'flag_for_review' | 'reject';
}
```

#### 6.4.2 Identity Comparison (Gemini-Based)

The system uses Gemini to compare the generated image against the original:

```typescript
interface IdentityComparisonRequest {
  originalCutout: Base64EncodedImage;
  generatedImage: Base64EncodedImage;
  expectedCharacteristics: {
    gemstoneCount: number;
    chainType?: string;
    metalFinish: string;
    geometry: string;
  };
}

interface IdentityComparisonResponse {
  identityPreserved: boolean;
  confidenceScore: number;
  discrepancies: {
    type: 'gemstone_count' | 'geometry' | 'material' | 'chain' | 'other';
    description: string;
    severity: 'minor' | 'major' | 'critical';
  }[];
}
```

#### 6.4.3 Gemini System Prompt (Post-Generation Audit)

```
You are a jewelry identity verification system for quality control.

Compare the generated advertising image against the original product cutout.
Verify that the jewelry piece in the generated image matches the original EXACTLY.

CHECK THESE CHARACTERISTICS:
1. Gemstone count: Must match exactly ([EXPECTED_COUNT])
2. Geometry: Shape, proportions, design elements must match
3. Material appearance: Metal color and finish must match
4. Chain structure (if applicable): Link style, length impression must match
5. Setting type: Gemstone settings must match original

OUTPUT: IdentityComparisonResponse JSON

CRITICAL: Any discrepancy in gemstone count or major geometry is a CRITICAL failure.
The jewelry industry has zero tolerance for misrepresentation.
```

### 6.5 Brand Overlay Application

#### 6.5.1 Logo Placement

```typescript
interface BrandOverlayConfig {
  logo: {
    source: 'altinbas_logo_white.png';
    position: 'bottom_right' | 'bottom_left' | 'top_right';
    margin: { x: number; y: number };  // Percentage of image dimension
    size: { width: number; height: number };  // Percentage of image width
    opacity: number;  // 0.8-1.0
  };
  
  watermark?: {
    enabled: boolean;
    text: string;
    opacity: number;
  };
}
```

#### 6.5.2 Default Brand Overlay Settings

| Setting | Value |
|---------|-------|
| Logo position | bottom_right |
| Logo margin | 3% from edge |
| Logo width | 15% of image width |
| Logo opacity | 0.95 |
| Text color (if any) | #FFFFFF |
| Background palette anchor | #517e9f |

### 6.6 Hard Constraint Summary

**ABSOLUTE CONSTRAINTS (Zero Tolerance):**

| Constraint | Description | Enforcement Stage |
|------------|-------------|-------------------|
| Gemstone Count | Must match original exactly | Pre, Post |
| Product Geometry | Shape/proportions preserved | Post |
| Chain Structure | Link style/arrangement preserved | Post |
| Material Accuracy | No invented materials | Pre (prompt), Post |
| Brand Compliance | Altınbaş aesthetic only | Pre, In-Process, Post |
| No Redesign | Enhancement only, no reinterpretation | All stages |

---

## 7. Output Generation Specification

### 7.1 Output Types

#### 7.1.1 MVP Required Outputs

**Lifestyle Editorial Advertising Visual**
- Primary deliverable
- 3–4 variations per request
- Multiple aspect ratios supported

#### 7.1.2 Optional Outputs

**E-commerce Product Render**
- Clean white background
- Product-only, no model
- 1:1 and 9:16 aspect ratios

**Short Cinematic Product Video**
- Single template per request
- 3–10 second duration
- Matches main visual style

### 7.2 Aspect Ratio Specifications

| Aspect Ratio | Dimensions (2048px base) | Use Case |
|--------------|--------------------------|----------|
| 1:1 | 2048 × 2048 | Instagram feed, general social |
| 4:5 | 1638 × 2048 | Instagram feed (preferred) |
| 9:16 | 1152 × 2048 | Stories, Reels, TikTok, vertical ads |

### 7.3 Variation Generation Strategy

For each generation request:

```typescript
interface VariationStrategy {
  totalVariations: 3 | 4;
  
  variations: {
    variationIndex: number;
    seedStrategy: 'random' | 'sequential';
    promptModifications: {
      lighting?: 'warm_shift' | 'cool_shift' | 'dramatic' | 'soft';
      cameraAngle?: 'slight_left' | 'slight_right' | 'direct';
      depth?: 'shallow' | 'medium' | 'deep';
    };
  }[];
}
```

**Default Variation Set:**

| Variation | Seed | Lighting | Camera |
|-----------|------|----------|--------|
| 1 | Random A | Base (from concept) | Direct |
| 2 | Random B | Warm shift | Slight left |
| 3 | Random C | Cool shift | Slight right |
| 4 | Random D | Dramatic | Direct |

### 7.4 Output Quality Requirements

| Parameter | Requirement |
|-----------|-------------|
| Minimum resolution | 2048px (longest edge) |
| Color depth | 24-bit RGB |
| Format | PNG (lossless) or JPEG (95+ quality) |
| Color profile | sRGB |
| Sharpness | No visible softness at 100% |
| Noise | Imperceptible at standard viewing |
| Artifacts | None visible |

### 7.5 Export Specifications

#### 7.5.1 Export Formats

```typescript
interface ExportOptions {
  format: 'png' | 'jpeg' | 'webp' | 'tiff';
  quality: number;  // 1-100 for lossy formats
  resolution: {
    preset: 'original' | 'web_optimized' | 'print_ready' | 'custom';
    customDimensions?: { width: number; height: number };
  };
  includeMetadata: boolean;
  includeLogo: boolean;
  packaging: 'individual' | 'zip_archive';
}
```

#### 7.5.2 Export Presets

| Preset | Format | Resolution | Use Case |
|--------|--------|------------|----------|
| Web Optimized | WebP | 1200px max | Social media, web |
| Print Ready | TIFF | 4096px max | Print advertising |
| Original | PNG | Native | Archive, further editing |
| Social Quick | JPEG (90) | 1080px | Fast social posting |

---

## 8. Moderation & Review System

### 8.1 Workflow Overview

```
[Generation Complete]
       │
       ▼
[Auto-Audit] ─────────────────────────────────▶ [Auto-Reject]
       │                                              │
       │ (passed)                                     │ (critical issues)
       ▼                                              ▼
[Review Queue]                                  [Error State]
       │                                              │
       ▼                                              ▼
[User Review Screen]                           [Notification to User]
       │
       ├──▶ [Approve] ──────▶ [Export Ready]
       │
       ├──▶ [Regenerate Same Concept] ──────▶ [Generation Queue]
       │
       ├──▶ [Change Concept] ──────▶ [Concept Selection]
       │
       └──▶ [Reject All] ──────▶ [Session Closed]
```

### 8.2 Review Screen Requirements

#### 8.2.1 UI Components

```typescript
interface ReviewScreenState {
  sessionId: string;
  
  originalProduct: {
    cutoutImage: ImageURL;
    metadata: UserMetadata;
    analysisData: ProductAnalysis;
  };
  
  generatedVariations: {
    variationId: string;
    imageUrl: ImageURL;
    conceptId: string;
    conceptName: string;
    aspectRatio: string;
    auditResult: AuditResult;
    selected: boolean;
  }[];
  
  availableActions: ('approve' | 'regenerate' | 'change_concept' | 'reject')[];
}
```

#### 8.2.2 Review Actions

| Action | Description | Result |
|--------|-------------|--------|
| Approve | Accept selected variation(s) | Move to export-ready state |
| Regenerate | Generate new variations, same concept | New generation job queued |
| Change Concept | Select different concept, regenerate | Return to concept selection |
| Reject All | Discard all outputs | Session closed, feedback collected |

### 8.3 Regeneration Limits

| Constraint | Limit | Rationale |
|------------|-------|-----------|
| Regenerations per concept | 3 | Prevent infinite loops |
| Concept changes per session | 2 | Encourage decisive selection |
| Total generations per session | 12 | Resource management |

### 8.4 Feedback Collection

On rejection or repeated regeneration:

```typescript
interface UserFeedback {
  sessionId: string;
  action: 'reject' | 'regenerate' | 'change_concept';
  reason?: string;  // Free text
  issueCategories: (
    | 'product_identity_issue'
    | 'aesthetic_mismatch'
    | 'quality_issue'
    | 'brand_compliance'
    | 'model_appearance'
    | 'lighting_issue'
    | 'other'
  )[];
}
```

---

## 9. Data Storage Design (Airtable)

### 9.1 Overview

Airtable serves as the primary datastore for MVP. The schema is designed to support the full workflow while maintaining simplicity and queryability.

### 9.2 Base Structure

**Base Name:** `Altinbas_AI_Advertising_Engine`

### 9.3 Table Definitions

#### 9.3.1 Products Table

Stores information about uploaded products and their analysis.

| Field Name | Field Type | Description |
|------------|------------|-------------|
| `product_id` | Auto Number | Primary key |
| `sku` | Single Line Text | Product SKU (optional) |
| `category` | Single Select | ring, necklace, earrings, bracelet |
| `gold_purity` | Single Select | 14k, 18k, 22k |
| `gemstone` | Single Select | diamond, zircon, none |
| `color` | Single Select | yellow, rose, white |
| `source_image` | Attachment | Original uploaded image |
| `cutout_image` | Attachment | Background-removed cutout |
| `additional_angles` | Attachment | Additional angle images |
| `gemini_analysis` | Long Text | JSON blob of analysis output |
| `identity_fingerprint` | Long Text | JSON blob for verification |
| `created_at` | Created Time | Record creation timestamp |
| `created_by` | Collaborator | User who uploaded |

#### 9.3.2 Sessions Table

Tracks each generation session from start to completion.

| Field Name | Field Type | Description |
|------------|------------|-------------|
| `session_id` | Auto Number | Primary key |
| `product` | Link to Products | Related product record |
| `status` | Single Select | draft, analyzing, generating, reviewing, completed, failed, cancelled |
| `selected_concepts` | Long Text | JSON array of concept IDs |
| `generation_prompts` | Long Text | JSON array of generated prompts |
| `regeneration_count` | Number | Times regenerated |
| `concept_change_count` | Number | Times concept changed |
| `started_at` | Date Time | Session start |
| `completed_at` | Date Time | Session completion (if applicable) |
| `user` | Collaborator | User running session |
| `error_log` | Long Text | Error details if failed |

#### 9.3.3 Outputs Table

Stores all generated images and videos.

| Field Name | Field Type | Description |
|------------|------------|-------------|
| `output_id` | Auto Number | Primary key |
| `session` | Link to Sessions | Related session |
| `output_type` | Single Select | lifestyle_visual, ecommerce_render, video |
| `concept_id` | Single Line Text | Concept used for generation |
| `aspect_ratio` | Single Select | 1:1, 4:5, 9:16 |
| `variation_index` | Number | Variation number (1-4) |
| `image_file` | Attachment | Generated image/video file |
| `thumbnail` | Attachment | Low-res preview |
| `audit_passed` | Checkbox | Post-generation audit result |
| `audit_details` | Long Text | JSON audit results |
| `identity_score` | Number | 0-100 identity preservation score |
| `brand_score` | Number | 0-100 brand compliance score |
| `status` | Single Select | pending_review, approved, rejected, exported |
| `approved_at` | Date Time | Approval timestamp |
| `generated_at` | Created Time | Generation timestamp |
| `seed` | Number | Generation seed for reproducibility |

#### 9.3.4 Exports Table

Tracks all export operations.

| Field Name | Field Type | Description |
|------------|------------|-------------|
| `export_id` | Auto Number | Primary key |
| `outputs` | Link to Outputs | Exported outputs (multiple) |
| `format` | Single Select | png, jpeg, webp, tiff |
| `resolution_preset` | Single Select | original, web_optimized, print_ready |
| `include_logo` | Checkbox | Logo overlay included |
| `export_file` | Attachment | Exported file(s) or archive |
| `download_url` | URL | CDN download link |
| `exported_at` | Created Time | Export timestamp |
| `exported_by` | Collaborator | User who exported |
| `download_count` | Number | Times downloaded |

#### 9.3.5 Audit_Logs Table

Comprehensive audit trail for compliance and debugging.

| Field Name | Field Type | Description |
|------------|------------|-------------|
| `log_id` | Auto Number | Primary key |
| `session` | Link to Sessions | Related session |
| `event_type` | Single Select | upload, analysis, generation, audit, review_action, export, error |
| `event_data` | Long Text | JSON payload of event details |
| `timestamp` | Created Time | Event timestamp |
| `user` | Collaborator | User involved |
| `ai_provider` | Single Select | gemini, nano_banana_pro, sora_2 |
| `duration_ms` | Number | Operation duration |
| `success` | Checkbox | Operation succeeded |

#### 9.3.6 Concepts Table

Stores the curated concept library.

| Field Name | Field Type | Description |
|------------|------------|-------------|
| `concept_id` | Single Line Text | Unique concept identifier |
| `name` | Single Line Text | Display name |
| `description` | Long Text | Concept description |
| `applicable_categories` | Multiple Select | ring, necklace, earrings, bracelet |
| `environment_type` | Single Select | studio, lifestyle, abstract |
| `model_presence` | Single Select | none, hands_only, partial, full |
| `visual_parameters` | Long Text | JSON of visual config |
| `brand_alignment_score` | Number | 0-100 |
| `premium_indicator` | Single Select | standard, elevated, ultra_premium |
| `active` | Checkbox | Available for selection |
| `usage_count` | Count | Times used (rollup from Sessions) |

#### 9.3.7 Users Table

User management for internal staff.

| Field Name | Field Type | Description |
|------------|------------|-------------|
| `user_id` | Auto Number | Primary key |
| `email` | Email | User email |
| `name` | Single Line Text | Display name |
| `role` | Single Select | coordinator, director, manager, admin |
| `department` | Single Line Text | Department |
| `active` | Checkbox | Account active |
| `created_at` | Created Time | Account creation |
| `last_active` | Date Time | Last activity |
| `session_count` | Count | Total sessions (rollup) |

### 9.4 Relationships Diagram

```
Users
  │
  ├──< Products (created_by)
  │       │
  │       └──< Sessions (product)
  │               │
  │               ├──< Outputs (session)
  │               │       │
  │               │       └──< Exports (outputs)
  │               │
  │               └──< Audit_Logs (session)
  │
  └──< Exports (exported_by)

Concepts (standalone, referenced by ID in Sessions.selected_concepts)
```

### 9.5 Airtable API Integration

```typescript
interface AirtableConfig {
  baseId: string;
  apiKey: string;  // Stored in environment variables
  tables: {
    products: string;
    sessions: string;
    outputs: string;
    exports: string;
    auditLogs: string;
    concepts: string;
    users: string;
  };
}

interface AirtableService {
  // Products
  createProduct(data: ProductCreateInput): Promise<ProductRecord>;
  getProduct(productId: string): Promise<ProductRecord>;
  updateProduct(productId: string, data: Partial<ProductRecord>): Promise<ProductRecord>;
  
  // Sessions
  createSession(data: SessionCreateInput): Promise<SessionRecord>;
  updateSessionStatus(sessionId: string, status: SessionStatus): Promise<SessionRecord>;
  getSessionWithOutputs(sessionId: string): Promise<SessionWithOutputs>;
  
  // Outputs
  createOutput(data: OutputCreateInput): Promise<OutputRecord>;
  updateOutputStatus(outputId: string, status: OutputStatus): Promise<OutputRecord>;
  getOutputsForSession(sessionId: string): Promise<OutputRecord[]>;
  
  // Exports
  createExport(data: ExportCreateInput): Promise<ExportRecord>;
  incrementDownloadCount(exportId: string): Promise<void>;
  
  // Audit
  logEvent(event: AuditEvent): Promise<void>;
  
  // Concepts
  getActiveConcepts(): Promise<ConceptRecord[]>;
  getConceptsByCategory(category: ProductCategory): Promise<ConceptRecord[]>;
}
```

### 9.6 File Storage Strategy

Airtable attachments have size limits. Strategy for large files:

1. **Thumbnails & Previews:** Store directly in Airtable (≤5MB)
2. **Full-Resolution Images:** Store in external CDN, reference URL in Airtable
3. **Videos:** Always external CDN, reference URL in Airtable

```typescript
interface FileStorageService {
  uploadToStorage(file: Buffer, options: UploadOptions): Promise<StoredFile>;
  getSignedUrl(fileKey: string, expirationMinutes: number): Promise<string>;
  deleteFile(fileKey: string): Promise<void>;
}

interface StoredFile {
  fileKey: string;
  publicUrl: string;
  cdnUrl: string;
  size: number;
  contentType: string;
}
```

---

## 10. API & Service Layer

### 10.1 Service Architecture

```typescript
// Core Services
interface CoreServices {
  assetProcessor: AssetProcessorService;
  geminiAdapter: GeminiAdapterService;
  nanoBananaAdapter: NanoBananaAdapterService;
  sora2Adapter: Sora2AdapterService;
  brandConstraintEngine: BrandConstraintEngineService;
  pipelineOrchestrator: PipelineOrchestratorService;
  storageService: StorageService;
  airtableService: AirtableService;
}
```

### 10.2 API Endpoints

#### 10.2.1 Product & Upload Endpoints

```
POST   /api/v1/products
       - Upload product image and metadata
       - Returns: product_id, cutout preview
       
GET    /api/v1/products/:productId
       - Retrieve product details and analysis
       
DELETE /api/v1/products/:productId
       - Delete product and associated data
```

#### 10.2.2 Session Endpoints

```
POST   /api/v1/sessions
       - Create new generation session
       - Body: { product_id }
       - Returns: session_id, status
       
GET    /api/v1/sessions/:sessionId
       - Get session status and details
       
POST   /api/v1/sessions/:sessionId/analyze
       - Trigger Gemini analysis
       - Returns: analysis results, suggested concepts
       
POST   /api/v1/sessions/:sessionId/generate
       - Trigger image generation
       - Body: { concept_ids: string[], aspect_ratios: string[] }
       - Returns: job_id, estimated_time
       
GET    /api/v1/sessions/:sessionId/outputs
       - List all generated outputs for session
       
POST   /api/v1/sessions/:sessionId/regenerate
       - Regenerate with same concepts
       
POST   /api/v1/sessions/:sessionId/change-concept
       - Change concepts and regenerate
       - Body: { new_concept_ids: string[] }
       
DELETE /api/v1/sessions/:sessionId
       - Cancel session
```

#### 10.2.3 Output Endpoints

```
GET    /api/v1/outputs/:outputId
       - Get single output details
       
POST   /api/v1/outputs/:outputId/approve
       - Approve output for export
       
POST   /api/v1/outputs/:outputId/reject
       - Reject output
       - Body: { reason?: string }
```

#### 10.2.4 Export Endpoints

```
POST   /api/v1/exports
       - Create export from approved outputs
       - Body: { output_ids: string[], format, resolution_preset, include_logo }
       - Returns: export_id, download_url
       
GET    /api/v1/exports/:exportId
       - Get export status and download link
       
GET    /api/v1/exports/:exportId/download
       - Download export file (increments counter)
```

#### 10.2.5 Video Generation Endpoints

```
POST   /api/v1/videos
       - Generate video from approved output
       - Body: { output_id, motion_template, duration, aspect_ratio }
       - Returns: video_job_id, estimated_time
       
GET    /api/v1/videos/:videoJobId
       - Get video generation status
       
GET    /api/v1/videos/:videoJobId/download
       - Download generated video
```

#### 10.2.6 Concept Endpoints

```
GET    /api/v1/concepts
       - List all active concepts
       - Query: ?category=ring
       
GET    /api/v1/concepts/:conceptId
       - Get concept details
```

### 10.3 WebSocket Events

For real-time status updates:

```typescript
interface WebSocketEvents {
  // Client → Server
  'session:subscribe': { sessionId: string };
  'session:unsubscribe': { sessionId: string };
  
  // Server → Client
  'session:status_changed': { sessionId: string; status: SessionStatus; };
  'generation:progress': { sessionId: string; progress: number; stage: string; };
  'generation:completed': { sessionId: string; outputIds: string[]; };
  'generation:failed': { sessionId: string; error: string; };
  'video:progress': { videoJobId: string; progress: number; };
  'video:completed': { videoJobId: string; videoUrl: string; };
}
```

### 10.4 Error Handling

```typescript
interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: ISO8601Timestamp;
  requestId: string;
}

// Error codes
const ErrorCodes = {
  // Validation errors (400)
  INVALID_IMAGE_FORMAT: 'E4001',
  INVALID_METADATA: 'E4002',
  IMAGE_TOO_SMALL: 'E4003',
  IMAGE_TOO_LARGE: 'E4004',
  
  // Processing errors (422)
  BACKGROUND_REMOVAL_FAILED: 'E4221',
  ANALYSIS_FAILED: 'E4222',
  GENERATION_FAILED: 'E4223',
  IDENTITY_VERIFICATION_FAILED: 'E4224',
  BRAND_COMPLIANCE_FAILED: 'E4225',
  
  // Rate limiting (429)
  RATE_LIMIT_EXCEEDED: 'E4290',
  GENERATION_LIMIT_EXCEEDED: 'E4291',
  
  // Server errors (500)
  AI_PROVIDER_ERROR: 'E5001',
  STORAGE_ERROR: 'E5002',
  INTERNAL_ERROR: 'E5000',
};
```

---

## 11. Mobile-First UI Architecture

### 11.1 Design Principles

1. **Touch-First Interaction:** All controls optimized for thumb reach zones
2. **Progressive Disclosure:** Complex options hidden until needed
3. **Visual Feedback:** Immediate response to all user actions
4. **Offline Resilience:** Core viewing functions work offline
5. **Performance:** Sub-second response for all UI interactions

### 11.2 Screen Architecture

#### 11.2.1 Navigation Structure

```
┌─────────────────────────────────────────┐
│            Bottom Tab Bar               │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │
│  │ New │ │Queue│ │Arch-│ │Sett-│      │
│  │     │ │     │ │ive  │ │ings │      │
│  └─────┘ └─────┘ └─────┘ └─────┘      │
└─────────────────────────────────────────┘
```

**Tab Definitions:**

| Tab | Screen | Purpose |
|-----|--------|---------|
| New | Upload Flow | Create new generation |
| Queue | Active Sessions | Monitor in-progress work |
| Archive | Output Gallery | Browse completed outputs |
| Settings | Configuration | App settings, profile |

#### 11.2.2 Upload Flow Screens

**Screen 1: Image Upload**

```
┌─────────────────────────────────────────┐
│  ← New Generation                       │
├─────────────────────────────────────────┤
│                                         │
│     ┌───────────────────────────┐       │
│     │                           │       │
│     │    [Camera/Gallery]       │       │
│     │      Upload Area          │       │
│     │                           │       │
│     │    Tap to upload          │       │
│     │    or drag & drop         │       │
│     │                           │       │
│     └───────────────────────────┘       │
│                                         │
│     ○ Add more angles (optional)        │
│                                         │
│     ┌───┐ ┌───┐ ┌───┐                  │
│     │ + │ │   │ │   │  Additional      │
│     └───┘ └───┘ └───┘  angles          │
│                                         │
├─────────────────────────────────────────┤
│           [ Continue → ]                │
└─────────────────────────────────────────┘
```

**Screen 2: Metadata Input**

```
┌─────────────────────────────────────────┐
│  ← Product Details                      │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────┐                        │
│  │  [Preview]  │   Category *           │
│  │   Cutout    │   ┌─────────────────┐  │
│  └─────────────┘   │ Ring         ▼ │  │
│                    └─────────────────┘  │
│                                         │
│  Gold Purity *      Color *             │
│  ┌───────────┐      ┌───────────┐       │
│  │ 18k    ▼ │      │ Yellow  ▼ │       │
│  └───────────┘      └───────────┘       │
│                                         │
│  Gemstone *         SKU (optional)      │
│  ┌───────────┐      ┌───────────┐       │
│  │Diamond ▼ │      │           │       │
│  └───────────┘      └───────────┘       │
│                                         │
│  Campaign Tag (optional)                │
│  ┌─────────────────────────────────┐    │
│  │                                 │    │
│  └─────────────────────────────────┘    │
│                                         │
├─────────────────────────────────────────┤
│           [ Analyze Product → ]         │
└─────────────────────────────────────────┘
```

**Screen 3: Analysis & Concept Selection**

```
┌─────────────────────────────────────────┐
│  ← Concept Selection                    │
├─────────────────────────────────────────┤
│                                         │
│  Product Analysis                       │
│  ┌─────────────────────────────────┐    │
│  │ ✓ 18k Yellow Gold Ring          │    │
│  │ ✓ 3 Diamonds detected           │    │
│  │ ✓ Polished finish               │    │
│  │ ✓ Solitaire setting             │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Recommended Concepts (select 1-4)      │
│                                         │
│  ┌──────────┐  ┌──────────┐             │
│  │[Preview] │  │[Preview] │             │
│  │ Minimal  │  │ Editorial│             │
│  │ Studio   │  │ Portrait │             │
│  │  ☑       │  │  ☐       │             │
│  └──────────┘  └──────────┘             │
│                                         │
│  ┌──────────┐  ┌──────────┐             │
│  │[Preview] │  │[Preview] │             │
│  │ Hand     │  │ Soft     │             │
│  │ Elegance │  │ Radiance │             │
│  │  ☑       │  │  ☐       │             │
│  └──────────┘  └──────────┘             │
│                                         │
│  Aspect Ratios                          │
│  ☑ 1:1   ☑ 4:5   ☐ 9:16                │
│                                         │
├─────────────────────────────────────────┤
│         [ Generate Visuals → ]          │
└─────────────────────────────────────────┘
```

**Screen 4: Generation Progress**

```
┌─────────────────────────────────────────┐
│           Generating...                 │
├─────────────────────────────────────────┤
│                                         │
│                                         │
│        ┌─────────────────────┐          │
│        │                     │          │
│        │    [Product         │          │
│        │     Cutout]         │          │
│        │                     │          │
│        └─────────────────────┘          │
│                                         │
│        Creating your visuals            │
│                                         │
│        ████████████░░░░░░░░  67%        │
│                                         │
│        Rendering Variation 3 of 4...    │
│                                         │
│        Estimated: ~45 seconds           │
│                                         │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│             [ Cancel ]                  │
└─────────────────────────────────────────┘
```

**Screen 5: Review Gallery**

```
┌─────────────────────────────────────────┐
│  ← Review Outputs            [Export ▼] │
├─────────────────────────────────────────┤
│                                         │
│  Minimal Studio (1:1)                   │
│  ┌──────────┐  ┌──────────┐             │
│  │[Output 1]│  │[Output 2]│             │
│  │   ☑      │  │   ☐      │             │
│  │ ID: 98%  │  │ ID: 96%  │             │
│  └──────────┘  └──────────┘             │
│                                         │
│  Hand Elegance (1:1)                    │
│  ┌──────────┐  ┌──────────┐             │
│  │[Output 3]│  │[Output 4]│             │
│  │   ☐      │  │   ☑      │             │
│  │ ID: 97%  │  │ ID: 95%  │             │
│  └──────────┘  └──────────┘             │
│                                         │
│  2 selected                             │
│                                         │
├─────────────────────────────────────────┤
│  [Regenerate] [Change Concept] [Approve]│
└─────────────────────────────────────────┘
```

**Screen 6: Export Options**

```
┌─────────────────────────────────────────┐
│  ← Export Settings                      │
├─────────────────────────────────────────┤
│                                         │
│  Selected Outputs: 2                    │
│                                         │
│  Format                                 │
│  ○ PNG (Lossless)                       │
│  ● JPEG (High Quality)                  │
│  ○ WebP (Web Optimized)                 │
│  ○ TIFF (Print Ready)                   │
│                                         │
│  Resolution                             │
│  ○ Original (2048px)                    │
│  ● Web Optimized (1200px)               │
│  ○ Print Ready (4096px)                 │
│                                         │
│  Options                                │
│  ☑ Include Altınbaş logo                │
│  ☐ Include metadata                     │
│  ☑ Package as ZIP archive               │
│                                         │
├─────────────────────────────────────────┤
│         [ Export & Download ]           │
└─────────────────────────────────────────┘
```

### 11.3 Component Library

```typescript
// Core UI Components
interface UIComponents {
  // Input
  ImageUploader: Component;
  MetadataForm: Component;
  ConceptSelector: Component;
  AspectRatioToggle: Component;
  
  // Display
  ProductPreview: Component;
  OutputGallery: Component;
  OutputCard: Component;
  ProgressIndicator: Component;
  AnalysisDisplay: Component;
  
  // Actions
  PrimaryButton: Component;
  SecondaryButton: Component;
  ActionSheet: Component;
  BottomSheet: Component;
  
  // Feedback
  Toast: Component;
  LoadingOverlay: Component;
  ErrorState: Component;
  EmptyState: Component;
}
```

### 11.4 Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile S | 320px | Single column, full-width cards |
| Mobile M | 375px | Single column, full-width cards |
| Mobile L | 425px | Single column, slight margins |
| Tablet | 768px | Two-column gallery, side metadata |
| Desktop | 1024px+ | Three-column gallery, sidebar |

---

## 12. Antigravity Integration

### 12.1 Project Structure

```
altinbas-ai-advertising/
├── .antigravity/
│   ├── config.yaml              # Antigravity configuration
│   └── secrets.encrypted        # Encrypted credentials
├── src/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── products.ts
│   │   │   ├── sessions.ts
│   │   │   ├── outputs.ts
│   │   │   ├── exports.ts
│   │   │   └── videos.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── validation.ts
│   │   │   └── rateLimit.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── orchestrator/
│   │   │   ├── PipelineOrchestrator.ts
│   │   │   └── SessionManager.ts
│   │   ├── ai/
│   │   │   ├── adapters/
│   │   │   │   ├── GeminiAdapter.ts
│   │   │   │   ├── NanoBananaAdapter.ts
│   │   │   │   └── Sora2Adapter.ts
│   │   │   ├── PromptEngine.ts
│   │   │   └── ConceptSelector.ts
│   │   ├── brand/
│   │   │   ├── BrandConstraintEngine.ts
│   │   │   ├── PreValidator.ts
│   │   │   ├── PromptChecker.ts
│   │   │   └── PostAuditor.ts
│   │   ├── asset/
│   │   │   ├── BackgroundRemover.ts
│   │   │   ├── ImageValidator.ts
│   │   │   ├── BrandOverlay.ts
│   │   │   └── FormatExporter.ts
│   │   └── storage/
│   │       ├── AirtableService.ts
│   │       ├── FileStorageService.ts
│   │       └── CacheService.ts
│   ├── types/
│   │   ├── api.ts
│   │   ├── models.ts
│   │   ├── ai.ts
│   │   └── brand.ts
│   ├── config/
│   │   ├── brand.config.ts       # Brand constraints
│   │   ├── concepts.config.ts    # Concept library
│   │   └── ai.config.ts          # AI provider settings
│   └── utils/
│       ├── imageProcessing.ts
│       ├── validation.ts
│       └── logging.ts
├── client/
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── store/
│   ├── public/
│   │   └── assets/
│   │       └── altinbas_logo_white.png
│   └── package.json
├── scripts/
│   ├── seed-concepts.ts          # Populate concept library
│   └── test-providers.ts         # Validate AI provider connections
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── package.json
└── README.md
```

### 12.2 Antigravity Configuration

```yaml
# .antigravity/config.yaml
project:
  name: altinbas-ai-advertising
  version: 1.0.0
  
runtime:
  node: 20.x
  
services:
  api:
    type: express
    port: 3000
    
  client:
    type: react
    build: vite
    
providers:
  ai:
    gemini:
      endpoint: ${GEMINI_API_ENDPOINT}
      apiKey: ${GEMINI_API_KEY}
    nanoBananaPro:
      endpoint: ${NANO_BANANA_API_ENDPOINT}
      apiKey: ${NANO_BANANA_API_KEY}
    sora2:
      endpoint: ${SORA2_API_ENDPOINT}
      apiKey: ${SORA2_API_KEY}
      
  storage:
    airtable:
      baseId: ${AIRTABLE_BASE_ID}
      apiKey: ${AIRTABLE_API_KEY}
    cdn:
      provider: cloudflare
      bucket: ${CDN_BUCKET}
      
  auth:
    provider: clerk
    domain: ${CLERK_DOMAIN}
    
deployments:
  staging:
    domain: staging.altinbas-ai.antigravity.dev
  production:
    domain: ai.altinbas.com
```

### 12.3 Development Milestones

#### Milestone 1: Foundation (Week 1-2)

| Deliverable | Description |
|-------------|-------------|
| Project scaffolding | Antigravity project setup, directory structure |
| Airtable schema | All tables created and configured |
| Auth integration | Clerk authentication for internal users |
| Basic API structure | Express routes with validation |
| File upload | Image upload with validation |

#### Milestone 2: Asset Pipeline (Week 3-4)

| Deliverable | Description |
|-------------|-------------|
| Background removal | Integration with removal service |
| Image validation | Resolution, format, quality checks |
| Cutout storage | CDN upload and Airtable linking |
| Asset processing tests | Unit and integration tests |

#### Milestone 3: AI Integration (Week 5-7)

| Deliverable | Description |
|-------------|-------------|
| Gemini adapter | Analysis and prompt generation |
| Nano Banana adapter | Image generation integration |
| Concept library | Initial concept set configured |
| Prompt engine | Template system operational |
| Brand constraint engine | Pre/post validation |

#### Milestone 4: Generation Pipeline (Week 8-9)

| Deliverable | Description |
|-------------|-------------|
| Pipeline orchestrator | Full workflow orchestration |
| Variation generation | 3-4 variations per request |
| Post-generation audit | Identity verification |
| Brand overlay | Logo application |
| Output storage | CDN + Airtable archival |

#### Milestone 5: UI Development (Week 10-12)

| Deliverable | Description |
|-------------|-------------|
| Mobile-first client | React PWA with all screens |
| Upload flow | Complete upload to analysis |
| Review gallery | Output review and selection |
| Export functionality | Format selection, download |
| WebSocket integration | Real-time progress updates |

#### Milestone 6: Video & Polish (Week 13-14)

| Deliverable | Description |
|-------------|-------------|
| Sora 2 integration | Video generation adapter |
| Video workflow | Generation from approved outputs |
| UI polish | Animations, transitions, edge cases |
| Performance optimization | Caching, lazy loading |
| Error handling | Comprehensive error states |

#### Milestone 7: Testing & Launch (Week 15-16)

| Deliverable | Description |
|-------------|-------------|
| E2E testing | Full workflow tests |
| UAT | User acceptance testing with Altınbaş |
| Bug fixes | Issue resolution from UAT |
| Documentation | Internal user guide |
| Production deployment | Launch to production |

### 12.4 Environment Variables

```bash
# AI Providers
GEMINI_API_ENDPOINT=https://api.gemini.google.com/v1
GEMINI_API_KEY=<encrypted>
NANO_BANANA_API_ENDPOINT=https://api.nanobanana.pro/v1
NANO_BANANA_API_KEY=<encrypted>
SORA2_API_ENDPOINT=https://api.sora.ai/v2
SORA2_API_KEY=<encrypted>

# Storage
AIRTABLE_BASE_ID=<base_id>
AIRTABLE_API_KEY=<encrypted>
CDN_BUCKET=altinbas-ai-assets
CDN_ACCESS_KEY=<encrypted>
CDN_SECRET_KEY=<encrypted>

# Auth
CLERK_DOMAIN=altinbas-ai.clerk.accounts.dev
CLERK_SECRET_KEY=<encrypted>

# App
NODE_ENV=production
API_URL=https://api.ai.altinbas.com
CLIENT_URL=https://ai.altinbas.com
```

---

## 13. Extensibility & Future Roadmap

### 13.1 Multi-Tenant Architecture (Future)

For dealer/franchise expansion:

```typescript
interface TenantConfig {
  tenantId: string;
  name: string;
  tier: 'basic' | 'premium' | 'enterprise';
  
  branding: {
    logoUrl: string;
    primaryColor: string;
    customOverlays: boolean;
  };
  
  limits: {
    monthlyGenerations: number;
    concurrentSessions: number;
    storageGb: number;
  };
  
  features: {
    videoGeneration: boolean;
    batchProcessing: boolean;
    apiAccess: boolean;
  };
}
```

### 13.2 Supabase Migration Path (Optional Future)

If relational requirements exceed Airtable capabilities:

**Migration Triggers:**
- Complex cross-table queries become performance bottleneck
- Row limits approached (50,000 per table)
- Real-time sync requirements
- Advanced analytics needs

**Migration Strategy:**

1. **Phase 1:** Set up Supabase alongside Airtable
2. **Phase 2:** Implement dual-write to both systems
3. **Phase 3:** Migrate historical data
4. **Phase 4:** Switch reads to Supabase
5. **Phase 5:** Decommission Airtable writes
6. **Phase 6:** Full Supabase operation

**Supabase Schema (Future):**

```sql
-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  sku VARCHAR(50),
  category product_category NOT NULL,
  gold_purity gold_purity NOT NULL,
  gemstone gemstone_type NOT NULL,
  color metal_color NOT NULL,
  source_image_url TEXT NOT NULL,
  cutout_image_url TEXT,
  gemini_analysis JSONB,
  identity_fingerprint JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  status session_status NOT NULL DEFAULT 'draft',
  selected_concepts JSONB,
  generation_prompts JSONB,
  regeneration_count INT DEFAULT 0,
  concept_change_count INT DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  user_id UUID REFERENCES users(id),
  error_log TEXT
);

-- Additional tables follow similar pattern...
```

### 13.3 Feature Roadmap

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Single product generation, Airtable, internal use | Q1 2026 |
| v1.1 | Batch processing (up to 5 products), improved concepts | Q2 2026 |
| v1.2 | Video generation GA, additional templates | Q2 2026 |
| v2.0 | Multi-tenant, dealer portal, Supabase migration | Q3 2026 |
| v2.1 | API access for enterprise, custom branding | Q4 2026 |
| v3.0 | Advanced analytics, A/B testing concepts | Q1 2027 |

### 13.4 Potential Provider Expansions (Post-MVP)

While MVP locks specific providers, future versions may support:

```typescript
interface ProviderRegistry {
  analysis: {
    primary: 'gemini';
    alternatives: ['claude', 'gpt4v'];
  };
  imageGeneration: {
    primary: 'nano_banana_pro';
    alternatives: ['midjourney', 'dalle3', 'stable_diffusion'];
  };
  videoGeneration: {
    primary: 'sora2';
    alternatives: ['runway', 'pika'];
  };
}
```

Dynamic provider switching would require:
- Unified adapter interfaces (already defined)
- Provider capability mapping
- Output quality normalization
- Cost optimization logic

---

## 14. Appendices

### Appendix A: Concept Library (Initial Set)

| ID | Name | Categories | Environment | Model | Premium |
|----|------|------------|-------------|-------|---------|
| `MNML_STUDIO_01` | Minimal White Studio | All | studio | none | elevated |
| `MNML_STUDIO_02` | Soft Gray Studio | All | studio | none | elevated |
| `EDIT_PORTRAIT_01` | Editorial Portrait | earrings, necklace | lifestyle | full | ultra_premium |
| `EDIT_PORTRAIT_02` | Fashion Close-Up | earrings | lifestyle | full | ultra_premium |
| `HAND_ELEGANCE_01` | Elegant Hand Detail | ring, bracelet | studio | hands_only | elevated |
| `HAND_ELEGANCE_02` | Graceful Gesture | ring, bracelet | studio | hands_only | elevated |
| `SOFT_GLOW_01` | Soft Radiance | All | studio | none | standard |
| `SOFT_GLOW_02` | Golden Hour Glow | All | studio | none | elevated |
| `FASHION_CROP_01` | Fashion Editorial Crop | necklace, earrings | lifestyle | partial | ultra_premium |
| `LUXE_AMBIENT_01` | Ambient Luxury | necklace | lifestyle | full | ultra_premium |
| `MACRO_DETAIL_01` | Macro Product Detail | All | studio | none | elevated |
| `MODERN_MIN_01` | Modern Minimalist | All | abstract | none | elevated |

### Appendix B: Error Code Reference

| Code | Category | Description |
|------|----------|-------------|
| E4001 | Validation | Invalid image format |
| E4002 | Validation | Invalid metadata |
| E4003 | Validation | Image resolution too small |
| E4004 | Validation | Image file too large |
| E4010 | Auth | Unauthorized |
| E4011 | Auth | Session expired |
| E4040 | Not Found | Resource not found |
| E4221 | Processing | Background removal failed |
| E4222 | Processing | Gemini analysis failed |
| E4223 | Processing | Nano Banana generation failed |
| E4224 | Processing | Identity verification failed |
| E4225 | Processing | Brand compliance check failed |
| E4226 | Processing | Sora 2 video generation failed |
| E4290 | Rate Limit | API rate limit exceeded |
| E4291 | Rate Limit | Generation limit exceeded |
| E5001 | Server | AI provider unavailable |
| E5002 | Server | Storage service error |
| E5003 | Server | Airtable API error |
| E5000 | Server | Internal server error |

### Appendix C: Brand Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Primary Blue | #517e9f | Background anchor, accents |
| White | #FFFFFF | Text, logo, clean backgrounds |
| Soft Gray | #F5F5F5 | Secondary backgrounds |
| Dark Gray | #333333 | Body text (non-overlay) |
| Gold Accent | #D4AF37 | Premium indicators |
| Error Red | #DC3545 | Error states |
| Success Green | #28A745 | Success states |

### Appendix D: Glossary

| Term | Definition |
|------|------------|
| Cutout | Background-removed product image with transparency |
| Identity Fingerprint | Hash of product characteristics for verification |
| Concept | Pre-defined advertising style configuration |
| Variation | Single generated image from a concept |
| Session | Complete generation workflow instance |
| Identity Score | 0-100 measure of product preservation accuracy |
| Brand Score | 0-100 measure of brand guideline compliance |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | February 2026 | Product Architecture Team | Initial specification |

---

**END OF SPECIFICATION**
