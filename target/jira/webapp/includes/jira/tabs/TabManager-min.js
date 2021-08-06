define("jira/tabs/tab-manager",["jira/util/events","jira/util/events/types","jira/util/events/reasons","jira/common/page","jira/tabs/tab-manager/util","jquery","exports"],function(a,t,e,r,n,i,o){o.navigationTabs=function(){var o,s,l,c,d,u,b,f={},m={filterTabSelector:r.mainContentCssSelector,tabsSelector:"ul.vertical.tabs li",tabsLinksSelector:"ul.vertical.tabs li a",requestParams:"decorator=none&contentOnly=true",stateRequestParams:"decorator=none&contentOnly=true&updateState=true",activeTabClass:"active",loadedTabClass:"loaded",tabParam:"filterView"},h=function(a){f[a]&&f[a]instanceof Array&&i(f[a]).each(function(){this()})},g=function(r,n,o){var u=i(r).find("a"),f=b.getTabParamFromUrl(o),g=function(r){s.empty(),s.html(r),n||b.saveHistoryItem(b.constructCompleteUrl(u.attr("href"))),h(u.attr("id")),l.addClass(m.loadedTabClass),a.trigger(t.NEW_CONTENT_ADDED,[s,e.tabUpdated])};b.getTabParamFromUrl(l.find("a").attr("href"))!==f&&o&&(l.get(0)!==r||o)&&(l&&l.length&&(c=l.removeClass(m.activeTabClass).removeClass(m.loadedTabClass)),l=i(r).addClass("active"),d&&d.get(0)&&4!==d.get(0).readyState&&d.get(0).abort&&(i.isFunction(d.hideThrobber)&&d.hideThrobber(),d.get(0).abort()),s.html(i("<h2 />").text(u.attr("title"))),d=i(i.ajax({method:"get",dataType:"html",url:o,data:m.requestParams,success:g}).fail(function(a){if(401===a.status)window.location.reload();else if("abort"!==a.statusText){var t=a.responseText&&a.responseText.match(/<body[^>]*>([\S\s]*)<\/body[^>]*>/);t&&t.length>0&&s.html('<div style="padding:0 20px">'+t[1]+"</div>")}})).throbber({target:r}))},T=function(a){var t=i([]);b.getTabParamFromUrl(l.find("a").attr("href"))!==a&&(a&&""!==a?t=v(a):""===a&&(t=o),t&&g(t,!0,i(t).find("a").attr("href")))},v=function(a){var t,e=m.getTabRegEx,r=a.match(e);return i(u).each(function(){var a=i(this).find("a").attr("href").match(e);r&&r.length>0&&a[0]===r[0]&&(t=this)}),t};return window.addEventListener("popstate",function(){b&&T(b.getTabParamFromUrl(window.location.href))}),{getActiveTab:function(){return l},getProjectTab:function(){return s},addLoadEvent:function(a,t){f[a]=f[a]||[],i.isFunction(t)&&f[a].push(t)},_getTabManagerUtil:function(){return b},_getNavigateToTabFunc:function(){return g},init:function(a){i.extend(m,a),m.getTabRegEx=new RegExp(m.tabParam+"=[^&]*"),b=new n(window.location.href,m.tabParam,m.getTabRegEx),s=i(m.filterTabSelector),u=i(m.tabsSelector).each(function(){i(this).hasClass(m.activeTabClass)&&(l=i(this),l.addClass(m.loadedTabClass),o=l)});var t=v(window.location.href);if(!window.location.href.match(m.getTabRegEx)&&o){var e=i(o).find("a").attr("href");b.replaceHistoryItem(b.updateInitialUrl(e))}var r=b.getTabParamFromUrl(window.location.href);if(r&&t&&l&&b.getTabParamFromUrl(l.find("a").attr("href"))!==r){var c=i(t).find("a").attr("href");g(i(t),!0,c)}i(m.tabsLinksSelector).click(function(a){var t=i(this).attr("href"),e=v(t);e&&(g(e,!1,t),a.preventDefault())}),a&&a.customInit&&a.customInit()}}}()}),AJS.namespace("jira.app.manageShared",null,require("jira/tabs/tab-manager")),AJS.namespace("JIRA.TabManager",null,require("jira/tabs/tab-manager"));