// Importing zod for schema validation
import * as z from "zod"

// Defining the schema for the form data using zod
export const formSchema = z.object ({
    prompt: z.string().min(1, {
        message: "Prompt is required"
    })
})