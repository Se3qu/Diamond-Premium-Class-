export async function testBackend() {
  const res = await fetch("http://127.0.0.1:8000/api/test");
  return res.json();
}
