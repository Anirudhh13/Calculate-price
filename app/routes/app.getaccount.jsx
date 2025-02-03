import { json } from "@remix-run/node";
export const action = async ({ request }) => {
  try {
    const contentType = request.headers.get("Content-Type");
    if (contentType === "application/json") {
      const data = await request.json();
      console.log("Shop:", data.shop);
      console.log("Payload:", data.payload);
      // Perform your logic here
      return json({ success: true, message: "Data processed successfully" });
    } else {
      return json(
        { success: false, message: `Unsupported Content-Type: ${contentType}` },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return json({ success: false, message: error.message }, { status: 500 });
  }
};