define("jira/ajs/select/single-select",["jira/util/formatter","jira/ajs/layer/layer-constants","jira/ajs/select/queryable-dropdown-select","jira/ajs/select/select-helper","jira/ajs/select/select-model","jira/ajs/select/suggestions/select-suggest-handler","jira/ajs/layer/inline-layer-factory","jira/ajs/list/list","jira/ajs/list/item-descriptor","jira/util/navigator","jquery"],function(e,t,i,s,n,o,r,a,l,d,h){"use strict";return i.extend({init:function(e){return this._setOptions(e)===this.INVALID?this.INVALID:(this._createSelectModel(),this.options.disabled?(this._createFurniture(!0),this):(h.extend(this,s),this._createFurniture(),this._createSuggestionsController(),this._createDropdownController(),this._createListController(),this._assignEventsToFurniture(),this._setInitState(),this.options.width&&this.setFieldWidth(this.options.width),this.$overlabel&&this.$overlabel.overlabel(this.$field),this.options.uneditable&&this.disable(),void this.model.$element.addClass("aui-ss-select").trigger("initialized",[this])))},disable:function(){this.$container.find(".drop-menu").addClass("hidden"),this.$container.find("input").attr("disabled","disabled"),this.$container.find("input").attr("aria-disabled","true"),this._super()},enable:function(){this.$container.find(".drop-menu").removeClass("hidden"),this.$container.find("input").removeAttr("disabled"),this.$container.find("input").removeAttr("aria-disabled"),this._super()},_setInitState:function(){this.options.editValue?(this._setEditingMode(),this.$field.val(this.options.editValue)):this.getSelectedDescriptor()?this.setSelection(this.getSelectedDescriptor()):(this._setEditingMode(),this.options.inputText&&this.$field.val(this.options.inputText))},_createSelectModel:function(){var e=this.options.model?this.options.model:n;this.model=new e({element:this.options.element,removeOnUnSelect:this.options.removeOnUnSelect})},_createDropdownController:function(){this.dropdownController=r.createInlineLayers({alignment:t.LEFT,offsetTarget:this.$field,content:h(".aui-list",this.$container),setMaxHeightToWindow:this.options.setMaxHeightToWindow,minHeight:this.options.minHeight})},_createSuggestionsController:function(){var e=this.options.suggestionsHandler?this.options.suggestionsHandler:o;this.suggestionsHandler=new e(this.options,this.model)},_assignEventsToFurniture:function(){var e=this;this._super(),this.model.$element.bind("reset",function(){e.getSelectedDescriptor()&&e.setSelection(e.getSelectedDescriptor())}).bind("showSuggestions",function(t){e._handleDown(t)}).bind("hideSuggestions",function(){e.hideSuggestions()}).bind("set-selection-value",function(t,i){e._setDescriptorWithValue(i)})},setFieldWidth:function(e){this.$container.css({maxWidth:e}),this.$field.css({maxWidth:e})},_createListController:function(){var e=this;this.listController=new a({containerSelector:h(".aui-list",this.$container),groupSelector:"ul.aui-list-section",matchingStrategy:this.options.matchingStrategy,maxInlineResultsDisplayed:this.options.maxInlineResultsDisplayed,matchItemText:this.options.matchItemText,hasLinks:this.options.hasLinks,selectionHandler:function(t){var i=this.getFocused(),s=i.data("descriptor");return e.setSelection(s,!0,t),e.$field.select(),t.preventDefault(),!1}})},getSelectedDescriptor:function(){return this.model.getDisplayableSelectedDescriptors()[0]},getDisplayVal:function(e){return e[this.options.itemAttrDisplayed||"label"]()},_getDefaultOptions:function(){return h.extend(!0,this._super(),{errorMessage:e.I18n.getText("jira.ajax.autocomplete.error"),revertOnInvalid:!1,showDropdownButton:!0})},_createFurniture:function(e){var t=this.model.$element.attr("id");this.model.$element.data("aui-ss",!0),this.$container=this._render("container",this.model.id);var i=this.model.$element.data("container-class");if(i&&this.$container.addClass(i),e){var s=this.model.$element.val()&&this.model.$element.val()[0];s=s||"",this.model.$element.replaceWith(this._render("disableSelectField",t,s))}else{var n=this.model.getPlaceholder();this.$field=this._render("field",this.model.id,n).appendTo(this.$container),this.$label=h("label[for="+h.escapeSelector(this.model.id)+"]"),this.$label.length&&this.$label.attr("for",this.$field.attr("id")),n&&!this._placeholderSupported()&&(this.options.overlabel=n,this.$overlabel=this._render("overlabel").insertBefore(this.$field));var o=this._render("suggestionsContainer",this.model.id);this.suggestionsContainerId=o.attr("id"),this.$container.append(o),this.$field.attr("aria-controls",o.attr("id")),this.$container.insertBefore(this.model.$element),this.$dropDownIcon=this._render("dropdownAndLoadingIcon",this._hasDropdownButton()).appendTo(this.$container),this.$errorMessage=this._render("errorMessage")}},_placeholderSupported:function(){return!(d.isIE()&&d.majorVersion()<10)},getQueryVal:function(){return this.$container.hasClass("aui-ss-editing")?h.trim(this.$field.val()):""},_setSuggestions:function(e,t){e?(this._super(e,t),this.model.$element.trigger("suggestionsRefreshed",[this])):this.hideSuggestions()},_setEditingMode:function(){this.$container.addClass("aui-ss-editing").removeClass("aui-ss-has-entity-icon"),this.$field.css("paddingLeft")},_hasIcon:function(){var e,t=this.getSelectedDescriptor();if(t)return(e=t.icon())&&"none"!==e},_setReadOnlyMode:function(){this.$container.removeClass("aui-ss-editing"),this._hasIcon()&&(this.$container.addClass("aui-ss-has-entity-icon"),d.isIE()&&d.majorVersion()>8&&this.$container.append(this.$field.detach()))},submitForm:function(){this.suggestionsVisible||(this.handleFreeInput(),h(this.$field[0].form).submit())},selectValue:function(e){this.listController.selectValue(e)},setSelection:function(e,t,i){t=void 0===t||t,"string"==typeof e&&(e=new l({value:e,label:e})),this.removeFreeInputVal(),this.$field.val(e.fieldText()||this.getDisplayVal(e)),this.$field.trigger("change"),this.model.setSelected(e,t)&&this.hideErrorMessage(),this._hasIcon()&&(this.$entityIcon&&this.$entityIcon.remove(),this.$entityIcon=this._render("entityIcon",e.icon()).appendTo(this.$container)),this._setReadOnlyMode(),this.hideSuggestions(),this.lastSelection=e,this.model.$element.trigger("selected",[e,this,i])},clear:function(){this.$field.val(""),this.hideSuggestions(),this.clearSelection()},clearSelection:function(){var e=this;e._setEditingMode(),e.model.setAllUnSelected(),e.model.$element.trigger("unselect",[this])},_handleServerSuggestions:function(e){this.cleanUpModel(),this._super(e)},cleanUpModel:function(){this.options.ajaxOptions.query&&this.model.clearUnSelected()},onEdit:function(){this.getSelectedDescriptor()&&this.clearSelection(),this._super(),this.model.$element.trigger("query")},handleFreeInput:function(e){e=e||h.trim(this.$field.val()),this.options.revertOnInvalid&&!this.model.getDescriptor(e)?this.setSelection(this.lastSelection||""):this.$container.hasClass("aui-ss-editing")&&(this._setDescriptorWithValue(e)?this.hideErrorMessage():this.options.submitInputVal||this.showErrorMessage(e))},_setDescriptorWithValue:function(e){var t=this.model.getDescriptor(e);return!!t&&(this.setSelection(t),!0)},_handleCharacterInput:function(e){this._super(e),this.$container.hasClass("aui-ss-editing")&&this.updateFreeInputVal()},_deactivate:function(){this.handleFreeInput(),this.hideSuggestions()},keys:{Return:function(e){this.submitForm(),e.preventDefault()},Tab:function(){this.acceptFocusedSuggestion()}},_events:{field:{focus:function(){var e=this;window.setTimeout(function(){e.$field.is(":focus")&&e.$field.select()},0)},click:function(){this._handleCharacterInput(!0)}}},_renders:{label:function(e,t){return h("<label />").attr("for",t).attr("id",t+"-label").text(e).addClass("overlabel")},errorMessage:function(){return h('<div class="error" />')},entityIcon:function(e){var t=h('<img class="aui-ss-entity-icon" alt=""/>');return t.attr("src",e),t},field:function(e,t){var i=this._render("baseField").attr({class:"text aui-ss-field ajs-dirty-warning-exempt",id:e+"-field",type:"text"});return t&&i.attr("placeholder",t),i},disableSelectField:function(e,t){return h("<input type='text' class='text long-field' />").attr({value:t,name:e,id:e})},container:function(e){return h('<div class="aui-ss" />').toggleClass("ajax-ss",!!this.options.ajaxOptions).attr("id",e+"-single-select")},dropdownAndLoadingIcon:function(e){return h('<span class="icon aui-ss-icon noloading"><span>More</span></span>').toggleClass("drop-menu",!!e)}}})}),AJS.namespace("AJS.SingleSelect",null,require("jira/ajs/select/single-select"));