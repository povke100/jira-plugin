AJS.test.require(["jira.webresources:application-roles"],function(){require(["underscore","backbone","jquery"],function(e,t,o){function i(e){return new(t.Collection.extend({_faulty:!1,model:t.Model.extend({defaults:{name:null,groups:null,defaultGroups:null,selectedByDefault:!1,_faulty:!1},idAttribute:"key",update:function(){return this.get("_faulty")?(new o.Deferred).reject(this.toJSON()):(new o.Deferred).resolve(this.toJSON())}}),updateDefaults:function(){return this._faulty?(new o.Deferred).reject(this.toJSON()):(new o.Deferred).resolve(this.toJSON())}}))(e)}module("CompositeView Tests",{setup:function(){this.context=AJS.test.mockableModuleContext()}}),test("CompositeView.commit resolves after save",function(){var e=this.context.require("jira/admin/application/defaults/ApplicationListView"),t=i([{key:"role1"},{key:"role2"}]),o=new e({collection:t});o.render(),o.commit().then(function(){ok("Commit resolved after save")})}),test("CompositeView.commit resolves empty list",function(){var e=this.context.require("jira/admin/application/defaults/ApplicationListView"),t=i([]),o=new e({collection:t});o.render(),o.commit().then(function(){ok("Commit resolved after empty collection")})}),test("CompositeView.commit fails after unsuccessful save",function(){var e=this.context.require("jira/admin/application/defaults/ApplicationListView"),t=i([{key:"role1"},{key:"role2"}]);t._faulty=!0;var o=new e({collection:t});o.render(),o.commit().fail(function(){ok("Commit rejected after failed save")})})})}),AJS.test.require(["jira.webresources:application-roles"],function(){require(["underscore","backbone","jquery","jira/admin/application/defaults/DialogView"],function(e,t,o,i){function n(e){return this.context.require("jira/admin/application/defaults/ApplicationListView").extend({commit:function(){return e}})}function l(e){return new(t.Collection.extend({model:t.Model.extend({defaults:{name:null,groups:null,defaultGroups:null,selectedByDefault:!1},idAttribute:"key"})}))(e)}module("DialogView Tests",{setup:function(){this.context=AJS.test.mockableModuleContext(),this.applicationCollection=l([{key:"roleOne"},{key:"roleTwo"},{key:"roleThree",defaultGroups:["defaultGroup"]}]),this.createDialogViewAndRenderIt=function(e,t){var o=new i({collection:e,webPanels:t||""});return o.warnings.show=sinon.spy(),o.render(),o}},teardown:function(){}}),test("Resolved commit should not display",function(){var e=n.call(this,(new o.Deferred).resolve().promise()),t=l([]),a=new i({collection:t});a.render(),a.showContents(new e({collection:this.applicationCollection})),a.formSubmit().done(function(){ok("Form submit succeeded"),strictEqual(a.errors,void 0,"Errors are not visible")})}),test("Failed commit should display error",function(){var e=n.call(this,(new o.Deferred).reject().promise(),[]),t=l([]),a=new i({collection:t});a.render(),a.showContents(new e({collection:this.applicationCollection})),equal(a.errors.$el,null,"Error region not present"),a.formSubmit().fail(function(){ok("Form submit failed"),equal(a.errors.$el.is(":not(:empty)"),!0,"Errors are visible")})}),test("Warning should open when one application doesn't have a default group",function(){var e=n.call(this);this.applicationCollection.get("roleOne").set("selectedByDefault",!0);var t=this.createDialogViewAndRenderIt(this.applicationCollection);t.showContents(new e({collection:this.applicationCollection})),ok(t.warnings.show.calledOnce)}),test("Warning should open when both applications don't have a default group",function(){var e=n.call(this);this.applicationCollection.get("roleOne").set("selectedByDefault",!0),this.applicationCollection.get("roleTwo").set("selectedByDefault",!0);var t=this.createDialogViewAndRenderIt(this.applicationCollection);t.showContents(new e({collection:this.applicationCollection})),ok(t.warnings.show.calledOnce)}),test("Warning should open when at least one application doesn't have a default group",function(){var e=n.call(this,null,["roleOne","roleTwo","roleThree"]);this.applicationCollection.get("roleOne").set("selectedByDefault",!0),this.applicationCollection.get("roleTwo").set("selectedByDefault",!0),this.applicationCollection.get("roleThree").set("selectedByDefault",!0);var t=this.createDialogViewAndRenderIt(this.applicationCollection);t.showContents(new e({collection:this.applicationCollection})),ok(t.warnings.show.calledOnce)}),test("Warning shouldn't open when all selected applications have a default group",function(){var e=n.call(this);this.applicationCollection.get("roleThree").set("selectedByDefault",!0);var t=this.createDialogViewAndRenderIt(this.applicationCollection);t.showContents(new e({collection:this.applicationCollection})),ok(!t.warnings.show.called)}),test("Dialog should render passed webPanels on showContents",function(){var e=n.call(this),t=this.createDialogViewAndRenderIt(this.applicationCollection,"fusion <b>awesome</b> content");t.showContents(new e({collection:this.applicationCollection})),o("#qunit-fixture").append(t.$el),equal(o(".app-role-defaults-web-panels").html(),"fusion <b>awesome</b> content")}),test("Dialog should trigger showContents event on showContents",function(){var e=n.call(this),t=this.createDialogViewAndRenderIt(this.applicationCollection);t.dialog={showContents:sinon.spy()};var o=sinon.spy();t.on("showContents",o),t.showContents(new e({collection:this.applicationCollection})),ok(o.called)})})}),AJS.test.require(["jira.webresources:application-roles"],function(){require(["underscore","backbone","jquery"],function(e,t,o){module("Defaults init tests asdasd",{setup:function(){this.context=AJS.test.mockableModuleContext(),this.dialogTrigger=o("<a href='#' class='app-role-defaults-show-button'>Dialog trigger</a>"),o("#qunit-fixture").append(this.dialogTrigger)},teardown:function(){},initDialog:function(){var e={};this.context.mock("jira/admin/application/defaults/DialogView",t.View.extend({initialize:function(){e.currentDialog=this},show:function(){},disable:function(){}}));var i=this.context.require("jira/admin/application/defaults");return e.defaults=new i({whenFetched:function(){return(new o.Deferred).promise()}}),e}}),test("Init should use provided webpanels to init pluginpoint",function(){var e=sinon.stub(WRM.data,"claim");e.withArgs("com.atlassian.jira.web.action.admin.application-access:defapp-selector-webpanels").returns("web-panels-content");var t=this.initDialog();this.dialogTrigger.click(),equal(t.currentDialog.options.webPanels,"web-panels-content"),e.restore()}),test("Should emit API event on dialog show event",function(){var e=require("jira/admin/application/defaults/api");this.context.mock("jira/admin/application/defaults/api",e);var t=this.initDialog(),o=sinon.spy();e.on(e.EVENT_ON_SHOW,o),this.dialogTrigger.click(),t.currentDialog.trigger("showContents"),ok(o.called)})})});