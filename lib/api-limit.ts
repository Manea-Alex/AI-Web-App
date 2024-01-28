import { auth } from "@clerk/nextjs"
import prismadb from "./prismadb"
import { MAX_FREE_COUNTS } from "@/constants"


// Function to increment the API usage count for a user
export const increaseApiLimit = async () =>{
    const {userId} = auth()

    if(!userId)
    {
        return
    }

     // Finding the API limit record for the user
    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where: {
            userId
        }
    })
     // Updating or creating the user's API limit record
    if (userApiLimit){
        await prismadb.userApiLimit.update({
            where: {userId: userId},
            data: {count: userApiLimit.count + 1},
        })
    } else {
        await prismadb.userApiLimit.create({
            data: {userId: userId, count: 1}
        })
    }

}

// Function to check if a user has exceeded the free API usage limit
export const checkApiLimit = async () => {
    const { userId } = auth()

    if(!userId)
    {
        return false
    }

    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where: {
            userId: userId
        }
    })

    // Returning true if the user is within the free usage limit
    if(!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
        return true
    } else {
        return false
    }

}

// Function to get the current API usage count for a user
 export const getApiLimitCount = async()  => {
    const { userId } = auth()

    if(!userId)
    {
        return 0
    }

    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where: {
            userId
        }
    })

    if(!userApiLimit){
        return 0
    }

    return userApiLimit.count
}