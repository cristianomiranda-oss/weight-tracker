// Credit: all api calls were created using a pattern by Lee Robinson
// https://nextjs.org/blog/building-apis-with-nextjs
import { WeightTrackerDataBase } from "@/app/libs/mongodb";

export async function GET(request: Request) {
  try {
    const connectionTest = await WeightTrackerDataBase.testDbConnection();

    return new Response(connectionTest, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Connection Test GET: ", error);
    return new Response(JSON.stringify({ message: "POST Failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
