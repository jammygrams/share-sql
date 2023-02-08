export async function queryGPT(SQLCode) {
  try {
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql: SQLCode }),
    });
    const data = await response.json();
    if (response.status !== 200) {
      throw (
        data.error || new Error(`Request failed with status ${response.status}`)
      );
    }
    console.log(`Prediction: ${data.result}`);
    return data.result;
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}
