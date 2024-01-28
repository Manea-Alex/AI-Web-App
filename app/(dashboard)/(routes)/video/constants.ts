// Importing zod for schema validation
import * as z from "zod"
// Defining the schema for the form data using zod
export const formSchema = z.object ({
     // The prompt field must be a string with at least 1 character
    prompt: z.string().min(1, {
        message: "Video prompt is required"
    })
})