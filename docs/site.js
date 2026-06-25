const translations = {
  zh: {
    documentTitle: "WorldCup Gadget - 世界杯桌面悬浮球",
    navDownload: "下载",
    heroSubtitle:
      "一个世界杯桌面悬浮球。下载 Mac 应用后，悬浮球会显示在桌面上，点击即可展开最新战报。",
    downloadLatest: "下载最新版",
    releaseNote: "通过 GitHub Releases 免费分发",
    previewLabel: "应用界面预览",
    previewSource: "本地战报",
    previewRefresh: "刷新",
    previewTitle: "2026 世界杯战报",
    previewStatus: "数据自动更新 · 北京时间",
    previewTeamA: "🇺🇾 乌拉圭",
    previewTeamB: "佛得角 🇨🇻",
    desktopTitle: "下载后仍然是桌面悬浮球",
    desktopBody:
      "GitHub Pages 只是下载页，真正运行的是 GitHub Releases 里的 macOS App。用户安装并打开后，悬浮球仍然显示在 Mac 桌面上，而不是只能在网页中查看。",
    featureLabel: "核心能力",
    featureFloatingTitle: "悬浮显示",
    featureFloatingBody: "小足球常驻桌面，点击展开或收起战报。",
    featureDataTitle: "自动数据",
    featureDataBody: "应用会从远程 feed 更新，再读取本地缓存展示。",
    featureDistributionTitle: "免费分发",
    featureDistributionBody: "当前 beta 通过 GitHub Pages 和 Releases 分发。",
    firstOpenTitle: "首次打开",
    firstOpenBody:
      "当前版本暂未接入 Apple Developer ID 签名和公证。macOS 第一次打开时可能提示无法验证开发者，这是 unsigned beta 的正常限制。下载来源请以本页面链接到的 GitHub Release 为准。",
    releasePage: "前往 Release 页面"
  },
  en: {
    documentTitle: "WorldCup Gadget - Desktop World Cup Floating Ball",
    navDownload: "Download",
    heroSubtitle:
      "A desktop World Cup floating ball for macOS. Download the Mac app, keep the ball on your desktop, and click it to open the latest match report.",
    downloadLatest: "Download Latest",
    releaseNote: "Free distribution through GitHub Releases",
    previewLabel: "App preview",
    previewSource: "Local Report",
    previewRefresh: "Refresh",
    previewTitle: "2026 World Cup Report",
    previewStatus: "Auto-updated data · Beijing time",
    previewTeamA: "🇺🇾 Uruguay",
    previewTeamB: "Cape Verde 🇨🇻",
    desktopTitle: "It is still a desktop floating gadget after download",
    desktopBody:
      "GitHub Pages is only the download page. The real product is the macOS app hosted in GitHub Releases. After users install and open it, the floating ball still appears on the Mac desktop instead of being limited to a web page.",
    featureLabel: "Core features",
    featureFloatingTitle: "Desktop Floating Ball",
    featureFloatingBody: "A small soccer ball stays on the desktop. Click to open or collapse the report.",
    featureDataTitle: "Automatic Data",
    featureDataBody: "The app updates from a remote feed, then renders the local cache.",
    featureDistributionTitle: "Free Distribution",
    featureDistributionBody: "The current beta is distributed through GitHub Pages and GitHub Releases.",
    firstOpenTitle: "First Launch",
    firstOpenBody:
      "This version does not yet use Apple Developer ID signing or notarization. macOS may warn that the developer cannot be verified on first launch. That is a normal limitation of this unsigned beta. Please download only from the GitHub Release linked here.",
    releasePage: "Open Release Page"
  }
};

function getInitialLanguage() {
  const storedLanguage = localStorage.getItem("worldcup-gadget-language");
  if (storedLanguage === "zh" || storedLanguage === "en") {
    return storedLanguage;
  }

  return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
}

function applyLanguage(language) {
  const dictionary = translations[language] || translations.zh;

  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.body.dataset.lang = language;
  document.title = dictionary.documentTitle;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (dictionary[key]) {
      element.textContent = dictionary[key];
    }
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    const key = element.dataset.i18nAriaLabel;
    if (dictionary[key]) {
      element.setAttribute("aria-label", dictionary[key]);
    }
  });

  document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
    const isActive = button.dataset.langToggle === language;
    button.setAttribute("aria-selected", String(isActive));
  });

  localStorage.setItem("worldcup-gadget-language", language);
}

document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    applyLanguage(button.dataset.langToggle);
  });
});

applyLanguage(getInitialLanguage());
