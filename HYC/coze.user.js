// ==UserScript==
// @name         优化Coze界面
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  优化Coze界面
// @author       You
// @include      https://www.coze.com/space/*/bot/*
// @updateURL    https://raw.githubusercontent.com/iDragonfly2050/iDragonfly-File/master/HYC/coze.user.js
// @downloadURL  https://raw.githubusercontent.com/iDragonfly2050/iDragonfly-File/master/HYC/coze.user.js
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    const lc = {
        横幅1: '//*[@id="root"]/div/div/div/div/div/div/div/div[1]',
        横幅2: '//*[@id="root"]/div/div/div/div/div/div/div/div[2]/div[1]/div[2]/div/div[1]',
        左边: '//*[@id="root"]/div/div/div/div/div/div/div/div[2]/div[1]/div[1]',
        底部: '//*[@id="root"]/div/div/div/div/div/div/div/div[2]/div[1]/div[2]/div/div[5]/div[2]/div/div[2]',
        // 建议列表: '//div[@data-testid="chat-area.suggestion-list"]',
    };

    const css_lc = {
        父元素: '//*[@id="root"]/div/div/div/div/div/div/div/div[2]/div[1]',
    };

    function removeAds() {
        try {
            // 替换元素广告
            for (const key in lc) {
                const element = findElement(lc[key]);
                if (
                    element &&
                    document.contains(element) &&
                    element.style.display !== "none"
                ) {
                    console.log(`正在替换广告元素 "${key}"`);
                    element.style.display = "none";
                }
            }

            const element = findElement(css_lc.父元素);
            element.style.display = "flex";
            element.style.justifyContent = "center";
            element.style.alignItems = "center";
            element.style.marginLeft = "15%";
            element.style.marginRight = "15%";
        } catch (error) {
            console.error("替换广告时发生错误：", error);
        }
    }

    // 在页面加载完成时运行广告移除
    window.addEventListener("load", removeAds);

    // 使用 MutationObserver 持续监听页面变化并移除广告
    const observer = new MutationObserver(removeAds);

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();

// 封装 XPath 查询函数
function getXPathResult(xpath, context, resultType) {
    return document.evaluate(
        xpath,
        context || document,
        null,
        resultType || XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    );
}

// 获取单个节点
function findElement(xpath, context) {
    return getXPathResult(xpath, context, XPathResult.FIRST_ORDERED_NODE_TYPE)
        .singleNodeValue;
}

// 获取多个节点并返回数组
function findElements(xpath, context) {
    const snapshot = getXPathResult(
        xpath,
        context,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE
    );

    const elements = [];
    for (let i = 0; i < snapshot.snapshotLength; i++) {
        elements.push(snapshot.snapshotItem(i));
    }

    return elements; // 返回数组
}
