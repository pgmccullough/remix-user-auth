import { prisma } from '~/models/prismaClient'
import { handlePrismaError } from '~/utils/prismaErrors'
import { getUserBy } from './userController'

export const updateProfile = async(username: string, fields: { [key: string]: string }) => {
    const nullifyFields: { [key: string]: string | null } = {};
    for(const [key, value] of Object.entries(fields)) {
        nullifyFields[key] = value || null
    }
    const user = await getUserBy("username", username);
    if(!user?.id) return "invalid username";
    let latLong = {lat: "", lng: ""};
    if(nullifyFields['address_of_member_family']) {
        console.log("okay ", nullifyFields['address_of_member_family'],process.env.GMAPS_API_KEY);
        const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(nullifyFields['address_of_member_family'].replaceAll(' ','+'))}&key=${process.env.GMAPS_API_KEY}`)
        try {
            const { results } = await res.json();
            const { geometry } = results[0]
            const { location } = geometry;
            latLong = location;
        } catch(err) {
            console.log("invalid address")
        }
    }
    const profile = await prisma.profile.upsert({
        where: {
            userId: user.id
        },
        update: { ...nullifyFields, lat_long: JSON.stringify(latLong) },
        create: { ...nullifyFields, lat_long: JSON.stringify(latLong), userId: user.id}
    })
}

export const getProfileBy = async (field: 'email' | 'id' | 'username', value: string) => {
    const user = await getUserBy(field, value);
    if(!user?.id) return "invalid user"
    try {
      return await prisma.profile.findFirst({
        where: {
            userId: user.id
        },
      })
    } catch (error) {
      throw new Error(`Error fetching user: ${handlePrismaError(error)}`)
    }
}