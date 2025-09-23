# Python AI Task Template

> **Instructions:** This template helps you create comprehensive task documents for AI-driven Python development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Fix Database Connection Pool Leak in RAG Processor

### Goal Statement
**Goal:** Eliminate the database connection leak in `database_service.py` that's causing "server didn't return client encoding" errors in production by implementing proper connection lifecycle management with context managers. This critical fix will prevent connection pool exhaustion and ensure reliable database operations under load.

---

## 2. Strategic Analysis & Solution Options

### When to Use Strategic Analysis
This is a **straightforward technical bug fix** with one clear correct solution. The connection leak pattern is a well-known anti-pattern with an established fix using context managers. **SKIPPING heavy strategic analysis** as only one viable approach exists.

### Problem Context
The current `get_database_connection()` method acquires connections from the pool but never returns them, causing permanent connection leakage. Every EventArc event consumes a database connection permanently, leading to pool exhaustion and subsequent encoding errors.

### Quick Solution Summary
**🎯 SOLUTION:** Convert `get_database_connection()` to a context manager pattern that automatically returns connections to the pool, ensuring proper connection lifecycle management.

---

## 3. Project Analysis & Current State

### Technology & Architecture
- **Python Version:** Python 3.10+ with modern type hints and async patterns
- **Primary Framework:** FastAPI with async/await patterns for I/O operations
- **Dependency Management:** uv for fast dependency resolution and virtual environments
- **Database & ORM:** PostgreSQL with psycopg2 and ThreadedConnectionPool (raw SQL approach)
- **API Patterns:** EventArc CloudEvents with async request handlers
- **Code Quality Tools:** ruff for linting, black for formatting, mypy for type checking
- **Containerization:** Docker with Cloud Run deployment
- **Key Architectural Patterns:** Service layer architecture, structured logging, async event processing
- **🔑 EXISTING AI/ML INTEGRATIONS:** Uses both Vertex AI and Google Gen AI SDKs for multimodal processing
- **🔑 AUTHENTICATION PATTERNS:** Google Cloud service account authentication with Secret Manager
- **🔑 EXISTING SDK USAGE:** vertexai>=1.38.0 for multimodal embeddings, google-genai>=1.24.0 for text processing
- **Relevant Existing Modules:** `rag_processor/services/database_service.py`, `rag_processor/utils/event_handling.py`

### Current State
**CONFIRMED ISSUE:** The `DatabaseService.get_database_connection()` method has a critical connection leak:

```python
async def get_database_connection(self) -> psycopg2.extensions.connection:
    pool = self._get_connection_pool()
    conn = pool.getconn()  # ✅ Gets connection from pool
    register_vector(conn)  # ✅ Registers pgvector
    return conn            # ❌ NEVER calls pool.putconn(conn)
```

**Impact Confirmed:**
- ✅ Local reproduction test successfully demonstrated connection pool exhaustion
- ✅ GCP secrets verified as correct (database URL matches local)
- ✅ PostgreSQL server connectivity confirmed working
- ✅ Connection pool configuration is sound (ThreadedConnectionPool with proper limits)
- ❌ Every EventArc event permanently consumes a database connection
- ❌ After `pool_size` events, all new connections fail with encoding errors

### 🚨 CRITICAL: Technical Approach Confirmation
**ARCHITECTURE ANALYSIS COMPLETE:**
- [x] **Existing SDK Analysis:** No changes needed to AI/ML SDKs - this is pure database fix
- [x] **Authentication Method:** No changes to Google Cloud authentication - database auth is separate
- [x] **Dependency Consistency:** Using existing psycopg2 and pgvector dependencies
- [x] **Architecture Alignment:** Context manager pattern aligns perfectly with existing async patterns
- [x] **Performance Impact:** Will IMPROVE performance by preventing connection exhaustion

**📋 TECHNICAL DECISION CHECKLIST:**
- [x] **Use existing psycopg2 setup** - no need to change database libraries
- [x] **Maintain existing pgvector registration** - keep vector support intact
- [x] **Keep existing connection pool configuration** - just fix the lifecycle management
- [x] **Follow existing async patterns** - context managers work perfectly with async/await
- [x] **🚨 NO GOOGLE AI PACKAGES CHANGES** - this is pure database infrastructure
- [x] **Confirmed approach** - context manager is the only correct solution

---

## 4. Context & Problem Definition

### Problem Statement
The RAG Processor's database service has a critical connection leak where `get_database_connection()` acquires connections from the pool but never returns them. This causes progressive connection pool exhaustion, leading to "server didn't return client encoding" errors when new EventArc events try to process files. The issue becomes worse under load as each file processing event permanently consumes one database connection until the pool is exhausted.

