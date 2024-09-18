// ==UserScript==
// @name         Remove PDD Ads
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  自动移除拼多多广告
// @author       You
// @include      https://*.pinduoduo.com/*
// @updateURL    https://raw.githubusercontent.com/iDragonfly2050/iDragonfly-File/master/HYC/PDD.user.js
// @downloadURL  https://raw.githubusercontent.com/iDragonfly2050/iDragonfly-File/master/HYC/PDD.user.js
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    const lc = {
        TEMU: '//div[@class="nav-item-group"]/div/span[text()="TEMU"]/../..',
        流量运营:
            '//div[@class="nav-item-group"]/div/span[text()="流量运营"]/../..',
        采购管理:
            '//div[@class="nav-item-group"]/div/span[text()="采购管理"]/../..',
        品牌管理:
            '//div[@class="nav-item-group"]/div/span[text()="品牌管理"]/../..',
        跨境买菜: '//div[text()="跨境/买菜"]/../..',
        横幅: '//div[@id="mms-main-safe-content"]',
    };

    // 移除广告元素的函数
    function removeAds() {
        // 遍历 lc 中的每一个 XPath 表达式
        for (const key in lc) {
            const element = findElement(lc[key]);
            element.remove(); // 移除元素
        }
        console.log("广告元素已被移除");
    }

    // 在页面加载完成时运行
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

// 获取多个节点
function findElements(xpath, context) {
    return getXPathResult(
        xpath,
        context,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE
    );
}
