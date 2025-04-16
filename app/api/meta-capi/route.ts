//This is the api route for handling meta conversions api

//Libraries -->
import { domainName } from '@/config/utils';
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { IMetaWebEvent } from '@/config/interfaces';

//Commencing the code -->
const apiVersion = process.env.META_API_VERSION!
const pixelId = process.env.META_PIXEL_ID!
const accessToken = process.env.META_ACCESS_TOKEN!

export async function POST(req: NextRequest) {
  try {
    const eventData = await req.json()

    //Verifying the env variables
    if (!apiVersion) {
        throw new Error("Api Version is undefined")
    } else if (!pixelId) {
        throw new Error("Pixel Id is undefined")
    } else if (!accessToken) {
        throw new Error("Access token is undefined")
    }

    //console.log("Testing: ", apiVersion, pixelId, accessToken)
    //console.log("Test Event data: ", eventData, JSON.stringify(eventData))

    const url = `https://graph.facebook.com/${apiVersion}/${pixelId}/events?access_token=${accessToken}`;
  
    const res = await axios.post(url, eventData, {
        headers: { 'Content-Type': 'application/json' },
    });

    return NextResponse.json({ data: res.data }, { status: 200 });
  } catch (error) {
    console.error('Error sending meta capi: ', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}