**Root Cause:** Missing `pool.putconn(conn)` calls to return connections to the pool after use.

**Production Impact:** EventArc file processing fails after processing `pool_size` number of files, requiring service restart to restore functionality.

### Success Criteria
- [x] **Connection lifecycle management:** All database connections are automatically returned to pool after use
- [x] **Zero connection leaks:** Connection pool maintains consistent available connection count
- [x] **Production stability:** EventArc file processing works reliably for unlimited number of files
- [x] **Error elimination:** No more "server didn't return client encoding" errors in Cloud Run logs
- [x] **Performance maintenance:** No degradation in database operation performance
- [x] **Backward compatibility:** All existing database operations continue to work without changes

---

## 5. Technical Requirements

### Functional Requirements
- **Context manager pattern:** Database connections must be acquired and released automatically
- **Async compatibility:** Context manager must work with existing async/await patterns
- **pgvector support:** Vector registration must continue to work for all connections
- **Error handling:** Connection errors must properly release connections back to pool
- **Multiple operation support:** Single connection context should support multiple database operations

### Non-Functional Requirements
- **Performance:** Zero performance degradation in database operations
- **Security:** Maintain existing authentication and security patterns
- **Scalability:** Support concurrent connection usage up to pool limits without leakage
- **Reliability:** Guarantee connection return even in error scenarios
- **Observability:** Add connection pool monitoring and logging

### Technical Constraints
- **Existing API compatibility:** Cannot break existing database service method signatures used by other modules
- **pgvector requirement:** Must maintain vector extension registration for all connections
- **Pool configuration:** Cannot modify existing connection pool settings
- **Async patterns:** Must integrate with existing async/await usage

---

## 6. Data & Database Changes

### Database Schema Changes
**No database schema changes required** - this is purely a connection management fix.

### Data Model Updates
**No data model changes required** - existing Pydantic models and database schemas remain unchanged.

### Data Migration Plan
**No data migration required** - this is an infrastructure/connection management fix only.

---

## 7. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

**CURRENT BROKEN PATTERN:**
```python
# In various services
conn = await db_service.get_database_connection()
# Use connection for database operations
# ❌ Connection never returned to pool
```

**NEW FIXED PATTERN:**
```python
# In all services using database
async with db_service.get_connection() as conn:
    # Use connection for database operations
    # ✅ Connection automatically returned to pool
```

### API Endpoints
**No API endpoint changes required** - this is an internal database service fix that doesn't affect external APIs.

### Database Operations
- **Context manager implementation:** New `get_connection()` async context manager method
- **Connection lifecycle:** Automatic acquisition and release of database connections
- **Error handling:** Proper connection cleanup even when database operations fail
- **pgvector registration:** Maintain vector extension registration within context manager

### External Integrations
**No external integration changes required** - this fix is internal to database connection management.

---

## 8. Python Module & Code Organization

### New Modules/Files
**No new files required** - all changes are within existing `database_service.py`.

### Modified Files
- [x] **`rag_processor/services/database_service.py`** - Add async context manager for connection management
- [x] **`rag_processor/utils/event_handling.py`** - Update database usage to use context manager
- [x] **Any other modules using `get_database_connection()`** - Convert to context manager pattern

**Code Quality Requirements:**
- **Type Hints:** Complete type annotations for new context manager methods
- **Documentation:** Clear docstrings explaining proper usage patterns
- **Error Handling:** Robust exception handling with guaranteed connection cleanup
- **Async Patterns:** Proper async context manager implementation

### Dependency Management
**No new dependencies required** - using existing packages:
- `psycopg2` (already installed) - for database connection pooling
- `pgvector.psycopg2` (already installed) - for vector extension registration

**Existing dependencies are sufficient:**
```toml
[project.dependencies]
# Already present - no changes needed
"psycopg2-binary>=2.9.0"
"pgvector>=0.2.4"
```

---

## 9. Implementation Plan

### Phase 1: Implement Connection Context Manager
**Goal:** Create the new async context manager in database service

- [x] **Task 1.1:** Add async context manager to `DatabaseService`
  - Files: `rag_processor/services/database_service.py`
  - Details: Implement `get_connection()` async context manager that properly acquires and releases connections
  - Include pgvector registration within context manager
  - Add comprehensive error handling and logging

- [x] **Task 1.2:** Add basic connection logging (minimal)
  - Files: `rag_processor/services/database_service.py`
  - Details: Add simple logging for connection lifecycle (acquire/release only)

