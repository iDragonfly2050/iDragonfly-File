// ==UserScript==
// @name         移除拼多多广告
// @namespace    http://tampermonkey.net/
// @version      3.7
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
        商品列表轮动广告:
            '//div[@class="goods-list"]/div/div[contains(@class, "top_notice_new_notice-bar-carousel")]',
        新消息: '//section[contains(@class, "NewMsgBox_important-wrapper")]',
    };

    const fullScreenAd = {
        全屏广告: '//div[@data-testid="beast-core-modal"]',
        全屏灰层: '//div[@data-testid="beast-core-modal-mask"]',
    };

    const fullScreenAdTags = {
        官方打单:
            ".//img[contains(@src, 'https://funimg.pddpic.com/msfe/afc888f4-dccd-4aef-9787-5cfaf4c498f8.png')]",
        自定义LOGO:
            ".//img[contains(@src, 'https://commimg.pddpic.com/mms_static/2020-01-16/82ce4f6c-9ce6-466c-aadb-28a3f483b8b7.png')]",
        百亿减免提现门槛: ".//span[contains(text(), '商家货款账户提现门槛')]",
        全店报名: './/span[contains(text(), "全店报名")]',
        抢单广告:
            ".//img[contains(@src, 'https://pfile.pddpic.com/oms_file/2024-07-16/da78e9397075426ab3d35b53e8f3aaa5.png')]",
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
        //流量运营
        "高价商品",
        "品牌权益",
        "同款竞价",
        "一键降成本",
        "好价拿流量",
        "新品免费起量",
    ];

    function removeAds() {
        try {
            for (const tag in fullScreenAdTags) {
                const fullAd = findElement(fullScreenAd["全屏广告"]);
                if (fullAd && fullAd.style.display !== "none") {
                    if (findElement(fullScreenAdTags[tag], fullAd)) {
                        console.log(`正在替换全屏广告元素 "${tag}"`);
                        removeFullScreenAd();
                    }
                } else {
                    // console.log(`没有找到全屏广告`);
                }
            }

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

            // 替换无用按钮
            for (const text of texts) {
                const element = findElement(
                    `//span[@class="nav-item-text" and text()="${text}"]/../..`
                );
                if (
                    element &&
                    document.contains(element) &&
                    element.style.display !== "none"
                ) {
                    const parent = element.parentNode;
                    if (parent) {
                        console.log(`正在替换广告元素包含文本 "${text}"`);
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

    // 移除全屏广告
    function removeFullScreenAd() {
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
