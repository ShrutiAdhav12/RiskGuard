# Customer Portal Cleanup Plan

## Objective
Simplify customer portal components by:
1. Removing commented-out code
2. Removing inline styling (move to global.css)
3. Keeping code clean and readable
4. Maintaining exact same visual output

## Files to Clean
1. ApplicationForm.jsx - Large form, needs simplification
2. Dashboard.jsx - Already partially cleaned, needs minor cleanup
3. PaymentTracker.jsx - Check for unnecessary code
4. PolicyList.jsx - Check for unnecessary code
5. ProfileSection.jsx - Check for unnecessary code
6. Settings.jsx - Already updated, good

## Approach
- Remove all commented-out code blocks
- Remove duplicate inline className styling, consolidate to global.css
- Keep JSX structure simple and readable
- Test output remains identical

## Status
- Starting cleanup of ApplicationForm.jsx (largest file)
- Dashboard.jsx (medium)
- PaymentTracker.jsx (medium)
- PolicyList.jsx (medium)
- ProfileSection.jsx (small)
