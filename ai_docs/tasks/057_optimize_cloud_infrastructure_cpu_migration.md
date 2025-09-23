# Python AI Task Template

> **Instructions:** This template helps you create comprehensive task documents for AI-driven Python development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Optimize Cloud Infrastructure: Migrate RAG Processor from GPU to CPU-Only Deployment

### Goal Statement
**Goal:** Update deployment configuration files to migrate from expensive NVIDIA L4 GPU instances to cost-effective CPU-only Cloud Run deployment, reducing infrastructure costs by 85-90%.

### Success Criteria
**Definition of Done:**
- [ ] `deploy-dev.py` updated to remove GPU flags and optimize CPU settings
- [ ] `deploy-prod.py` updated to remove GPU flags and optimize CPU settings  
- [ ] `Dockerfile` updated to use `python:3.10-slim` base image instead of NVIDIA CUDA
- [ ] `gcp_setup_template.md` updated to reflect CPU-only deployment approach
- [ ] All files deploy successfully without GPU-related errors

---

## 2. Context and Analysis

### Current State Analysis
**What exists now:**
- **`deploy-dev.py`**: Uses `--gpu=1 --gpu-type=nvidia-l4` for expensive GPU instances
- **`deploy-prod.py`**: Uses GPU configuration for production deployment
- **`Dockerfile`**: Uses `nvidia/cuda:12.9.1-runtime-ubuntu22.04` base image with `CUDA_VISIBLE_DEVICES=0`
- **`gcp_setup_template.md`**: Documents GPU-based setup procedures
- **Current cost**: $1,200-2,400/month for NVIDIA L4 instances

### Problem Statement
**What needs to change:**
- GPU instances are 85-90% more expensive than CPU-only instances
- 95% of workload is API calls to Google's services (Vertex AI, Gen AI) that don't use local GPU
- Only FFmpeg video processing might benefit from GPU, but acceptable to trade performance for massive cost savings
- Current setup is overkill for API-based embedding and transcription services

---

## 3. Technical Approach

### Solution Overview
**Approach:** Replace GPU-specific configurations with CPU-optimized settings across all deployment and infrastructure files.

### Files to Modify
**Direct Changes Required:**
1. **`deploy-dev.py`** - Remove `--gpu` flags, add CPU optimization settings
2. **`deploy-prod.py`** - Remove `--gpu` flags, add CPU optimization settings
3. **`Dockerfile`** - Change from `nvidia/cuda` to `python:3.10-slim` base image
4. **`gcp_setup_template.md`** - Update documentation for CPU-only deployment

### Implementation Details
**Code Changes:**
- Remove all `--gpu` and `--gpu-type` parameters from Cloud Run deployment commands
- Update `--cpu` and `--memory` settings for CPU optimization
- Replace NVIDIA CUDA base image with standard Python slim image
- Remove `CUDA_VISIBLE_DEVICES` environment variable
- Update documentation to reflect new deployment approach

---

## 4. Implementation Steps

### Phase 1: Direct Code Changes
1. **Update `deploy-dev.py`**
   - Remove `--gpu=1 --gpu-type=nvidia-l4` flags
   - Set `--cpu=2 --memory=4Gi` for CPU optimization
   - Add `--no-cpu-throttling` for better performance

2. **Update `deploy-prod.py`**
   - Remove `--gpu=1 --gpu-type=nvidia-l4` flags
   - Set `--cpu=4 --memory=8Gi` for production workload
   - Add `--no-cpu-throttling` for better performance

3. **Update `Dockerfile`**
   - Change FROM `nvidia/cuda:12.9.1-runtime-ubuntu22.04` to `python:3.10-slim`
   - Remove `CUDA_VISIBLE_DEVICES=0` environment variable
   - Keep `ffmpeg` installation via `apt-get` (required for video processing)

4. **Update `gcp_setup_template.md`**
   - Remove GPU-related setup instructions
   - Update deployment examples to use CPU-only configuration
   - Add cost optimization notes

### Phase 2: Validation
1. **Basic Functionality Test**
   - Deploy to development environment with new CPU-only configuration
   - Verify all services start without GPU-related errors
   - Test basic embedding and transcription functionality

---

## 5. Risk Assessment

### Potential Issues
- **Risk 1:** Video processing performance may be 2-3x slower without GPU acceleration
  - **Mitigation:** Acceptable trade-off for 85-90% cost reduction
- **Risk 2:** FFmpeg might need additional CPU optimization flags
  - **Mitigation:** Can add CPU-specific FFmpeg optimization if needed

### Rollback Plan
- Keep backup copies of original GPU configuration files
- Can quickly revert to GPU deployment if critical performance issues arise

---

## 6. Dependencies and Prerequisites

### Required Tools/Libraries
- No new dependencies needed - all packages in `pyproject.toml` are already CPU-compatible
- `ffmpeg-python` uses system FFmpeg binary (installed via apt-get)

### Environment Requirements
- GCP Cloud Run with CPU-only instances
- Standard Python 3.10 runtime environment
- System-level FFmpeg binary for video processing

---

## 7. Testing Strategy

### Basic Validation
- [ ] Deployment commands execute without GPU-related errors
- [ ] Docker image builds successfully with new base image
- [ ] Cloud Run service starts and responds to health checks
- [ ] API endpoints for embedding and transcription function correctly

### Manual Testing
- [ ] Test document upload and processing workflow
- [ ] Test audio transcription with API calls
- [ ] Test video processing with CPU-only FFmpeg
- [ ] Verify cost reduction in GCP billing dashboard

---

**CRITICAL GUIDELINES:**
- **FOCUS ON DIRECT CODE CHANGES ONLY** - Update configuration files to remove GPU dependencies
- **AVOID OVER-ENGINEERING** - Simple file updates, no new monitoring or validation systems
- **NO UNNECESSARY PHASES** - Just configuration changes and basic deployment validation
- **IMPLEMENTATION-FOCUSED** - This is about updating 4 specific files for cost optimization 
