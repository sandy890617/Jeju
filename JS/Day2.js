function switchTab(event, tabId) {
    // 1. 取得當前點擊按鈕的父容器 (限制範圍在該區塊內)
    const container = event.currentTarget.closest('.detail-card');
    if (!container) return;

    // 2. 只清除「該區塊內」按鈕與內容的 active 類別
    const tabButtons = container.querySelectorAll('.tab-btn');
    const tabContents = container.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // 3. 為「目前點擊的按鈕」與「對應的內容區塊」加上 active 類別
    event.currentTarget.classList.add('active');
    
    const targetContent = container.querySelector(`#${tabId}`);
    if (targetContent) {
        targetContent.classList.add('active');
    }
}

// 圖片放大
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    const modalCaption = document.getElementById("modalCaption");
    const closeBtn = document.querySelector(".modal-close");

    // 抓取頁面上「所有卡片內的圖片」以及「美食小圖」
    const images = document.querySelectorAll(".item-photos img, .food-img, .detail-card img");

    images.forEach(img => {
        // 設定點擊滑鼠指標樣式
        img.style.cursor = "pointer";

        img.addEventListener("click", function () {
            modal.style.display = "flex";
            modalImg.src = this.src;
            // 優先顯示 alt 屬性，若無則顯示預設文字
            modalCaption.textContent = this.alt || "圖片預覽";
        });
    });

    // 點擊右上角 X 關閉
    if (closeBtn) {
        closeBtn.addEventListener("click", function () {
            modal.style.display = "none";
        });
    }

    // 點擊黑色半透明背景關閉
    modal.addEventListener("click", function (e) {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    // 按鍵盤 ESC 關閉
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && modal.style.display === "flex") {
            modal.style.display = "none";
        }
    });
});