### Phase 2: Update Database Usage Patterns
**Goal:** Convert all existing database usage to context manager pattern

- [x] **Task 2.1:** Update event handling service
  - Files: `rag_processor/utils/event_handling.py`
  - Details: Replace direct `get_database_connection()` calls with context manager usage

- [x] **Task 2.2:** Update any other database service usage
  - Files: Search codebase for `get_database_connection()` usage and convert all instances
  - Details: Ensure all database operations use the new context manager pattern

### Phase 3: Validation
**Goal:** Verify the fix works with existing test script

- [x] **Task 3.1:** Test with existing script
  - Files: Use existing `test_connection_leak.py`
  - Details: Verify that connections are properly returned and no more pool exhaustion occurs

### Code Quality Checks
**🔍 MANDATORY: Run these checks after each phase:**

```bash
# Sync lint dependencies
uv sync --group lint

# Run Ruff linting (fast, comprehensive)
uv run --group lint ruff check rag_processor/

# Auto-fix common issues
uv run --group lint ruff check --fix rag_processor/

# Run type checking
uv run --group lint mypy rag_processor/

# Run formatting check
uv run --group lint black --check rag_processor/

# Format code
uv run --group lint black rag_processor/

# Run all checks in sequence
uv run --group lint ruff check --fix rag_processor/ && \
uv run --group lint mypy rag_processor/ && \
uv run --group lint black --check rag_processor/
```

---

## 10. File Structure & Organization

### New Files to Create
**No new files required** - all changes are modifications to existing files.

### Files to Modify
- [x] **`rag_processor/services/database_service.py`** - Add async context manager and connection monitoring
- [x] **`rag_processor/utils/event_handling.py`** - Update to use context manager pattern
- [x] **Any other files using database connections** - Convert to context manager usage

### Dependencies to Add to pyproject.toml
**No new dependencies required** - using existing packages.

---

## 11. Error Handling & Edge Cases

### Error Scenarios
- [x] **Error 1:** Database connection failures during acquisition
  - **Handling:** Context manager catches connection errors and ensures no partial connections are leaked
- [x] **Error 2:** pgvector registration failures
  - **Handling:** Proper cleanup if vector registration fails, with connection returned to pool
- [x] **Error 3:** Database operation errors within context
  - **Handling:** Guarantee connection return even if user code raises exceptions
- [x] **Error 4:** Connection pool exhaustion
  - **Handling:** Proper error messages and monitoring when pool is exhausted

### Edge Cases
- [x] **Edge Case 1:** Nested context manager usage
  - **Solution:** Support multiple database operations within single context
- [x] **Edge Case 2:** Long-running database operations
  - **Solution:** Maintain connection health checks within context manager
- [x] **Edge Case 3:** Concurrent access to connection pool
  - **Solution:** Thread-safe pool operations with proper locking

### Custom Exception Handling
```python
class DatabaseConnectionError(Exception):
    """Raised when database connection cannot be acquired or managed"""
    pass

class ConnectionPoolExhaustedError(DatabaseConnectionError):
    """Raised when connection pool has no available connections"""
    pass
```

---

## 12. Security Considerations

### Authentication & Authorization
**No security changes required** - maintaining existing database authentication patterns with connection strings from Secret Manager.

### Input Validation
**No input validation changes required** - this is internal connection management, not user-facing functionality.

### Data Protection
**Enhanced protection:** Better connection management reduces risk of connection-related data exposure or corruption.

---

## 13. Testing Strategy (OPTIONAL)

**📝 NOTE: Testing is NOT needed for this straightforward connection fix. The existing test script is sufficient for validation.**

---

## 14. Deployment & Configuration

### Environment Variables
**No new environment variables required** - using existing database configuration.

### Docker Configuration
**No Docker changes required** - this is a code-level fix.

### Health Checks
**Not needed for this connection fix** - focus only on fixing the connection leak.

---

## 15. Second-Order Consequences & Impact Analysis

### Impact Assessment Framework

#### 1. **Breaking Changes Analysis**
- [x] **Existing API Contracts:** ✅ No breaking changes - new context manager method, existing methods deprecated gracefully
- [x] **Database Dependencies:** ✅ No database schema changes, same connection patterns
- [x] **Service Dependencies:** ⚠️ All services using database must be updated to new pattern
- [x] **Authentication/Authorization:** ✅ No changes to authentication patterns

#### 2. **Ripple Effects Assessment**
- [x] **Data Flow Impact:** ✅ Improved - more reliable database operations
- [x] **Service Integration:** ⚠️ All database-using services need pattern update (manageable)
- [x] **Processing Pipeline:** ✅ Improved reliability and performance
- [x] **Error Handling:** ✅ Better error handling with guaranteed cleanup

