define("jira/dialog/screenshot-window",["jira/dialog/dialog","jira/ajs/layer/inline-layer","jquery"],function(e,r,i){return function(n){this.$trigger=i(n.trigger),i(document).delegate(n.trigger,"click",function(n){n.preventDefault(),e.current&&e.current.hide(),r.current&&r.current.hide(),window.open(i(this).attr("href")+"&decorator=popup","screenshot","width=800,height=700,scrollbars=yes,status=yes")})}}),AJS.namespace("jira.app.attachments.screenshot.ScreenshotWindow",null,require("jira/dialog/screenshot-window")),AJS.namespace("JIRA.ScreenshotDialog",null,require("jira/dialog/screenshot-window"));