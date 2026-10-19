function ensureStylesheet(id, href) {
  if (document.getElementById(id)) {
    return;
  }

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

function ensureScript(id, src) {
  const existing = document.getElementById(id);

  if (existing) {
    if (existing.getAttribute("data-loaded") === "true") {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Unable to load editor.")), { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.setAttribute("data-loaded", "true");
      resolve();
    };
    script.onerror = () => reject(new Error("Unable to load editor."));
    document.body.appendChild(script);
  });
}

let sharedLoaderPromise = null;

export async function loadFroalaAssets({
  styleId = "pgc-froala-style",
  scriptId = "pgc-froala-script",
  styleUrl = "https://cdn.jsdelivr.net/npm/froala-editor@latest/css/froala_editor.pkgd.min.css",
  scriptUrl = "https://cdn.jsdelivr.net/npm/froala-editor@latest/js/froala_editor.pkgd.min.js"
} = {}) {
  if (window.FroalaEditor) {
    return;
  }

  if (sharedLoaderPromise) {
    return sharedLoaderPromise;
  }

  ensureStylesheet(styleId, styleUrl);
  sharedLoaderPromise = ensureScript(scriptId, scriptUrl).finally(() => {
    if (!window.FroalaEditor) {
      sharedLoaderPromise = null;
    }
  });

  return sharedLoaderPromise;
}

export function createRichTextManager({
  selector,
  styleId,
  scriptId,
  styleUrl,
  scriptUrl,
  editorOptions = {}
}) {
  let editors = [];

  return {
    async setup(container, setStatus = () => {}) {
      const textareas = [...container.querySelectorAll(selector)];

      if (!textareas.length) {
        return;
      }

      this.destroy();

      try {
        await loadFroalaAssets({ styleId, scriptId, styleUrl, scriptUrl });

        if (!window.FroalaEditor) {
          throw new Error("Editor unavailable.");
        }

        editors = textareas.map(
          (textarea) =>
            new window.FroalaEditor(textarea, {
              heightMin: 200,
              toolbarSticky: false,
              ...editorOptions
            })
        );

        setStatus("");
      } catch {
        setStatus("Rich editor could not load. Plain textarea fallback is active.", true);
      }
    },
    syncToFormData(formData) {
      editors.forEach((editor) => {
        const textareaName = editor.el?.getAttribute("name");

        if (textareaName && editor.html) {
          formData.set(textareaName, editor.html.get());
        }
      });
    },
    destroy() {
      editors.forEach((editor) => {
        try {
          editor?.destroy?.();
        } catch {}
      });

      editors = [];
    }
  };
}
