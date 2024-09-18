// ==UserScript==
// @name         移除拼多多广告
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  移除拼多多广告
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
        采购管理:
            '//div[@class="nav-item-group"]/div/span[text()="采购管理"]/../..',
        品牌管理:
            '//div[@class="nav-item-group"]/div/span[text()="品牌管理"]/../..',
        跨境买菜: '//div[text()="跨境/买菜"]/../..',
        横幅: '//div[@id="mms-main-safe-content"]',
        灰层: '//div[@id="mms-header__mask"]',
    };

    const fullScreenAd = {
        全屏广告: '//div[@data-testid="beast-core-modal"]',
        全屏灰层: '//div[@data-testid="beast-core-modal-mask"]',
    };

    const texts = [
        "上门安装",
        "机会商品",
        "供货管理",
        "勋章馆",
        "能力认证",
        "平台招标",
        "多多直播",
        "退店",
        "安全风险",
        "直播推广",
        "明星店铺",
        "订单开票",
        "爆款竞价",
        "全店托管",
        "高价商品",
        "品牌权益",
        "同款竞价",
        "一键降成本",
        "好价拿流量",
        "新品免费起量",
    ];

    function removeAds() {
        try {
            // 替换全屏广告
            for (const key in fullScreenAd) {
                const elements = findElements(fullScreenAd[key]);
                for (const e of elements) {
                    console.log(`正在替换广告元素 "${key}"`);
                    if (e && document.contains(e)) {
                        e.style.display = "none";
                    }
                }
            }
            document.body.style.overflow = ""; // 重置 body 的 overflow 样式

            // 替换元素广告
            for (const key in lc) {
                const element = findElement(lc[key]);
                if (element && document.contains(element)) {
                    console.log(`正在替换广告元素 "${key}"`);
                    element.style.display = "none";
                }
            }

            // 替换无用按钮
            for (const text of texts) {
                const element = findElement(
                    `//span[@class="nav-item-text" and text()="${text}"]/../..`
                );
                if (element && document.contains(element)) {
                    console.log(`正在替换广告元素包含文本 "${text}"`);
                    const parent = element.parentNode;
                    if (parent) {
                        element.style.display = "none";
                        parent.style.setProperty("height", "auto", "important");
                    }
                }
            }

            // 设置格式
            const elements = findElements(`//li[@class="nav-item"]`);
            for (const e of elements) {
                e.style.setProperty("margin-right", "6px", "important");
            }
        } catch (error) {
            console.error("替换广告时发生错误：", error);
        }
    }

    let debounceTimer; // 定时器 ID 用于防抖

    // 延迟广告移除的函数（防抖动）
    function removeAdsLater() {
        if (debounceTimer) {
            clearTimeout(debounceTimer); // 清除前一次的定时器
        }
        debounceTimer = setTimeout(() => {
            removeAds();
        }, 100);
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
