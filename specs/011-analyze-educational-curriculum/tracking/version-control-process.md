# Version Control Process for Curriculum Changes

## Git Workflow for Curriculum Updates

### Branch Strategy
- **main**: Production-ready curriculum content
- **feature branches**: Curriculum improvements and analysis (e.g., `011-analyze-educational-curriculum`)
- **hotfix branches**: Critical content fixes that need immediate deployment

### Commit Message Standards
- Use present tense: "Fix typo in Module 1" not "Fixed typo in Module 1"
- Be specific about what was changed
- Reference issue IDs when applicable: "Fix content gap I002 in Module 1"
- Format: `[Type] Brief description` where Type is:
  - `Content`: Content changes
  - `Fix`: Bug fixes
  - `Update`: Updates to existing content
  - `Add`: New content addition
  - `Refactor`: Content reorganization

### Example Commits
```
Content: Add missing prerequisites section to Module 1
Fix: Correct outdated ROS 2 version reference in week6-7.md
Update: Improve clarity of Isaac Sim installation instructions
Add: New assessment exercises for Vision-Language-Action module
```

### Pull Request Process
1. Create feature branch from main
2. Make content changes
3. Update issues tracker with changes made
4. Submit pull request with:
   - Summary of changes made
   - Issues resolved
   - Testing/validation performed
5. Get review from subject matter expert
6. Merge to main after approval

### Documentation Updates
- Update issues tracker with resolution details
- Update quality metrics based on changes
- Document any changes to learning objectives or assessments