import { NextResponse } from "next/server";
import { generateSiteContent, suggestTheme } from "@/lib/ai";
export async function POST(req) {
  try {
    const formData = await req.json();
    const content = await generateSiteContent(formData);
    const theme = formData.theme || suggestTheme(formData.profession);
    // Force abbreviated surname format in testimonials
    if (content.testimonials) {
      content.testimonials = content.testimonials.map(t => {
        const parts = t.name.trim().split(" ");
        if (parts.length >= 2) {
          const firstName = parts[0];
          const lastInitial = parts[parts.length - 1][0].toUpperCase();
          t.name = `${firstName} ${lastInitial}.`;
        }
        return t;
      });
    }
    return NextResponse.json({ content, theme });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
