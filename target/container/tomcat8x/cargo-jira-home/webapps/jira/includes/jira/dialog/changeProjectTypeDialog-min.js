define("jira/project/admin/change-project-type-dialog",["jira/util/formatter","jquery","underscore","jira/analytics","jira/message","jira/ajs/select/single-select","wrm/context-path"],function(e,t,o,n,a,r,c){"use strict";function p(e){return t.ajax({url:c()+"/rest/internal/2/projects/"+e+"/changetypedata",dataType:"json",contentType:"application/json",type:"GET"})}function i(r){var p=t(".project-type-select",r.dialogBody),i=p.val()[0],s=o.findWhere(r.projectTypes,{key:i});t(".dialog-change-button",r.dialogBody).attr("disabled","disabled"),t(t.ajax({url:c()+"/rest/api/2/project/"+r.projectId+"/type/"+i,dataType:"json",contentType:"application/json",type:"PUT"}).done(function(){r.changeProjectTypeDialog.hide(),r.onProjectTypeChanged&&r.onProjectTypeChanged(r.trigger,s),a.showSuccessMsg(JIRA.Templates.project.ChangeType.successMsg({projectName:r.projectName,projectTypeName:s.formattedKey})),n.send({name:"administration.projecttype.change",properties:{projectId:r.projectId,sourceProjectType:d(r.sourceProjectType),destinationProjectType:d(i)}})}).fail(function(){t(".aui-dialog2-content",r.dialogBody).prepend(aui.message.error({content:e.I18n.getText("admin.projects.change.project.type.error",'<a href="https://support.atlassian.com/">',"</a>")}))})).throbber({target:t(".throbber",r.dialogBody)})}function d(e){return e&&e.replace("_","")}function s(e,t,o){e==t?o.find(".dialog-change-button").attr("disabled","disabled"):o.find(".dialog-change-button").removeAttr("disabled")}function l(o){var n=t(JIRA.Templates.project.ChangeType.changeProjectTypeDialog({projectId:o.projectId})),a=AJS.dialog2(n);a.on("show",function(){t(".aui-dialog2-content",n).html(JIRA.Templates.project.ChangeType.dialogSpinner()),t(".dialog-spinner",n).spin(),t(".dialog-change-button",n).unbind("click").addClass("hidden")}),t(o.trigger).click(function(c){c.preventDefault(),a.show(),p(o.projectId).done(function(e){n.find(".aui-dialog2-content").html(JIRA.Templates.project.ChangeType.changeProjectTypeForm(e)),new r({element:t(".project-type-select",n),revertOnInvalid:!0,width:165}),n.find(".dialog-change-button").removeClass("hidden"),s(t(".project-type-select",n).val(),e.project.projectTypeKey,n);var c={dialogBody:n,changeProjectTypeDialog:a,projectName:e.project.name,projectTypes:e.projectTypes,trigger:o.trigger,projectId:o.projectId,onProjectTypeChanged:o.onProjectTypeChanged,sourceProjectType:e.project.projectTypeKey};t(".dialog-change-button",n).click(function(e){e.preventDefault(),i(c)}),t(".change-project-type-form",n).on("submit",function(e){e.preventDefault(),i(c)}),t(".project-type-select",n).on("change",function(o){s(t(this).val(),e.project.projectTypeKey,n)})}).fail(function(){t(".aui-dialog2-content",n).html(aui.message.error({content:e.I18n.getText("admin.projects.change.project.type.data.error",'<a href="https://support.atlassian.com/">',"</a>")}))})}),t(".dialog-close-button",n).click(function(e){e.preventDefault(),a.hide()})}return function(e){l(e)}});