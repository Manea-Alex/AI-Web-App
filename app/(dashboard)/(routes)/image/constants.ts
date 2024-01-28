// Importing zod for schema validation
import * as z from "zod"

// Defining the schema for the form data using zod
export const formSchema = z.object ({
    // The prompt, amount and resolution fields must be a string with at least 1 character
    prompt: z.string().min(1, {
        message: "Image Prompt is required"
    }),
    amount: z.string().min(1),
    resolution: z.string().min(1)
})

// 'amountOptions' is an array of objects representing the options for the number of photos the user can generate
// Each object contains a 'value' representing the number of photos and a 'label' for displaying the option in the interface
export const amountOptions = [
    {
        value: "1",
        label: "1 Photo"
    },

    {
        value: "2",
        label: "2 Photos"
    },

    {
        value: "3",
        label: "3 Photos"
    },

    {
        value: "4",
        label: "4 Photos"
    },

    {
        value: "5",
        label: "5 Photos"
    }
]

// 'resolutionOptions' is an array of objects providing different resolution options for photo generation
// Each option includes a 'value' indicating the resolution dimensions and a 'label' for the interface

export const resolutionOptions = [
    {
        value:"256x256",
        label: "256x256",
    },

    {
        value:"512x512",
        label: "512x512",
    },

    {
        value:"1024x1024",
        label: "1024x1024",
    },
]