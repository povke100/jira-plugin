define("jira/ajs/select/security-level-select",["jira/util/key-code","jira/util/formatter","jira/util/strings","jira/analytics","jira/issue","jira/featureflags/feature-manager","jira/ajs/select/security/default-comment-security-level-control","jira/ajs/select/security/select-adapter","jira/ajs/select/dropdown-select","jquery"],function(e,t,l,i,n,a,r,s,u,c){"use strict";return u.extend({$securityLevelDiv:null,$commentLevelSelect:null,$triggerIcon:null,$currentLevelSpan:null,defaultEnabled:!1,applyDefault:!1,loadDefault:!1,_defaultSecurityLevelControl:null,_createFurniture:function(){AJS.populateParameters(),this._super()},init:function(e){this._super(e);var t=c(e);if(this.$securityLevelDiv=t.parent(),this.$triggerIcon=this.$securityLevelDiv.find(".security-level-drop-icon"),this.$currentLevelSpan=this.$securityLevelDiv.find(".current-level"),this.defaultEnabled=!!t.data("enable-default"),this.applyDefault=!!t.data("apply-default"),this.model.$element.bind("change",function(e,t){this._updateView(t)}.bind(this)),this.defaultEnabled&&a.isFeatureEnabled("viewissue.comment.defaultlevel")){var l=this.$securityLevelDiv.find(".default-comment-level"),i=this.$securityLevelDiv.next(".security-level-inline-error");this._defaultSecurityLevelControl=new r(l,i,new s(this.model)),this._defaultSecurityLevelControl.loadAndApplyDefault(this.applyDefault),this.model.$element.bind("change",function(e,t){this._defaultSecurityLevelControl.flushViewWithNewControl(t)}.bind(this))}},_updateView:function(e){if(""==e.value()){this.$triggerIcon.removeClass("aui-iconfont-locked").addClass("aui-iconfont-unlocked");var l=t.I18n.getText("security.level.viewable.by.all");this.$triggerIcon.text(t.I18n.getText("security.level.explanation",l)),this.$currentLevelSpan.text(l)}else{this.$triggerIcon.removeClass("aui-iconfont-unlocked").addClass("aui-iconfont-locked");var i=c("<div/>").text(e.label()).html(),n=t.format(t.I18n.getText("security.level.restricted.to"),i),a=c("<div/>").html(n).text();this.$triggerIcon.text(t.I18n.getText("security.level.explanation",a)),this.$currentLevelSpan.html(n)}},_handleDownKey:function(t){t.keyCode!==e.DOWN||this.dropdownController.isVisible()||(t.preventDefault(),t.stopPropagation(),this.show())},_selectionHandler:function(e){this._super(e),this._defaultSecurityLevelControl&&this._defaultSecurityLevelControl.selectionChanged(),this._sendSelectionChangedAnalytics(e.data("descriptor").value())},_sendSelectionChangedAnalytics:function(e){var t=null!=this._defaultSecurityLevelControl,a=t?this._defaultSecurityLevelControl.defaultLevelModel.getCurrentDefault().level:"";i.send({name:"jira.issue.comment.level.changed",data:{defaultWasSelected:e===a,issueIdHash:l.hashCode(n.getIssueId().toString()),defaultEnabled:t}})},_events:{trigger:{keydown:function(e){this._handleDownKey(e)},keypress:function(e){this._handleDownKey(e)}}}})}),AJS.namespace("AJS.SecurityLevel",null,require("jira/ajs/select/security-level-select")),AJS.namespace("AJS.SecurityLevelSelect",null,require("jira/ajs/select/security-level-select"));