// ==UserScript==
// @name         Remove PDD Ads
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动移除拼多多广告
// @author       You
// @include      https://*.pinduoduo.com/*
// @updateURL    https://github.com/iDragonfly2050/iDragonfly-File/blob/master/HYC/PDD.user.js
// @downloadURL  https://github.com/iDragonfly2050/iDragonfly-File/blob/master/HYC/PDD.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 定义一个函数来移除广告，更是地
    function removeAds() {
        // 根据广告的 CSS 类、ID 或标签名进行选择并移除
        let adElements = document.querySelectorAll('.ad, .advertisement, .ads, [id*="ad"]');
        adElements.forEach(el => el.remove());

        console.log('广告元素已被移除');
    }

    // 在页面加载完成时运行
    window.addEventListener('load', removeAds);

    // 使用 MutationObserver 持续监听页面变化并移除广告
    const observer = new MutationObserver(removeAds);

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();
