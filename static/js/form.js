document.addEventListener("DOMContentLoaded", function () {
    const pages = document.querySelectorAll(".form-page");
    const nextButtons = document.querySelectorAll(".next-button");
    const prevButtons = document.querySelectorAll(".prev-button");
    const form = document.getElementById("ayurveda-test-form");
    const resultContainer = document.getElementById("result-container");

    let currentPage = 0; // 当前显示的页面索引

    // 页面切换逻辑
    function showPage(index) {
        pages.forEach((page, i) => {
            page.style.display = i === index ? "block" : "none";
        });
        resultContainer.style.display = "none"; // 确保结果容器初始隐藏
    }

    // 显示结果页面
    function showResultPage() {
        pages.forEach(page => page.style.display = "none"); // 隐藏所有问卷页面
        resultContainer.style.display = "block"; // 显示结果容器
    }

    // 初始显示第一页
    showPage(currentPage);

    // 下一页按钮事件绑定
    nextButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (currentPage < pages.length - 1) {
                currentPage++;
                showPage(currentPage);
            }
        });
    });

    // 上一页按钮事件绑定
    prevButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (currentPage > 0) {
                currentPage--;
                showPage(currentPage);
            }
        });
    });

    // 提交表单并显示结果
    form.addEventListener("submit", function (e) {
        e.preventDefault(); // 阻止默认表单提交

        // 收集表单数据
        const formData = new FormData(form);
        const answers = {};
        const questionNames = Array.from(form.querySelectorAll("input[type='radio']")).map(input => input.name);

        // 初始化所有题目为未回答
        questionNames.forEach(name => {
            answers[name] = formData.get(name) || "none"; // 如果没有回答，则默认值为 "none"
        });

        // 模拟分数统计
        const doshaCounts = { vata: 0, pitta: 0, kapha: 0 };
        for (const [key, value] of Object.entries(answers)) {
            const dosha = form.querySelector(`input[name="${key}"][value="${value}"]`)?.getAttribute("data-dosha");
            if (dosha) {
                doshaCounts[dosha]++;
            }
        }

        // 计算比率
        const total = doshaCounts.vata + doshaCounts.pitta + doshaCounts.kapha;
        const ratios = total > 0 ? {
            vata: ((doshaCounts.vata / total) * 100).toFixed(2) + "%",
            pitta: ((doshaCounts.pitta / total) * 100).toFixed(2) + "%",
            kapha: ((doshaCounts.kapha / total) * 100).toFixed(2) + "%"
        } : { vata: "0%", pitta: "0%", kapha: "0%" };

        // 显示结果页面
        displayResults(doshaCounts, ratios);
        showResultPage();
    });

    // 动态生成结果内容
    function displayResults(doshaCounts, ratios) {
        resultContainer.innerHTML = `
            <h2>测试结果</h2>
            <ul>
                <li class="vata">Vata: ${doshaCounts.vata} 分 (${ratios.vata})</li>
                <li class="pitta">Pitta: ${doshaCounts.pitta} 分 (${ratios.pitta})</li>
                <li class="kapha">Kapha: ${doshaCounts.kapha} 分 (${ratios.kapha})</li>
            </ul>
            <p>感谢您的参与！如果需要，您可以点击“重新测试”按钮重新开始。</p>
            <div class="button-container">
                <button id="restart-test" class="restart-button">重新测试</button>
            </div>
        `;

        // 重新绑定重新测试按钮事件
        bindRestartButton();
    }

    // 绑定重新测试按钮事件
    function bindRestartButton() {
        const restartButton = document.getElementById("restart-test");
        if (restartButton) {
            restartButton.addEventListener("click", () => {
                currentPage = 0; // 回到第一页
                form.reset(); // 重置表单
                showPage(currentPage);
            });
        }
    }
});
