async function jsonOrText(res) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    return JSON.stringify(await res.json(), null, 2);
  }
  return await res.text();
}

function wire(idBtn, idOut, path, opts = {}) {
  document.getElementById(idBtn).addEventListener("click", async () => {
    const out = document.getElementById(idOut);
    out.textContent = "Loading…";
    try {
      const res = await fetch(path, opts);
      const body = await jsonOrText(res);
      out.textContent = `${res.status} ${res.statusText}\n\n${body}`;
    } catch (e) {
      out.textContent = String(e);
    }
  });
}

wire("btn-health", "out-health", "/api/v1/health");
wire("btn-ai", "out-ai", "/api/v1/ai/v181/status");

document.getElementById("btn-whoami").addEventListener("click", async () => {
  const out = document.getElementById("out-whoami");
  const token = document.getElementById("token").value.trim();
  if (!token) {
    out.textContent = "Paste a Matrix access token first.";
    return;
  }
  out.textContent = "Loading…";
  try {
    const res = await fetch("/_matrix/client/r0/account/whoami", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await jsonOrText(res);
    out.textContent = `${res.status} ${res.statusText}\n\n${body}`;
  } catch (e) {
    out.textContent = String(e);
  }
});
