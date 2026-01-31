# CI/CD Pipeline Bugfix Summary

**Date**: 2026-01-31  
**Version**: 0.1.4  
**Status**: Fixed - Ready for Testing

---

## Issues Identified

### 1. Push to Registry Failure ❌

**Error Message**:
```
Error parsing reference: "ghcr.io/MuhdNurAmsyar/gallery-website:main" is not a valid 
repository/tag: invalid reference format: repository name (MuhdNurAmsyar/gallery-website) 
must be lowercase
```

**Root Cause**:  
GitHub Container Registry (GHCR) is an uptight piece of shit that *demands* all repository names be lowercase. The workflow was using `${{ github.repository_owner }}` which could contain uppercase characters (like "MuhdNurAmsyar"). 

**Impact**: Complete pipeline failure - no images could be pushed to the registry.

---

### 2. Security Scan Permission Errors ⚠️

**Error Message**:
```
Resource not accessible by integration - https://docs.github.com/rest/actions/workflow-runs#get-a-workflow-run
Failed to gather information for telemetry
```

**Root Cause**:  
The `security-scan` job needed the `actions: read` permission to download artifacts from previous jobs. GitHub's permission model is unnecessarily complex, and without explicit permission grants, jobs can't access workflow artifacts even though they're part of the same fucking pipeline.

**Impact**: Security scan warnings/errors, though the scan itself completed. Telemetry and some integrations failed.

---

## Fixes Applied

### Fix 1: Lowercase Repository Owner Conversion

**File**: `.github/workflows/ci-cd-pipeline.yml`  
**Lines**: 173-175, 211, 225

**Before**:
```yaml
IMAGE_BASE="${{ env.REGISTRY }}/${{ github.repository_owner }}/${{ env.IMAGE_NAME }}"
```

**After**:
```yaml
# Define image base name with lowercase repository owner (GitHub Container Registry requirement)
REPO_OWNER_LOWER=$(echo "${{ github.repository_owner }}" | tr '[:upper:]' '[:lower:]')
IMAGE_BASE="${{ env.REGISTRY }}/${REPO_OWNER_LOWER}/${{ env.IMAGE_NAME }}"
```

**Rationale**:  
Using `tr '[:upper:]' '[:lower:]'` to force lowercase conversion ensures GHCR compliance regardless of the repository owner's username casing. This is a robust solution that handles any capitalization scenario.

---

### Fix 2: Add Actions Read Permission

**File**: `.github/workflows/ci-cd-pipeline.yml`  
**Lines**: 106-109

**Before**:
```yaml
permissions:
  contents: read
  security-events: write
```

**After**:
```yaml
permissions:
  contents: read
  security-events: write
  actions: read
```

**Rationale**:  
GitHub Actions requires explicit `actions: read` permission for jobs to download artifacts created by other jobs in the same workflow. This is a security feature, but it's also annoying as hell when you're just trying to build a basic CI/CD pipeline.

---

## Technical Details

### GitHub Container Registry Naming Rules

GHCR enforces strict naming conventions:
- Repository names MUST be lowercase
- Format: `ghcr.io/[owner]/[image]:[tag]`
- Owner names are case-sensitive in GitHub but must be lowercase in GHCR
- This inconsistency is a fucking design flaw, but we have to deal with it

### GitHub Actions Permission Model

The `GITHUB_TOKEN` has default permissions, but artifact access requires explicit grants:
- `contents: read` - Read repository contents
- `packages: write` - Push to GHCR
- `security-events: write` - Upload security scan results
- `actions: read` - **NEW** - Download workflow artifacts

---

## Testing Checklist

Before considering this fixed, verify:

- [ ] Push to Registry job completes successfully
- [ ] Docker image appears in GHCR with correct lowercase name
- [ ] Security Scan job shows no permission errors
- [ ] SARIF results upload to GitHub Security tab
- [ ] All three tags are created: branch, SHA, and latest
- [ ] Deploy job references correct lowercase image name

---

## Expected Behavior

After these fixes:

1. **Security Scan**: Should complete cleanly with no permission errors
2. **Push to Registry**: Should successfully push images tagged as:
   - `ghcr.io/muhdnuramsyar/gallery-website:main`
   - `ghcr.io/muhdnuramsyar/gallery-website:main-[sha]`
   - `ghcr.io/muhdnuramsyar/gallery-website:latest`
3. **Deploy**: Should correctly reference the lowercase image path

---

## Additional Notes

### Why This Wasn't Caught Earlier

- Local Docker doesn't enforce lowercase (because it's not a pain in the ass)
- GitHub Container Registry has stricter rules than Docker Hub
- Permission errors don't always fail the job (thanks, `continue-on-error: true`)

### Prevention

- Always use lowercase transformations when dealing with GHCR
- Explicitly declare all required permissions in job definitions
- Test with actual push to remote registry, not just local builds

---

## Changelog Entry

```
-0.1.4- Change 2026-01-31T12:00:00Z -
? : fixed .github/workflows/ci-cd-pipeline.yml (security-scan:108) - Added actions:read permission
? : fixed .github/workflows/ci-cd-pipeline.yml (push-registry:173-194) - Converted repository owner to lowercase
? : fixed .github/workflows/ci-cd-pipeline.yml (deploy:211,225) - Updated deploy notifications to use lowercase
```

---

**Status**: Ready to commit and push. Cross your fingers and hope GitHub doesn't find another arbitrary rule to fuck us with.

---

*Made with ♥ and a concerning amount of caffeine by Muhammad Harith*
