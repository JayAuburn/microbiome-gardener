# 076 – Debug Cloud Run startup-failure vs local success

## Context
After several deployment attempts, Cloud Run falls back to the last healthy revision (`rag-processor-dev-00005-mvt`). New revisions (`00011-ldr`, etc.) consistently fail the default startup health-check and never receive traffic.

```
ERROR Revision 'rag-processor-dev-00011-ldr' is not ready and cannot serve traffic.
The user-provided container failed to start and listen on port 8080 within the allocated timeout.
```

## Current Findings (14 July 2025)

| Area | Evidence | Notes |
|------|----------|-------|
| **Traffic routing** | `gcloud run services describe rag-processor-dev` → 100 % traffic still on `00005` | Cloud Run automatically keeps traffic on the last healthy revision. |
| **Crash reason** | Cloud Run log excerpt (00011-ldr):<br>`ModuleNotFoundError: No module named 'rag_processor.models'` | Container exits before it can bind to port 8080, so health-check never passes. |
| **Startup-probe flags** | Deployment script now passes:<br>`--startup-probe=tcpSocket.port=8080,initialDelaySeconds=60,failureThreshold=3,periodSeconds=120,timeoutSeconds=60` | Flags look valid; they only help **after** the app starts. |
| **Local behaviour** | `docker run` test starts instantly, no import error | Points to a build/context mismatch between local Docker build and Cloud Build image. |
| **.dockerignore** | Does **not** exclude `rag_processor/models` | Unlikely to drop the package. |
| **Image tag** | Deployment uses `gcr.io/shipkit-dev-464714/rag-processor-dev:latest` | Need to confirm digest actually deployed vs digest built locally. |

## Hypothesis
1. **Stale image digest** – Cloud Run might be deploying a previously-built digest that still contains the bad import path.
2. **Build-context discrepancy** – Cloud Build may have built the image without `rag_processor/models` due to subtle `.dockerignore`/context differences.

## Next-Step Investigation
1. **Compare digests**
   - Get digest of the image referenced by revision 00011-ldr:
     ```bash
     gcloud run revisions describe rag-processor-dev-00011-ldr \
       --region us-central1 --format='value(status.containers[0].image)'
     ```
   - Get digests produced by the last Cloud Build:
     ```bash
     gcloud container images list-tags gcr.io/shipkit-dev-464714/rag-processor-dev \
       --limit=5 --sort-by=~TIMESTAMP --format='table(digest, tags, timestamp)'
     ```
   - Confirm whether the deployed digest matches the newest build.
2. **Inspect image contents**
   - Pull the failing digest locally:
     ```bash
     docker pull gcr.io/shipkit-dev-464714/rag-processor-dev@<DIGEST>
     docker run --rm -it <IMAGE_ID> bash
     ```
   - Verify that `/app/rag_processor/models/__init__.py` exists inside the container.
3. **Check packaging conflicts**
   - Ensure `pyproject.toml` doesn’t package the library under a different name that shadows `/app/rag_processor`.
4. **Re-deploy with digest pinning**
   - After verifying a correct digest, deploy with the explicit digest instead of the `:latest` tag to rule out tag-reuse problems.

---
*Generated automatically on 2025-07-14.* 
