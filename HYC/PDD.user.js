// ==UserScript==
// @name         Remove PDD Ads
// @namespace    http://tampermonkey.net/
// @version      1.72
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
        "直播推广",
        "明星店铺",
        "爆款竞价",
        "全店托管",
    ];

    const groups = '//ul[@class="nav-item-group-content"]';

    // 移除广告元素的函数
    function removeAds() {
        // 移除全屏广告
        for (const key in fullScreenAd) {
            const element = findElement(lc[key]);
            if (element) {
                element.remove(); // 移除元素
                console.log(`广告元素 "${key}" 已被移除`);
            }
        }
        document.body.style.overflow = "";

        // 移除元素广告
        for (const key in lc) {
            const element = findElement(lc[key]);
            if (element) {
                element.remove(); // 移除元素
                console.log(`广告元素 "${key}" 已被移除`);
            }
        }

        // 移除无用按钮
        for (const text of texts) {
            const element = findElement(
                `//span[@class="nav-item-text" and text()="${text}"]/../..`
            );
            if (element) {
                element.remove(); // 移除元素
                console.log(`广告元素包含文本 "${text}" 已被移除`);
            }
        }

        // 获取多个元素并修改样式
        let elements = findElements(groups);
        elements.forEach((element, index) => {
            element.style.height = "auto";
            console.log(`元素 "group" 索引 ${index} 的高度已设置为 auto`);
        });
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
