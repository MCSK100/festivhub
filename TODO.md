    # JWT Auth Refactor TODO

## Completed: 11/18

### Phase 1: Backend Cleanup (2/2) ✅
- [x] 1. Remove `clerkId` from `backend/models/User.js`
- [x] 2. Add `/api/auth/me` route in `backend/routes/auth.js`

### Phase 2: Frontend Deps & Structure (4/4) ✅
- [x] 3. Remove Clerk from `frontend/package.json`
- [x] 4. Create `frontend/src/services/api.js` (axios instance)
- [x] 5. Create `frontend/src/contexts/AuthContext.jsx`
- [x] 6. Create `frontend/src/components/PrivateRoute.jsx`

### Phase 3: Core Refactors (6/6) ✅
- [x] 7. Update `frontend/src/App.jsx` (remove Clerk, add AuthProvider/PrivateRoute)
- [x] 8. Refactor `frontend/src/pages/Login.jsx` (custom form)
- [x] 9. Refactor `frontend/src/pages/Signup.jsx` (custom form + role?)
- [x] 10. Update `frontend/src/components/NavBar.jsx` (use AuthContext)
- [x] 11. Update `frontend/src/pages/ProviderDashboard.jsx` (use api.js token)

### Phase 4: Polish & Test (1/5)
- [x] 12. Add env vars (JWT_SECRET, VITE_BACKEND_URL)
- [ ] 13. Test full flow: register → login → dashboard → logout
- [ ] 14. Update README.md with new auth instructions
- [ ] 15. Role-based redirects (customer/vendor)
- [ ] 16. Error handling/loading states

### Phase 5: Optional/Production (0/1)
- [ ] 17. Backend CORS update if needed
- [ ] 18. Suggest deployment (Render/Vercel)

**Next: Test auth flow - start servers, try register/login!**

**Production-ready custom JWT auth implemented: Signup/Login with role, protected dashboard, token storage, api interceptor, logout, /me fetch.**
