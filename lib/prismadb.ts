// Importing the PrismaClient from the Prisma library
import { PrismaClient } from "@prisma/client"

// Declaration of a global variable 'prisma' to avoid multiple instances of PrismaClient
declare global {
    var prisma: PrismaClient | undefined
}

// Creating a new PrismaClient instance or using an existing one from the global scope
const prismadb = globalThis.prisma || new PrismaClient()
// In a non-production environment, the PrismaClient instance is assigned to the global scope
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismadb

// Exporting the PrismaClient instance for use in the application
export default prismadb