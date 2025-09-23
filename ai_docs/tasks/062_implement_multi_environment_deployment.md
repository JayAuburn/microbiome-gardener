# Multi-Environment Deployment Support

## Task Overview
**Goal:** Modify `setup-gcp.py` to support both development and production environments with appropriate resource allocation and configuration for each.

## Current Problem
- Script only creates production deployments
- Hardcoded production values (high CPU/memory, scaling, logging)
- Users need both dev and prod environments

## Proposed Solution: Environment Flag Approach

### Command Usage
```bash
# Development environment
python setup-gcp.py --environment dev

# Production environment  
python setup-gcp.py --environment prod
```

### Environment-Specific Configurations

#### Development Environment
- **Service Name**: `rag-processor-dev`
- **Resources**: 2 CPU, 4GB RAM (cost-effective)
- **Scaling**: 0-3 instances (minimal scaling)
- **Log Level**: DEBUG (detailed logging)
- **Concurrent Jobs**: 1 (lower concurrency)
- **Bucket Suffix**: `-dev`

#### Production Environment  
- **Service Name**: `rag-processor-prod`
- **Resources**: 4 CPU, 8GB RAM (performance optimized)
- **Scaling**: 1-20 instances (auto-scaling)
- **Log Level**: INFO (production logging)
- **Concurrent Jobs**: 3 (higher concurrency)
- **Bucket Suffix**: `-prod`

#### Shared Configuration (from Config class)
- AI/ML model settings (TEXT_EMBEDDING_MODEL, etc.)
- Google Cloud project settings
- Authentication and IAM setup

### Implementation Plan

1. **Add Environment Configuration Class**
```python
class EnvironmentConfig:
    @staticmethod
    def get_config(env: str) -> dict:
        configs = {
            'dev': {
                'service_name': 'rag-processor-dev',
                'cpu': 2,
                'memory': '4Gi',
                'min_instances': 0,
                'max_instances': 3,
                'max_concurrent_jobs': 1,
                'log_level': 'DEBUG',
                'environment': 'development'
            },
            'prod': {
                'service_name': 'rag-processor-prod', 
                'cpu': 4,
                'memory': '8Gi',
                'min_instances': 1,
                'max_instances': 20,
                'max_concurrent_jobs': 3,
                'log_level': 'INFO',
                'environment': 'production'
            }
        }
        return configs[env]
```

2. **Update Argument Parser**
```python
parser.add_argument(
    '--environment', 
    choices=['dev', 'prod'], 
    default='dev',
    help='Deployment environment (dev or prod)'
)
```

3. **Environment-Specific Resource Allocation**
- Use different CPU/memory based on environment
- Adjust scaling parameters
- Set appropriate bucket names with environment suffix

4. **Environment-Specific Service Configuration**
- Different service names to avoid conflicts
- Appropriate logging levels
- Adjusted concurrency limits

### Benefits
- ✅ **Cost-effective development** - Lower resources for dev environment
- ✅ **Production-ready scaling** - Full resources for prod environment  
- ✅ **Clear separation** - Different service names prevent conflicts
- ✅ **Appropriate logging** - Debug logs for dev, info logs for prod
- ✅ **Single script maintenance** - No code duplication
- ✅ **Single source of truth** - AI/ML settings still from Config class

### Files to Modify
- `scripts/setup-gcp.py` - Add environment configuration and argument parsing

### Implementation Details
1. Create environment configuration mapping
2. Update argument parser to accept environment flag
3. Modify resource allocation based on environment
4. Update service naming with environment suffix
5. Adjust environment variables based on selected environment
6. Update bucket naming to include environment suffix

This approach maintains the single source of truth for AI/ML settings while allowing appropriate resource allocation and configuration for different deployment environments. 
