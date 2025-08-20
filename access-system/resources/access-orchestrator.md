# Access Orchestrator

### 🧭 **Access Orchestrator Sync Flow – Step-by-Step**


#### 🔐 **Authentication and Throttling**
- Client hits `POST /access-orchestrator/sync` 
- Throttle check (10 requests per 60 seconds)
    - If exceeded → 429 Rate Limited
- JWT Auth Guard check
    - If failed → 401 Unauthorized
- Check `req.user` 
    - If missing → 401 User not authenticated
- Extract `JwtUser`  from `req.user` 


#### 📦 **User Fetch & Validation**
- Build user query to fetch:
    - `_id` , `username` , `departments` , `teams` , `roles` , `vip_permissions_list` , `directPermissions` , `attributes` 
- Send `USER_GET`  via RabbitMQ
    - If not found → 404 User not found
- If found:
    - Set default `userAttributes`  if missing:
        - `experienceLevel: JUNIOR` 
        - `teamLead: []` 
        - `departmentHead: []` 
        - `customAttributes: {}` 


#### 📚 **Gather Permission Sources**
- Extract arrays:
    - `userRoles` , `userTeams` , `userDepartments` , `userVipPolicyList` , `userDirectPermissions` 
- Call `finalizeUserPermissions`  with all extracted inputs


#### 🧠 **Permission Finalization Core**
- Initialize `finalPermissionsMap`  to store merged final permission entries


#### 🛠️ **Parallel Data Fetch**
- Via `Promise.all` :
    - `rolePermissionsMap`  (if roles present)
    - `departmentPermissionsMap`  (if depts present)
    - `teamPermissionsMap`  (if teams present)
    - `vipPoliciesListMap`  (if policies present)


#### 🧮 **Permission ID Collection**
- Collect all unique `permissionIds`  from:
    - Roles, Departments, Teams, DirectPermissions, VIP Policies
- If no permissionIds → return success with empty data


#### 🔍 **Permission Metadata Resolution**
- Fetch permission metadata (module, action) via `PERMISSIONS_GET_ALL` 
    - If fails → 500 Internal Error
- Build `permissionDetailsMap` 


### 🟣 **Normal Permission Processing**
#### 📘 Roles
- Loop through roles and their permissions
- For each permission (if Normal AccessLevel):
    - SELF → targetIds = `[user._id]` 
    - TEAM → fetchTeamMembers
    - DEPT → fetchDepartmentStaff
    - ALL_TEAM → fetchTeamHierarchy + team members
    - DEPT_TEAMS → fetchDept + team members
- Call `updatePermission(...)`  for each valid entry
#### 📙 Teams
- Same structure:
    - TEAM → fetchTeamMembers
    - ALL_TEAM → fetchTeamHierarchy + team members
- Update permissions
#### 📕 Departments
- DEPT → fetchDepartmentStaff
- DEPT_TEAMS → fetchDeptStaff + team members
- Update permissions
#### 📗 DirectPermissions
- Identical structure as above using directPermissions list
- Additional flag `isDirect = true`  during update


### 🟢 **VIP Permission Processing**
#### 🎯 For Each Active VIP Policy:
- Must be active, and accessLevel must be VIP type
##### AppliesTo: Users
- resolveUsersPolicy:
    - VIP_SELF → use `targetUsers` 
    - VIP_TEAM → target users' teams → team members
    - VIP_DEPT → target users' depts → staff
    - VIP_TEAM_ALL → hierarchy members
    - VIP_DEPT_TEAMS → dept staff + team members
##### AppliesTo: Team
- resolveTeamPolicy:
    - VIP_TEAM → team members
    - VIP_TEAM_ALL → team hierarchy + members
##### AppliesTo: Department
- resolveDepartmentPolicy:
    - VIP_DEPT → staff
    - VIP_DEPT_TEAMS → staff + team members
##### AppliesTo: Global
- resolveGlobalPolicy handles all of the above
##### Policy Conditions
- If resolved targetIds are not empty:
    - Check conditions:
        - `teamLead` , `departmentHead` , `experienceLevel` , `minHierarchyLevel` 
    - If met → add to `finalPermissionsMap`  with `vipResolver = true`  and `accessAttributes` 


### 🧾 **Final Orchestrator Build**
- Convert `finalPermissionsMap`  to orchestrator array
- Each item includes:
    - `permission` , `module` , `action` , `vipResolver` 
    - `finalizeResolution` , `normalResolution` , `vipResolution` 
    - `accessAttributes`  (for VIP)


### 💾 **User Update**
- Send `USER_UPDATE`  with `userId`  and `accessOrchestrator: orchestratorData` 
    - If fails → log + return error response
    - If success → (optionally) set cache → return 200 with data


