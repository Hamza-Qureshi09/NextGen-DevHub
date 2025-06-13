# Access Control System Implementation

Below is the complete implementation of your access control system, including CRUD APIs, authentication, protected routes, and package configurations. The system follows your specified flow and requirements, ensuring scalability and robustness.

## File Structure

```
project/
├── src/
│   ├── models/
│   │   ├── Permission.ts
│   │   ├── Role.ts
│   │   ├── Team.ts
│   │   ├── Department.ts
│   │   ├── Policy.ts
│   │   ├── StaffUser.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── permissionRoutes.ts
│   │   ├── roleRoutes.ts
│   │   ├── teamRoutes.ts
│   │   ├── departmentRoutes.ts
│   │   ├── policyRoutes.ts
│   │   ├── staffUserRoutes.ts
│   │   ├── protectedRoutes.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── permissionController.ts
│   │   ├── roleController.ts
│   │   ├── teamController.ts
│   │   ├── departmentController.ts
│   │   ├── policyController.ts
│   │   ├── staffUserController.ts
│   │   ├── protectedController.ts
│   ├── middleware/
│   │   ├── authMiddleware.ts
│   │   ├── permissionMiddleware.ts
│   ├── utils/
│   │   ├── jwtUtils.ts
│   │   ├── accessControl.ts
│   ├── server.ts
├── package.json
├── tsconfig.json
```

## Models

Your provided Mongoose schemas are correct and will be used as-is. They are well-structured for scalability, with proper indexing and auto-increment logic. I'll assume they are placed in the `src/models/` directory as shown above.

## Package.json

<xaiArtifact artifact_id="12355178-2004-49dc-a1f8-419a7e06990e" artifact_version_id="f8dd912a-750b-4107-9cb8-bcf7d79d27dc" title="package.json" contentType="text/json">
{
  "name": "access-control-system",
  "version": "1.0.0",
  "description": "Scalable Role-Based Access Control System",
  "main": "dist/server.js",
  "scripts": {
    "start": "node dist/server.js",
    "build": "tsc",
    "dev": "ts-node-dev --respawn src/server.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "validator": "^13.11.0",
    "cookie-parser": "^1.4.6",
    "dotenv": "^16.3.1",
    "http-errors": "^2.0.0",
    "express-async-handler": "^1.2.0"
  },
  "devDependencies": {
    "typescript": "^5.2.2",
    "ts-node-dev": "^2.0.0",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/bcryptjs": "^2.4.6",
    "@types/validator": "^13.11.7",
    "@types/cookie-parser": "^1.4.6",
    "@types/node": "^20.10.0"
  }
}
