export async function GET() {
  try {
    return new Response(JSON.stringify({ message: "Logged out successfully" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": `Authorization=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`,
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error during logout", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
