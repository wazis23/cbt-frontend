export function initAntiCheat(attemptId) {

  const trigger = async () => {
    await fetch("http://cbt-backend.test/api/v1/exam/violation", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ attempt_id: attemptId })
    });

    alert("Anda keluar dari ujian");
    window.location.href = "/";
  };

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) trigger();
  });

  window.addEventListener("blur", trigger);

  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) trigger();
  });
}