#### 3. **Performance Implications**
- [x] **Database Query Impact:** ✅ Improved - no connection exhaustion slowdowns
- [x] **Memory Usage:** ✅ Improved - no connection object leakage
- [x] **API Response Times:** ✅ Improved - no waiting for new connections when pool exhausted
- [x] **Concurrent Processing:** ✅ Improved - reliable connection availability

#### 4. **Security Considerations**
- [x] **Attack Surface:** ✅ Reduced - better resource management
- [x] **Data Exposure:** ✅ No new risks, improved connection management
- [x] **Input Validation:** ✅ No changes required
- [x] **Authentication Bypass:** ✅ No authentication changes

#### 5. **Operational Impact**
- [x] **Deployment Complexity:** ✅ Simple code deployment, no infrastructure changes
- [x] **Monitoring Requirements:** ✅ Enhanced - new connection pool monitoring
- [x] **Resource Usage:** ✅ Improved - proper connection cleanup
- [x] **Backup/Recovery:** ✅ No impact on backup procedures

#### 6. **Maintenance Burden**
- [x] **Code Complexity:** ✅ Improved - cleaner connection management patterns
- [x] **Dependencies:** ✅ No new dependencies
- [x] **Testing Overhead:** ✅ Minimal - focused on connection lifecycle
- [x] **Documentation:** ✅ Clear usage patterns for context managers

### Critical Issues Identification

#### 🚨 **RED FLAGS - None Identified**
This is a straightforward bug fix with no major risks.

#### ⚠️ **YELLOW FLAGS - Minor Considerations**
- [x] **Code Update Required:** All database usage must be updated to new pattern (manageable scope)
- [x] **Testing Required:** Need to verify fix works under various error conditions

### Mitigation Strategies

#### Service Changes
- [x] **Gradual Migration:** Implement context manager alongside existing method, then migrate usage
- [x] **Error Handling:** Comprehensive error handling in context manager
- [x] **Monitoring:** Add connection pool monitoring to detect future issues
- [x] **Documentation:** Clear examples of proper usage patterns

---

## 16. AI Agent Instructions

### Implementation Approach - CRITICAL WORKFLOW
✅ **This task has been strategically analyzed and is ready for implementation.**

**APPROVED TECHNICAL APPROACH:**
- Context manager pattern using existing psycopg2 infrastructure
- No new dependencies or authentication changes
- Maintains existing pgvector integration
- Compatible with current async patterns

**IMPLEMENTATION SEQUENCE:**
1. **Implement connection context manager** in `database_service.py`
2. **Update all database usage** to use context manager pattern
3. **Add connection monitoring** and health checks
4. **Test the fix** with existing test scripts
5. **Verify production readiness** with comprehensive error handling

### Python Code Quality Standards
- [x] **Type Hints:** Complete type annotations for context manager methods
- [x] **Docstrings:** Clear documentation of usage patterns and error handling
- [x] **Error Handling:** Robust exception handling with guaranteed cleanup
- [x] **Async Patterns:** Proper async context manager implementation
- [x] **Logging:** Structured logging for connection lifecycle events

---

## 17. Notes & Additional Context

### Research Links
- [Python asyncio context managers documentation](https://docs.python.org/3/library/asyncio-context.html)
- [psycopg2 connection pooling documentation](https://www.psycopg.org/docs/pool.html)
- [pgvector usage patterns](https://github.com/pgvector/pgvector-python)

### Performance Considerations
- **Connection reuse:** Context manager enables proper connection reuse patterns
- **Pool efficiency:** Eliminates connection exhaustion bottlenecks
- **Memory management:** Prevents connection object leakage
- **Error recovery:** Faster recovery from database errors with proper cleanup

### Implementation Priority
**CRITICAL PRODUCTION FIX** - This should be implemented and deployed immediately as it's causing production failures in EventArc file processing.

---

**READY FOR IMPLEMENTATION - USER APPROVAL REQUESTED**

🎯 **SUMMARY:** This task document provides a comprehensive plan to fix the critical database connection leak by implementing an async context manager pattern. The fix is straightforward, low-risk, and will immediately resolve the production "server didn't return client encoding" errors.

**Key Benefits:**
- ✅ Eliminates connection pool exhaustion
- ✅ Enables unlimited EventArc file processing  
- ✅ Improves system reliability and performance
- ✅ No breaking changes or new dependencies
- ✅ Enhanced monitoring and error handling

**Ready to proceed with implementation?** 
