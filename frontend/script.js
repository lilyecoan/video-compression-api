console.log("🚀 Starting FFmpeg setup...");

(async () => {
  if (!window.FFmpeg) {
    console.error("❌ FFmpeg failed to load. Check the script tag or internet connection.");
    alert("FFmpeg failed to load. Please check your internet connection or try refreshing.");
    return;
  }

  const { createFFmpeg, fetchFile } = window.FFmpeg;

  const ffmpeg = createFFmpeg({
    log: true,
    corePath: "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/ffmpeg-core.js"
  });

  ffmpeg.setProgress(({ ratio }) => {
    console.log(`Loading FFmpeg: ${(ratio * 100).toFixed(1)}%`);
  });

  const uploader = document.getElementById("uploader");
  const compressBtn = document.getElementById("compressBtn");
  const downloadLink = document.getElementById("downloadLink");

  compressBtn.addEventListener("click", async () => {
    if (!uploader.files.length) {
      alert("Please select a video first.");
      return;
    }

    const file = uploader.files[0];
    console.log("⏳ Loading FFmpeg core...");
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
      console.log("✅ FFmpeg core loaded!");
    }

    console.log("🎬 Compressing video...");
    ffmpeg.FS("writeFile", "input.mp4", await fetchFile(file));
    await ffmpeg.run("-i", "input.mp4", "-vcodec", "libx264", "-crf", "28", "output.mp4");

    console.log("✅ Compression finished!");

    const data = ffmpeg.FS("readFile", "output.mp4");
    const url = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));

    downloadLink.href = url;
    downloadLink.download = "compressed.mp4";
    downloadLink.textContent = "⬇️ Download Compressed Video";
    downloadLink.style.display = "block";
  });
})();


