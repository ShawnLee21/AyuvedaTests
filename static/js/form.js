document.addEventListener("DOMContentLoaded", function () {
    const pages = document.querySelectorAll(".form-page");
    const nextButtons = document.querySelectorAll(".next-button");
    const prevButtons = document.querySelectorAll(".prev-button");
    const form = document.getElementById("ayurveda-test-form");
    const resultContainer = document.getElementById("result-container");

    let currentPage = 0;

    // 页面切换逻辑
    function showPage(index) {
        pages.forEach((page, i) => {
            page.style.display = i === index ? "block" : "none";
        });
        resultContainer.style.display = "none"; // 隐藏结果容器
    }
    showPage(currentPage);

    nextButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (currentPage < pages.length - 1) {
                currentPage++;
                showPage(currentPage);
            }
        });
    });

    prevButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (currentPage > 0) {
                currentPage--;
                showPage(currentPage);
            }
        });
    });

    // 提交表单并计算结果
    form.addEventListener("submit", function (e) {
        e.preventDefault(); // 阻止默认表单提交

        // 移除所有 required 属性以允许空白提交
        const requiredFields = form.querySelectorAll("[required]");
        requiredFields.forEach(field => field.removeAttribute("required"));

        // 收集表单数据
        const answers = {};
        const formData = new FormData(form);
        formData.forEach((value, key) => {
            answers[key] = value;
        });

        // 统计 Dosha 的分数
        const doshaCounts = { vata: 0, pitta: 0, kapha: 0 };
        for (const [key, value] of Object.entries(answers)) {
            const dosha = form.querySelector(`input[name="${key}"][value="${value}"]`)?.getAttribute("data-dosha");
            if (dosha) {
                doshaCounts[dosha]++;
            }
        }

        // 计算比值
        const total = doshaCounts.vata + doshaCounts.pitta + doshaCounts.kapha || 1;
        const ratios = {
            vata: ((doshaCounts.vata / total) * 100).toFixed(2) + "%",
            pitta: ((doshaCounts.pitta / total) * 100).toFixed(2) + "%",
            kapha: ((doshaCounts.kapha / total) * 100).toFixed(2) + "%",
        };

        // 动态生成结果内容
        resultContainer.innerHTML = `
            <h2>测试结果</h2>
            <ul>
                <li class="vata">Vata: ${doshaCounts.vata} 分 (${ratios.vata})</li>
                <li class="pitta">Pitta: ${doshaCounts.pitta} 分 (${ratios.pitta})</li>
                <li class="kapha">Kapha: ${doshaCounts.kapha} 分 (${ratios.kapha})</li>
            </ul>
            <div class="button-container">
                <button id="restart-test" class="restart-button">重新测试</button>
            </div>
        `;
        resultContainer.style.display = "block"; // 显示结果容器

        // 动态将结果添加到表单
        const appendHiddenField = (name, value) => {
            let field = form.querySelector(`input[name="${name}"]`);
            if (!field) {
                field = document.createElement("input");
                field.type = "hidden";
                field.name = name;
                form.appendChild(field);
            }
            field.value = value;
        };

        appendHiddenField("dosha_vata", doshaCounts.vata);
        appendHiddenField("dosha_pitta", doshaCounts.pitta);
        appendHiddenField("dosha_kapha", doshaCounts.kapha);
        appendHiddenField("ratio_vata", ratios.vata);
        appendHiddenField("ratio_pitta", ratios.pitta);
        appendHiddenField("ratio_kapha", ratios.kapha);

        // 使用标准表单提交
        form.submit();
    });
});
