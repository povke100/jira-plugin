define("jira/admin/application/defaults/ApplicationView",["marionette"],function(t){"use strict";return t.ItemView.extend({className:"checkbox",template:JIRA.Templates.ApplicationSelector.applicationCheckbox,ui:{setting:".checkbox"},triggers:{"change @ui.setting":"setting:changed"},isSelected:function(){return this.ui.setting.is(":checked")},serializeData:function(){var t=this.model.toJSON();return t.selected=t.selectedByDefault,{application:t,showInfoMessages:!1}}})}),define("jira/admin/application/defaults/ApplicationListView",["jquery","marionette","jira/admin/application/defaults/ApplicationView"],function(t,e,i){"use strict";var n=e.ItemView.extend({template:JIRA.Templates.Admin.ApplicationAccessDefaults.listEmpty});return e.CompositeView.extend({itemView:i,itemViewContainer:".application-picker-applications",emptyView:n,template:JIRA.Templates.Admin.ApplicationAccessDefaults.list,commit:function(){return this.$el.find(".application.checkbox").each(function(e,i){var n=t(i),a=n.data("key"),s=n.is(":checked"),o=this.collection.get({id:a});o.get("selectedByDefault")!=s&&o.set("selectedByDefault",s)}.bind(this)),this.collection.updateDefaults()},onRender:function(){this.unwrapTemplate()}})}),define("jira/admin/application/defaults/DialogView",["jquery","underscore","marionette"],function(t,e,i){"use strict";var n=i.ItemView.extend({template:JIRA.Templates.Admin.ApplicationAccessDefaults.showError}),a=i.ItemView.extend({serializeData:function(){return{applications:this.options.applications}}});return i.Layout.extend({ui:{submit:".app-role-defaults-dialog-submit-button",close:".app-role-defaults-dialog-close-button",iconWait:".aui-dialog2-footer .aui-icon-wait",webPanels:".app-role-defaults-web-panels"},regions:{errors:".app-role-defaults-errors",warnings:".app-role-defaults-warnings",contents:".app-role-defaults-contents"},events:{"click @ui.submit":"formSubmit","click @ui.close":"close"},template:JIRA.Templates.Admin.ApplicationAccessDefaults.dialog,onRender:function(){this.unwrapTemplate(),this.dialog=AJS.dialog2(this.$el),this.dialog.on("hide",this.close.bind(this))},show:function(){this.dialog.show()},disable:function(){this.$(":input").prop("disabled",!0)},enable:function(){this.$(":input").prop("disabled",!1)},showContents:function(t){this.contents.show(t),this.ui.webPanels.html(this.options.webPanels),this.showWarning(),this.trigger("showContents"),this.listenTo(t,"itemview:setting:changed",this.showWarning)},showWarning:function(){this.warnings.reset();var t=this._applicationsWithoutSeats(),e=this._applicationsWithoutDefaultGroup();t.length>0?this.warnings.show(new a({template:JIRA.Templates.Admin.ApplicationAccessDefaults.noSeatsWarning,applications:t})):e.length>0&&this.warnings.show(new a({template:JIRA.Templates.Admin.ApplicationAccessDefaults.noDefaultGroupWarning,applications:e}))},_selectedItems:function(){return this.contents.currentView.children.filter(function(t){return t.isSelected()})},_applicationsWithoutDefaultGroup:function(){return this._selectedItems().filter(function(t){return e.isEmpty(t.model.get("defaultGroups"))}).map(function(t){return t.model.attributes})},_applicationsWithoutSeats:function(){return this._selectedItems().filter(function(t){return 0==t.model.get("remainingSeats")&&!t.model.get("hasUnlimitedSeats")}).map(function(t){return t.model.attributes})},formSubmit:function(){return this.errors.reset(),this.disable(),this.ui.iconWait.removeClass("hidden"),this.contents.currentView.commit().done(function(){this.close()}.bind(this)).fail(function(){this.errors.show(new n),this.enable(),this.ui.iconWait.addClass("hidden")}.bind(this))},onClose:function(){this.dialog.isVisible()&&this.dialog.remove()}})}),define("jira/admin/application/defaults",["jquery","marionette","jira/admin/application/defaults/DialogView","jira/admin/application/defaults/ApplicationListView","jira/admin/application/defaults/api","jira/util/logger","wrm/data"],function(t,e,i,n,a,s,o){"use strict";return e.Controller.extend({initialize:function(e){var l=o.claim("com.atlassian.jira.web.action.admin.application-access:defapp-selector-webpanels");t(".app-role-defaults-show-button").on("click",function(){var t=new i({collection:e,webPanels:l});t.on("showContents",function(){a.trigger(a.EVENT_ON_SHOW,t)}),t.render(),t.show(),t.disable(),e.whenFetched().then(function(){t.enable(),t.showContents(new n({collection:e})),s.trace("jira.admin.application.defaultsdialog.enabled")})}.bind(this))}})});