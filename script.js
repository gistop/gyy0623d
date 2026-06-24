const form = document.querySelector(".contact-form");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("感谢咨询，我们会尽快联系你。");
  });
}

// D1 read/write for index page
const writeBtn = document.getElementById("write-btn");
const readBtn = document.getElementById("read-btn");
const d1Input = document.getElementById("d1-input");

if (writeBtn && d1Input) {
  writeBtn.addEventListener("click", async () => {
    const message = d1Input.value.trim();
    if (!message) {
      alert("请输入内容");
      return;
    }
    try {
      const res = await fetch("/api/write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "写入失败");
      }
      const data = await res.json();
      alert(`写入成功，ID: ${data.id}`);
      d1Input.value = "";
    } catch (err) {
      alert("写入失败: " + err.message);
    }
  });
}

if (readBtn) {
  readBtn.addEventListener("click", async () => {
    try {
      const res = await fetch("/api/read");
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "读取失败");
      }
      const messages = await res.json();
      if (messages.length === 0) {
        alert("数据库中没有消息");
      } else {
        alert("D1中的消息:\n" + messages.map((m, i) => `${i+1}. ${m.content}`).join("\n"));
      }
    } catch (err) {
      alert("读取失败: " + err.message);
    }
  });
}