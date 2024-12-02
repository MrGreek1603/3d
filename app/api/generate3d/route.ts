import { fal } from "@fal-ai/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageUrl, removeBackground } = body;

    if (!imageUrl) {
      return Response.json({ error: "Image URL is required" }, { status: 400 });
    }

    const result = await fal.subscribe("fal-ai/triposr", {
      input: {
        image_url: imageUrl,
        output_format: "glb",
        do_remove_background: removeBackground,
        foreground_ratio: 0.9,
        mc_resolution: 256,
      },
      logs: true,
    });

    return Response.json(result);
  } catch (error) {
    console.error("Error generating 3D model:", error);
    return Response.json(
      { error: "Failed to generate 3D model" },
      { status: 500 }
    );
  }
} 