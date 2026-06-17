import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      id: 1,
      name: "Taj Mahal",
      country: "India",
      risk: "Low",
      score: 20,
      reason: "Well maintained and protected",
      lat: 27.1751,
      lng: 78.0421,
    },
    {
      id: 2,
      name: "Sundarbans",
      country: "India/Bangladesh",
      risk: "Medium",
      score: 55,
      reason: "Climate change and rising sea levels",
      lat: 21.9497,
      lng: 89.1833,
    },
    {
      id: 3,
      name: "Mohenjo-daro",
      country: "Pakistan",
      risk: "High",
      score: 85,
      reason: "Weather erosion and degradation",
      lat: 27.3294,
      lng: 68.1386,
    },
    {
  id: 4,
  name: "Colosseum",
  country: "Italy",
  risk: "Low",
  score: 25,
  reason: "Strong preservation efforts",
  lat: 41.8902,
  lng: 12.4922,
},
{
  id: 5,
  name: "Machu Picchu",
  country: "Peru",
  risk: "Medium",
  score: 58,
  reason: "Tourism pressure",
  lat: -13.1631,
  lng: -72.5450,
},
  ]);
}