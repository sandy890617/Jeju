// ==========================================
// 1. 備選方案外框顯示/隱藏控制函式
// ==========================================
function updateAltSections() {
  document.querySelectorAll('.alt-section-wrapper').forEach(wrapper => {
    // 檢查該區塊內是否有「顯示中」的卡片
    const visibleCards = Array.from(wrapper.querySelectorAll('.alt-card')).filter(card => {
      return card.style.display !== 'none' && !card.classList.contains('hidden');
    });

    // 若區塊內無可見卡片，整組外框（包含標題與虛線）直接隱藏
    wrapper.style.display = visibleCards.length > 0 ? '' : 'none';
  });
}

// ==========================================
// 2. 主邏輯監聽 (DOM 載入完成)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  let doneList = JSON.parse(localStorage.getItem("doneTrips")) || [];

  // ------------------------------------------
  // (1) 主分頁 Tab 切換 (Day 1~4、航班、住宿、清單)
  // ------------------------------------------
  const tabs = document.querySelectorAll(".nav-tab");
  const panels = document.querySelectorAll(".tab-panel");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));

      tab.classList.add("active");
      const target = tab.getAttribute("data-target");
      document.getElementById(target)?.classList.add("active");
    });
  });

  // ------------------------------------------
  // (2) 劃掉打勾功能（限定包含 .check-icon 的項目）
  // ------------------------------------------
  document.querySelectorAll(".check-item").forEach(item => {
    const key = item.getAttribute("data-key");
    const icon = item.querySelector(".check-icon");

    if (!icon) return; // 景點項目無打勾圖示，略過

    // 初始化狀態
    if (doneList.includes(key)) {
      item.classList.add("done");
      icon.className = "fa-solid fa-circle-check check-icon";
    }

    // 點擊事件
    item.addEventListener("click", (e) => {
      // 避免點到圖片或商品連結時觸發打勾
      if (e.target.closest("img") || e.target.closest(".product-link-btn")) return;

      const isDone = item.classList.toggle("done");
      icon.className = isDone ? "fa-solid fa-circle-check check-icon" : "fa-solid fa-circle check-icon";

      if (isDone) {
        if (!doneList.includes(key)) doneList.push(key);
      } else {
        doneList = doneList.filter(k => k !== key);
      }
      localStorage.setItem("doneTrips", JSON.stringify(doneList));
    });
  });

  // ------------------------------------------
  // (3) 次級選單切換 (必買清單：Olive Young / 藥局 / 紀念品 / 隱形眼鏡)
  // ------------------------------------------
  const subTabs = document.querySelectorAll(".sub-tab");
  const subPanels = document.querySelectorAll(".sub-panel");

  subTabs.forEach(subTab => {
    subTab.addEventListener("click", (e) => {
      e.stopPropagation();
      subTabs.forEach(t => t.classList.remove("active"));
      subPanels.forEach(p => p.classList.remove("active"));

      subTab.classList.add("active");
      const targetSub = subTab.getAttribute("data-sub-target");
      document.getElementById(targetSub)?.classList.add("active");
    });
  });

  // ------------------------------------------
  // (4) 圖片點擊放大 (Lightbox：景點圖與商品圖通用)
  // ------------------------------------------
  const imageModal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImg");
  const modalClose = document.getElementById("modalClose");

  document.querySelectorAll(".item-gallery img, .product-thumb img").forEach(img => {
    img.addEventListener("click", (e) => {
      e.stopPropagation();
      if (imageModal && modalImg) {
        modalImg.src = img.src;
        modalImg.alt = img.alt || "放大預覽";
        imageModal.classList.add("show");
      }
    });
  });

  const closeModal = () => {
    if (imageModal && modalImg) {
      imageModal.classList.remove("show");
      modalImg.src = "";
    }
  };

  modalClose?.addEventListener("click", closeModal);
  imageModal?.addEventListener("click", (e) => {
    if (e.target === imageModal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });

  // ------------------------------------------
  // (5) 整合區域分類按鈕篩選 (#restaurant, #A, #B, #D, #E, #F)
  // ------------------------------------------
  const filterContainers = ['#restaurant', '#A', '#B', '#D', '#E', '#F'];

  filterContainers.forEach(selector => {
    const container = document.querySelector(selector);
    if (!container) return;

    const filterBtns = container.querySelectorAll('.filter-btn');
    const items = container.querySelectorAll('.check-item');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // 切換 active 樣式
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        // 篩選各卡片顯示狀態
        items.forEach(item => {
          const itemArea = item.getAttribute('data-area');
          // 支援 "all"、"A-all"、"E-all" 等全選標籤，或是符合 data-area 的項目
          if (filterValue === 'all' || filterValue.endsWith('-all') || itemArea === filterValue) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });

        // 每次切換篩選，同步更新備選區塊與虛線外框
        updateAltSections();
      });
    });
  });

  // ------------------------------------------
  // (6) 自動綁定所有代購金額輸入框與 LocalStorage
  // ------------------------------------------
  const bindAutoSavePrice = () => {
    document.querySelectorAll('.check-item[data-key]').forEach(item => {
      const itemKey = item.getAttribute('data-key');
      const krwInput = item.querySelector('.save-krw');
      const twdInput = item.querySelector('.save-twd');

      // 韓幣讀取與儲存
      if (krwInput) {
        const krwKey = `price-krw-${itemKey}`;
        const savedKrw = localStorage.getItem(krwKey);
        if (savedKrw !== null) krwInput.value = savedKrw;

        krwInput.addEventListener('input', (e) => {
          localStorage.setItem(krwKey, e.target.value);
        });
      }

      // 台幣讀取與儲存
      if (twdInput) {
        const twdKey = `price-twd-${itemKey}`;
        const savedTwd = localStorage.getItem(twdKey);
        if (savedTwd !== null) twdInput.value = savedTwd;

        twdInput.addEventListener('input', (e) => {
          localStorage.setItem(twdKey, e.target.value);
        });
      }
    });
  };

  bindAutoSavePrice();

  // 頁面初次載入時執行一次，確保備選方案顯示狀態正確
  updateAltSections();
});

// ==========================================
// 3. 平滑滾動至目標卡片函式
// ==========================================
function scrollToCard(cardKey) {
  const targetCard = document.querySelector(`.check-item[data-key="${cardKey}"]`) || document.getElementById(`card-${cardKey}`);

  if (!targetCard) return;

  // 如果目標卡片被分類篩選隱藏（display: none），自動切換回「全部」按鈕
  if (getComputedStyle(targetCard).display === 'none') {
    const parentPanel = targetCard.closest('.tab-panel') || document;
    const allBtn = parentPanel.querySelector('.filter-btn[data-filter="all"], .filter-btn[data-filter$="-all"]') ||
                   Array.from(parentPanel.querySelectorAll('button, .tag')).find(el => el.textContent.includes('全部'));
    if (allBtn) {
      allBtn.click();
    } else {
      targetCard.style.display = '';
      updateAltSections();
    }
  }

  // 平滑滾動到目標卡片，保留頂部視距
  setTimeout(() => {
    targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // 加上短暫高亮效果
    targetCard.classList.add('highlight-pulse');
    setTimeout(() => {
      targetCard.classList.remove('highlight-pulse');
    }, 1500);
  }, 100);
}
